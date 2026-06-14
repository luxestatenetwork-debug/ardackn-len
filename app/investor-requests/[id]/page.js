import Link from 'next/link';
import VerificationBadge from '../../../components/VerificationBadge';
import styles from './page.module.css';

const requestsData = {
  'london-family-office': {
    flag: '🇬🇧',
    type: 'Multi-Generational Family Office',
    title: 'London Family Office (UK)',
    seeking: 'Prime Commercial Real Estate & Luxury Hospitality',
    capitalRange: '£80M – £220M',
    markets: 'UK, Germany, France',
    horizon: '3 – 7 Years',
    description:
      'A multi-generational London family office with deep roots in European real estate and hospitality markets. This capital group seeks institutional-grade commercial buildings and branded hospitality assets across Western Europe, with a preference for established revenue profiles, strong tenant covenants and value-add repositioning potential. Specific investor identity is kept confidential in accordance with LEN privacy protocols.',
    requirements: [
      'Class-A commercial or luxury hospitality assets',
      'Minimum lot size £15M, maximum £100M',
      'WAULT above 4 years (commercial) or 3-year RevPAR track record (hospitality)',
      'Prime city-centre or gateway market locations',
      'Freehold or long-leasehold title preferred',
    ],
  },
  'dubai-sovereign-allocator': {
    flag: '🇦🇪',
    type: 'Sovereign Capital Allocator',
    title: 'Dubai Sovereign Wealth Allocator (UAE)',
    seeking: 'Luxury Hotel Acquisitions & Mixed-Use Developments',
    capitalRange: '$150M – $500M',
    markets: 'GCC, Europe, Asia-Pacific',
    horizon: '10 – 20 Years',
    description:
      'A sovereign-backed capital allocator based in Dubai, deploying long-duration capital into luxury hotel acquisitions and large-scale mixed-use developments across the GCC, European gateway cities and Asia-Pacific. This entity prioritises trophy assets with global brand affiliations, strong international demand fundamentals and long-term capital appreciation. Investor identity maintained under strict confidentiality per LEN protocols.',
    requirements: [
      'Trophy-grade 5-star or ultra-luxury hotel assets',
      'Minimum 150 keys; large mixed-use GDV $200M+',
      'International brand affiliation preferred',
      'Located in recognised gateway or resort destination markets',
      'Sustainability credentials and ESG alignment mandatory',
    ],
  },
  'singapore-venture-capital': {
    flag: '🇸🇬',
    type: 'Venture & Growth Capital',
    title: 'Singaporean Venture Capital Group (SG)',
    seeking: 'Technology, AI & High-Growth Enterprises',
    capitalRange: '$20M – $80M',
    markets: 'Singapore, Japan, South Korea',
    horizon: '5 – 8 Years',
    description:
      'A Singapore-headquartered venture capital group with an active portfolio across enterprise software, artificial intelligence, deep-tech and climate-focused businesses. Seeking Series B through D funding rounds led by technically differentiated founding teams with demonstrable revenue traction and credible Asia-Pacific expansion strategies. Investor identity protected under LEN confidentiality framework.',
    requirements: [
      'Series B, C or D funding stage',
      'ARR of $2M or above preferred',
      'Proprietary technology or data competitive advantage',
      'Founding team with domain and technical depth',
      'Established or credible Asia-Pacific market roadmap',
    ],
  },
  'zurich-institutional-fund': {
    flag: '🇨🇭',
    type: 'Institutional Investment Fund',
    title: 'Zürich Institutional Wealth Fund (CH)',
    seeking: 'Infrastructure, Renewables & Core Real Assets',
    capitalRange: '€100M – €350M',
    markets: 'DACH Region, Benelux',
    horizon: '10 – 25 Years',
    description:
      'A Zürich-based institutional fund managing long-duration mandates on behalf of pension funds and high-net-worth family principals. Focused on core-plus infrastructure, utility-scale renewable energy and core real assets across Switzerland, Germany, Austria and the Benelux region. Investor identity held under strict LEN confidentiality protocols.',
    requirements: [
      'Utility-scale renewable energy (solar >50MW, wind >30MW) or core infrastructure',
      'Government-backed revenue (PPA, FIT, CfD or equivalent)',
      'Fully permitted or late-stage development projects',
      'Target net IRR: 6–10% over long-duration hold',
      'ESG-compliant and aligned with Swiss sustainability standards',
    ],
  },
  'new-york-private-equity': {
    flag: '🇺🇸',
    type: 'Private Equity & Buyout Capital',
    title: 'New York Private Equity Group (USA)',
    seeking: 'Healthcare, Industrials & Business Services',
    capitalRange: '$100M – $400M',
    markets: 'USA, Canada, United Kingdom',
    horizon: '4 – 8 Years',
    description:
      'A New York-based private equity group deploying buyout and growth equity capital into mid-market companies within healthcare services, industrial manufacturing and business services. Preference for founder-led or management-backed situations offering operational improvement potential, strong free cash flow and a realistic exit within 4–8 years. Investor identity protected per LEN privacy framework.',
    requirements: [
      'EBITDA between $8M and $60M',
      'Non-cyclical or defensively positioned business',
      'Management team willing to retain meaningful equity',
      'Clear operational value creation thesis',
      'North American or UK domicile preferred',
    ],
  },
  'abu-dhabi-capital-group': {
    flag: '🇦🇪',
    type: 'Institutional Capital Allocator',
    title: 'Abu Dhabi Capital Group (UAE)',
    seeking: 'Trophy Assets & Luxury Mixed-Use Developments',
    capitalRange: '$200M – $1B+',
    markets: 'Global — GCC, Europe, Asia',
    horizon: '10 – 20 Years',
    description:
      'An Abu Dhabi-based institutional capital allocator deploying sovereign-scale mandates into ultra-premium trophy assets and landmark luxury mixed-use developments globally. Targeting iconic waterfront, city-centre and resort destination projects combining hospitality, residential, retail and cultural programming. Only assets of exceptional global stature are considered. Investor identity held in strict confidence per LEN protocols.',
    requirements: [
      'Trophy or landmark asset in a globally recognised location',
      'Total project GDV of $300M or above',
      'Combination of hospitality, residential and retail programming preferred',
      'International brand and design partnerships welcomed',
      'Sustainability-led masterplan and ESG governance mandatory',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(requestsData).map((id) => ({ id }));
}

export function generateMetadata({ params }) {
  const req = requestsData[params.id];
  if (!req) return { title: 'Not Found' };
  return {
    title: `${req.title} – Investor Profile | Lux Estate Network`,
    description: req.description.slice(0, 160),
  };
}

export default function InvestorRequestDetail({ params }) {
  const req = requestsData[params.id];

  if (!req) {
    return (
      <main className={styles.notFound}>
        <h1>Profile Not Found</h1>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/#investor-request-board" className={styles.backLink}>
          ← Back to Investor Demand
        </Link>

        <div className={styles.hero}>
          <div className={styles.heroTop}>
            <span className={styles.flag}>{req.flag}</span>
            <span className={styles.typeTag}>{req.type}</span>
          </div>
          <h1 className={styles.title}>{req.title}</h1>
          <VerificationBadge />
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Capital Profile Overview</h2>
              <p className={styles.description}>{req.description}</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Investment Requirements</h2>
              <ul className={styles.reqList}>
                {req.requirements.map((r, i) => (
                  <li key={i} className={styles.reqItem}>
                    <span className={styles.reqBullet}>✦</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.metaCard}>
              <h3 className={styles.metaHeading}>Capital Parameters</h3>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Investment Focus</span>
                <span className={styles.metaValue}>{req.seeking}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Available Capital</span>
                <span className={styles.metaValue}>{req.capitalRange}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Target Markets</span>
                <span className={styles.metaValue}>{req.markets}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Investment Horizon</span>
                <span className={styles.metaValue}>{req.horizon}</span>
              </div>
              <Link href="/contact" className={styles.contactBtn}>
                Submit an Opportunity
              </Link>
              <p className={styles.confidentialNote}>
                Investor identity is maintained under strict confidentiality in accordance with LEN network protocols.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
