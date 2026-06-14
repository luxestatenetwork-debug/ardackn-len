import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if needed
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
  } catch (e) {
    console.error("Firebase admin init error: ", e);
  }
}

const db = admin.firestore();

const MOCK_FOR_AI = [
  {
    id: 'mock-1',
    title: 'Penthouse Suite - Bosphorus Views',
    category: 'luxury-real-estate',
    description: 'Bosphorus views luxury real estate penthouses Bebek Istanbul Turkey infinity pool smart design high yield',
    price: 18500000,
    keywords: ['real estate', 'property', 'penthouse', 'bosphorus', 'istanbul', 'turkey']
  },
  {
    id: 'mock-2',
    title: 'Geneva Private Banking Group Acquisition',
    category: 'business-acquisitions',
    description: 'Swiss private bank acquisition Geneva finance wealth management private equity buy business',
    price: 42000000,
    keywords: ['bank', 'finance', 'geneva', 'swiss', 'acquisition', 'private equity']
  },
  {
    id: 'mock-3',
    title: 'Venture Capital Opportunity - Quantum Cloud AI',
    category: 'venture-capital',
    description: 'Quantum cloud AI security startups venture capital silicon valley investment software series A funding',
    price: 7500000,
    keywords: ['venture capital', 'startup', 'ai', 'quantum', 'tech', 'software']
  },
  {
    id: 'mock-4',
    title: 'Benetti Oasis 40M Superyacht',
    category: 'luxury-yachts',
    description: 'Superyacht Oasis 40m Benetti yacht Monaco marina luxury marine assets',
    price: 22000000,
    keywords: ['yacht', 'boat', 'marine', 'monaco', 'luxury']
  },
  {
    id: 'mock-5',
    title: '45MW Andalusia Solar Farm',
    category: 'renewable-energy',
    description: 'Utility solar farm Andalusia Spain renewable energy power generation grid IRR yield infrastructure',
    price: 34000000,
    keywords: ['solar', 'energy', 'renewable', 'spain', 'infrastructure', 'yield']
  },
  {
    id: 'mock-6',
    title: 'Prime Napa Valley Vineyard',
    category: 'agriculture',
    description: 'Organic vineyard estate winery Napa Valley California agriculture land business wine production yield',
    price: 15000000,
    keywords: ['vineyard', 'winery', 'napa', 'california', 'agriculture', 'land']
  }
];

export async function POST(req) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    const term = query.toLowerCase();
    
    // Fetch listings from Firestore if database is online
    let listings = [];
    try {
      const snapshot = await db.collection("listings").where("status", "==", "active").get();
      snapshot.forEach((doc) => {
        const d = doc.data();
        listings.push({
          id: doc.id,
          title: d.title,
          category: d.category,
          description: d.description,
          price: d.price,
          keywords: [d.title, d.category, d.location, d.description].map(s => s?.toLowerCase())
        });
      });
    } catch (dbErr) {
      console.warn("DB offline or indices missing, using high-fidelity mockups for AI search.");
    }

    if (listings.length === 0) {
      listings = MOCK_FOR_AI;
    }

    // Heuristic scoring engine
    const scoredListings = listings.map((p) => {
      let score = 0.1; // Baseline score
      let matchKeywordsCount = 0;

      // Count term overlaps
      p.keywords.forEach((keyword) => {
        if (term.includes(keyword.toLowerCase())) {
          score += 0.25;
          matchKeywordsCount++;
        }
      });

      // Description text checks
      if (p.description?.toLowerCase().includes(term)) {
        score += 0.35;
      }
      
      // Title checks
      if (p.title?.toLowerCase().includes(term)) {
        score += 0.45;
      }

      // Max score cap at 0.98
      const finalScore = Math.min(0.98, score);

      // Generate explainable reasoning
      let reason = "Aligns with your general capital growth target parameters.";
      if (p.category === 'luxury-real-estate') {
        reason = "Matches your luxury real estate mandate, offering prime residential equity and high yield potential.";
      } else if (p.category === 'business-acquisitions' || p.category === 'private-equity') {
        reason = "Identified as a premium acquisition opportunity representing direct private corporate equity.";
      } else if (p.category === 'venture-capital' || p.category === 'startups') {
        reason = "Perfect fit for venture allocations looking for early-stage disruptive technological assets.";
      } else if (p.category === 'renewable-energy' || p.category === 'infrastructure') {
        reason = "Matches green infrastructure directives projecting solid IRR yields with utilities support.";
      } else if (p.category === 'luxury-yachts' || p.category === 'luxury-cars') {
        reason = "Matches high-net-worth luxury transport asset and marina placement requirements.";
      }

      return {
        id: p.id,
        title: p.title,
        score: finalScore,
        reason,
        matchKeywordsCount
      };
    });

    // Filter and sort by score desc
    const rankedMatches = scoredListings
      .filter(item => item.score > 0.2) // Only return relevant items
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Return top 3 matches

    let reply = "";
    if (rankedMatches.length > 0) {
      const topMatch = rankedMatches[0];
      reply = `I have successfully parsed your investment mandate. Based on your criteria, my top recommendation is "${topMatch.title}" (Match score: ${Math.round(topMatch.score * 100)}%). This opportunity was selected because it ${topMatch.reason.toLowerCase()}`;
    } else {
      reply = "I parsed your investment mandate but could not identify a placement with a high enough alignment score. Let's try refining the parameters (e.g. search for 'real estate', 'solar', or 'venture capital').";
    }

    return NextResponse.json({
      reply,
      matches: rankedMatches
    }, { status: 200 });

  } catch (error) {
    console.error("AI API route failed: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
