'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './About.module.css';

// Animated Counter Component
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const totalFrames = Math.max(Math.floor(duration / 16.6), 1); // ~60fps
    const increment = end / totalFrames;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      start = Math.floor(increment * frame);
      
      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16.6);

    return () => clearInterval(counter);
  }, [target, duration, mounted]);

  // Format large numbers nicely
  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  };

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

const MAP_CITIES = [
  { id: 'losangeles', name: 'Los Angeles', region: 'North America', focus: 'Entertainment, Tech & Luxury Residential', x: 172, y: 155, textAnchor: 'middle', dx: 0, dy: -16 },
  { id: 'newyork', name: 'New York', region: 'North America', focus: 'Venture Capital, Private Equity & Corporate Real Estate', x: 294, y: 137, textAnchor: 'middle', dx: 0, dy: -16 },
  { id: 'miami', name: 'Miami', region: 'North America', focus: 'Latin America Capital & Real Estate', x: 277, y: 178, textAnchor: 'middle', dx: 0, dy: 18 },
  { id: 'london', name: 'London', region: 'Europe', focus: 'Multi-Family Office Advisory, PE & Luxury Real Estate', x: 500, y: 107, textAnchor: 'end', dx: -10, dy: -8 },
  { id: 'paris', name: 'Paris', region: 'Europe', focus: 'Luxury Assets, Sovereign Wealth & Private Equity', x: 507, y: 114, textAnchor: 'start', dx: 10, dy: 12 },
  { id: 'berlin', name: 'Berlin', region: 'Europe', focus: 'PropTech, Venture Capital & Urban Developments', x: 537, y: 104, textAnchor: 'middle', dx: 0, dy: -16 },
  { id: 'vienna', name: 'Vienna', region: 'Europe', focus: 'Private Banking, Wealth Management & Real Estate Funds', x: 545, y: 116, textAnchor: 'start', dx: 8, dy: -6 },
  { id: 'rome', name: 'Rome', region: 'Europe', focus: 'Hospitality, Heritage Real Estate & Capital Placements', x: 535, y: 134, textAnchor: 'end', dx: -8, dy: 12 },
  { id: 'istanbul', name: 'Istanbul', region: 'Europe/Asia', focus: 'Premium Real Estate, Logistics & Infrastructure', x: 580, y: 136, textAnchor: 'middle', dx: 0, dy: -16 },
  { id: 'riyadh', name: 'Riyadh', region: 'Middle East', focus: 'Giga-Projects, Infrastructure & Energy Mandates', x: 630, y: 181, textAnchor: 'end', dx: -12, dy: 8 },
  { id: 'doha', name: 'Doha', region: 'Middle East', focus: 'Strategic Capital Allocations & Real Estate Funds', x: 643, y: 179, textAnchor: 'middle', dx: 0, dy: -18 },
  { id: 'abudhabi', name: 'Abu Dhabi', region: 'Middle East', focus: 'Sovereign Capital & Infrastructure Partnerships', x: 651, y: 185, textAnchor: 'middle', dx: 0, dy: 20 },
  { id: 'dubai', name: 'Dubai', region: 'Middle East', focus: 'Sovereign Wealth Funds & Venture Capital', x: 654, y: 178, textAnchor: 'start', dx: 12, dy: -8 },
  { id: 'singapore', name: 'Singapore', region: 'Asia-Pacific', focus: 'Alternative Assets, Startups & Tech Ventures', x: 788, y: 246, textAnchor: 'middle', dx: 0, dy: 18 },
  { id: 'hongkong', name: 'Hong Kong', region: 'Asia-Pacific', focus: 'Cross-Border Capital, Family Offices & Acquisitions', x: 817, y: 188, textAnchor: 'start', dx: 10, dy: -6 },
  { id: 'shanghai', name: 'Shanghai', region: 'Asia-Pacific', focus: 'Private Wealth, Institutional Capital & Cross-Border Deals', x: 837, y: 163, textAnchor: 'start', dx: 10, dy: -6 }
];

const connections = [
  { from: 'losangeles', to: 'newyork' },
  { from: 'newyork', to: 'miami' },
  { from: 'newyork', to: 'london' },
  { from: 'london', to: 'paris' },
  { from: 'paris', to: 'berlin' },
  { from: 'berlin', to: 'vienna' },
  { from: 'vienna', to: 'rome' },
  { from: 'rome', to: 'istanbul' },
  { from: 'istanbul', to: 'riyadh' },
  { from: 'riyadh', to: 'doha' },
  { from: 'doha', to: 'abudhabi' },
  { from: 'abudhabi', to: 'dubai' },
  { from: 'dubai', to: 'singapore' },
  { from: 'singapore', to: 'hongkong' },
  { from: 'hongkong', to: 'shanghai' }
];

const getArcPath = (x1, y1, x2, y2) => {
  const xMid = (x1 + x2) / 2;
  const yMid = (y1 + y2) / 2;
  const H = Math.abs(x1 - x2) * 0.12; 
  return `M ${x1} ${y1} Q ${xMid} ${yMid - H} ${x2} ${y2}`;
};

// Primary hubs (left-panel key countries) — shown with bold/large markers
// Secondary hubs — shown with smaller markers
// All coordinates: x=(lon+180)*(1000/360), y=(90-lat)*(500/180) — equirectangular projection
const PRIMARY_HUBS = [
  { id: 'newyork',   name: 'New York',  country: 'United States',        x: 294, y: 137, role: 'Americas Hub',            focus: 'Venture Capital, Private Equity & Corporate Real Estate' },
  { id: 'london',    name: 'London',    country: 'United Kingdom',        x: 500, y: 107, role: 'Global Headquarters',     focus: 'Multi-Family Office Advisory, PE & Luxury Real Estate' },
  { id: 'dubai',     name: 'Dubai',     country: 'United Arab Emirates',  x: 654, y: 180, role: 'Middle East Capital Hub', focus: 'Sovereign Wealth Funds & Venture Capital' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore',             x: 788, y: 246, role: 'ASEAN Gateway',           focus: 'Alternative Assets, Startups & Tech Ventures' },
  { id: 'istanbul',  name: 'Istanbul',  country: 'Turkey',                x: 581, y: 136, role: 'East-West Gateway',       focus: 'Premium Real Estate, Logistics & Infrastructure' },
  { id: 'riyadh',    name: 'Riyadh',    country: 'Saudi Arabia',          x: 630, y: 181, role: 'Strategic Partnerships',  focus: 'Giga-Projects, Infrastructure & Energy Mandates' },
  { id: 'doha',      name: 'Doha',      country: 'Qatar',                 x: 643, y: 180, role: 'Investment Advisory',     focus: 'Strategic Capital Allocations & Real Estate Funds' },
  { id: 'zurich',    name: 'Zurich',    country: 'Switzerland',           x: 524, y: 118, role: 'Wealth Management Hub',   focus: 'Private Banking, Asset Allocation & Compliance' },
  { id: 'hongkong',  name: 'Hong Kong', country: 'Hong Kong',             x: 817, y: 188, role: 'APAC Hub',                focus: 'Cross-Border Capital, Family Offices & Acquisitions' },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany',               x: 524, y: 111, role: 'European Capital Hub',   focus: 'Private Equity, Infrastructure & Fund Management' },
];

const SECONDARY_HUBS = [
  { id: 'toronto',   name: 'Toronto',   country: 'Canada',         x: 280, y: 129, role: 'North America',    focus: 'Real Estate & Technology Investments' },
  { id: 'miami',     name: 'Miami',     country: 'United States',  x: 277, y: 178, role: 'Americas Hub',     focus: 'Latin America Capital & Real Estate' },
  { id: 'losangeles', name: 'Los Angeles', country: 'United States', x: 172, y: 155, role: 'US West Coast',   focus: 'Entertainment, Tech & Luxury Residential' },
  { id: 'chicago',   name: 'Chicago',   country: 'United States',  x: 257, y: 134, role: 'US Midwest Hub',   focus: 'Logistics, Commodities & Corporate Property' },
  { id: 'saopaulo',  name: 'Sao Paulo', country: 'Brazil',         x: 371, y: 315, role: 'South America',    focus: 'Private Equity & Real Estate Syndication' },
  { id: 'paris',     name: 'Paris',     country: 'France',         x: 507, y: 114, role: 'European Hub',     focus: 'Luxury Assets, Private Equity & Art' },
  { id: 'berlin',    name: 'Berlin',    country: 'Germany',        x: 537, y: 104, role: 'European Startup Hub', focus: 'PropTech, VC Funds & Urban Developments' },
  { id: 'rome',      name: 'Rome',      country: 'Italy',          x: 535, y: 134, role: 'Mediterranean Hub', focus: 'Hospitality, Heritage Real Estate & Capital' },
  { id: 'madrid',    name: 'Madrid',    country: 'Spain',          x: 490, y: 138, role: 'Iberian Gateway',   focus: 'Real Estate Development & Tourism Assets' },
  { id: 'ankara',    name: 'Ankara',    country: 'Turkey',         x: 591, y: 139, role: 'Capital Advisory',  focus: 'Government Affairs, PPPs & Infrastructure' },
  { id: 'moscow',    name: 'Moscow',    country: 'Russia',         x: 605, y:  95, role: 'Eastern Europe',   focus: 'Energy & Infrastructure Projects' },
  { id: 'cairo',     name: 'Cairo',     country: 'Egypt',          x: 587, y: 167, role: 'North Africa Hub', focus: 'Infrastructure & Regional Development' },
  { id: 'nairobi',   name: 'Nairobi',   country: 'Kenya',          x: 602, y: 254, role: 'East Africa',      focus: 'Emerging Markets & Agriculture' },
  { id: 'capetown',  name: 'Cape Town', country: 'South Africa',   x: 551, y: 344, role: 'Southern Africa',  focus: 'Luxury Residential & VC Allocations' },
  { id: 'mumbai',    name: 'Mumbai',    country: 'India',          x: 703, y: 197, role: 'South Asia Hub',   focus: 'Emerging Market Capital & Startups' },
  { id: 'beijing',   name: 'Beijing',   country: 'China',          x: 824, y: 139, role: 'Greater China',    focus: 'Tech Ventures & Institutional Funds' },
  { id: 'seoul',     name: 'Seoul',     country: 'South Korea',    x: 853, y: 146, role: 'East Asia Tech',   focus: 'VC Funds, Technology & Corporate Real Estate' },
  { id: 'tokyo',     name: 'Tokyo',     country: 'Japan',          x: 889, y: 151, role: 'Japan Hub',        focus: 'Technology, Real Estate & Family Offices' },
  { id: 'sydney',    name: 'Sydney',    country: 'Australia',      x: 920, y: 344, role: 'Oceania Hub',      focus: 'Agriculture & Luxury Real Estate' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia',      x: 903, y: 355, role: 'Oceania South',    focus: 'Property Funds, Tech Startups & Advisory' },
];

const GLOBAL_HUBS = [...PRIMARY_HUBS, ...SECONDARY_HUBS];

const COUNTRY_FLAGS = {
  'United States': 'us',
  'United Kingdom': 'gb',
  'United Arab Emirates': 'ae',
  'Singapore': 'sg',
  'Turkey': 'tr',
  'Saudi Arabia': 'sa',
  'Qatar': 'qa',
  'Switzerland': 'ch',
  'Hong Kong': 'hk',
  'Germany': 'de',
  'Canada': 'ca',
  'Brazil': 'br',
  'France': 'fr',
  'Italy': 'it',
  'Spain': 'es',
  'Russia': 'ru',
  'Egypt': 'eg',
  'Kenya': 'ke',
  'South Africa': 'za',
  'India': 'in',
  'China': 'cn',
  'South Korea': 'kr',
  'Japan': 'jp',
  'Australia': 'au'
};

export default function AboutPageClient() {
  const [founderImage, setFounderImage] = useState('/images/founder_portrait.png');
  const [hoveredHub, setHoveredHub] = useState(null);
  const fileInputRef = useRef(null);

  // Generate dense, premium dot-matrix world map coordinates
  const mapDots = React.useMemo(() => {
    const dots = [];
    const spacing = 8; // denser grid spacing for an ultra-premium look
    const polygons = [
      // North America
      [[80, 70], [300, 70], [330, 180], [300, 190], [270, 190], [230, 240], [200, 240], [220, 180], [140, 160], [120, 110]],
      // Greenland
      [[360, 40], [420, 40], [400, 80], [370, 70]],
      // South America
      [[290, 240], [330, 250], [390, 290], [420, 320], [370, 430], [340, 440], [320, 350], [300, 310]],
      // Europe
      [[430, 150], [460, 120], [490, 60], [520, 60], [520, 100], [580, 100], [580, 150], [540, 170], [520, 180], [480, 180]],
      // Africa
      [[440, 210], [520, 200], [580, 230], [590, 270], [530, 390], [500, 390], [450, 310], [430, 260]],
      // Asia
      [[580, 100], [860, 60], [900, 90], [920, 140], [840, 200], [860, 230], [800, 280], [750, 290], [670, 270], [640, 220], [580, 190]],
      // Australia
      [[780, 330], [860, 330], [880, 370], [840, 420], [790, 400]],
      // UK / Iceland
      [[430, 100], [450, 100], [450, 130], [430, 130]]
    ];

    function isPointInPolygon(point, vs) {
      const x = point[0], y = point[1];
      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    for (let x = 30; x < 970; x += spacing) {
      for (let y = 30; y < 450; y += spacing) {
        let isInside = false;
        for (const poly of polygons) {
          if (isPointInPolygon([x, y], poly)) {
            isInside = true;
            break;
          }
        }
        if (isInside) {
          dots.push({ x, y, id: `${x}-${y}` });
        }
      }
    }
    return dots;
  }, []);

  // Load uploaded image from localStorage if it exists
  useEffect(() => {
    try {
      const savedImage = localStorage.getItem('founder_uploaded_image');
      if (savedImage) {
        setFounderImage(savedImage);
      }
    } catch (e) {
      console.error('Failed to load founder image from storage', e);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası yükleyin.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        setFounderImage(base64Data);
        try {
          localStorage.setItem('founder_uploaded_image', base64Data);
        } catch (e) {
          console.warn('Storage quota exceeded, keeping in memory only');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFounderImage = () => {
    setFounderImage(null);
    try {
      localStorage.removeItem('founder_uploaded_image');
    } catch (e) {}
  };

  const triggerUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}></div>
        <div className={`${styles.heroContent} ${styles.fadeIn}`}>
          <span className={styles.heroSubtitle}>Lux Estate Network</span>
          <h1 className={styles.heroTitle}>ABOUT LUX ESTATE NETWORK</h1>
          <p className={styles.heroDescription}>
            Lux Estate Network is a private global investment platform connecting investors, family offices, venture capital firms, private equity groups, developers, and entrepreneurs through carefully curated opportunities worldwide.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/listings" className={styles.btnPrimary}>
              Explore Opportunities
            </Link>
            <Link href="/register" className={styles.btnSecondary}>
              Join LEN
            </Link>
          </div>
        </div>
      </section>

      {/* Global Statistics Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={150} suffix="+" />
              </span>
              <span className={styles.statLabel}>Countries</span>
            </div>
            
            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={12000} suffix="+" />
              </span>
              <span className={styles.statLabel}>Global Investors</span>
            </div>
            
            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={850} suffix="+" />
              </span>
              <span className={styles.statLabel}>Family Offices</span>
            </div>

            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={620} suffix="+" />
              </span>
              <span className={styles.statLabel}>Venture Capital</span>
            </div>

            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={480} suffix="+" />
              </span>
              <span className={styles.statLabel}>Private Equity</span>
            </div>

            <div className={styles.statCard}>
              <span className={`${styles.statNumber} gold-gradient-text`}>
                <AnimatedCounter target={15} prefix="$" suffix="B+" />
              </span>
              <span className={styles.statLabel}>Luxury Investments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are & Our Mission Split Sections */}
      <section className={styles.container}>
        <div className={styles.splitSection}>
          {/* Who We Are */}
          <div className={`${styles.splitRow} ${styles.fadeIn}`}>
            <div className={styles.splitContent}>
              <span className={styles.sectionLabel}>Overview</span>
              <h2 className={styles.sectionTitle}>A Private Global Investment Network</h2>
              <p className={styles.sectionText}>
                Lux Estate Network is designed for qualified investors and premium opportunity providers seeking meaningful connections in real estate, private capital, startups, hospitality, infrastructure, and alternative investments.
              </p>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 11 2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.featureTitle}>Qualified Investor Standards</h4>
                    <p className={styles.featureDesc}>We verify and qualify our network participants to ensure institutional-level credibility.</p>
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.featureTitle}>Institutional Assets</h4>
                    <p className={styles.featureDesc}>Direct access to transaction structures from real estate syndications to tech capital rounds.</p>
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      <path d="M2 12h20"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.featureTitle}>Global Capital Flows</h4>
                    <p className={styles.featureDesc}>Sovereign funds, family offices, and developers interacting across borders.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.splitVisual}>
              <div className={styles.imageVisualContainer}>
                <img 
                  src="/images/private_boardroom.png" 
                  alt="Lux Private Capital Boardroom" 
                  className={styles.visualImage} 
                />
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className={styles.splitRow}>
            <div className={styles.splitContent}>
              <span className={styles.sectionLabel}>Corporate Mandate</span>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <p className={styles.sectionText}>
                To create the world's most trusted network for premium investment opportunities and strategic capital connections across international markets. We are dedicated to providing transparency, institutional security, and elite matches for premium wealth generators and opportunity sponsors.
              </p>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.featureTitle}>Unlocking Alternative Allocations</h4>
                    <p className={styles.featureDesc}>Connecting capital directly with exclusive non-correlated asset classes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.splitVisual}>
              <div className={styles.imageVisualContainer}>
                <img 
                  src="/images/luxury_investments.png" 
                  alt="Luxury Architectural and Yacht Developments" 
                  className={styles.visualImage} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Sectors Section */}
      <section className={styles.sectorsSection}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <span className={styles.sectionLabel}>Portfolio Scope</span>
            <h2 className={styles.sectionTitle}>Elite Investment Sectors</h2>
            <p className={styles.sectionText}>
              Lux Estate Network offers comprehensive coverage across institutional and private high-net-worth asset classes.
            </p>
          </div>
          
          <div className={styles.sectorsGrid}>
            {[
              { name: 'Luxury Real Estate', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', desc: 'Prestige estates, exclusive residential complexes, and ultra-high-end private villas.' },
              { name: 'Commercial Real Estate', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', desc: 'Prime office towers, flagship retail galleries, and luxury multi-family developments.' },
              { name: 'Hotels & Resorts', icon: 'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v4 M10 1v4 M14 1v4', desc: 'Ultra-luxury hospitality assets, boutique resorts, and world-class tourist destinations.' },
              { name: 'Startups', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', desc: 'Early-stage technologies, disruptive business models, and high-growth innovation.' },
              { name: 'Venture Capital', icon: 'M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z', desc: 'Series A/B rounds and high-tech syndicates aiming for hyper-scale exits.' },
              { name: 'Private Equity', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', desc: 'Growth capital, leveraged buyouts, and strategic recapitalization of private enterprises.' },
              { name: 'Infrastructure', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0', desc: 'Institutional highways, logistics parks, maritime hubs, and public-private transport projects.' },
              { name: 'Renewable Energy', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', desc: 'Utility-scale solar farms, onshore/offshore wind assets, and smart-grid energy storage.' },
              { name: 'International Funds', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v12M6 12h12', desc: 'Cross-border mutual allocations, institutional trusts, and tax-efficient structures.' },
              { name: 'Business Acquisitions', icon: 'M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1 M23 12h-8M20 9l3 3-3 3', desc: 'M&A advisory, corporate integrations, and acquisition of cash-flowing operations.' },
              { name: 'Family Offices', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', desc: 'Exclusive single and multi-family mandates covering legacy preservation.' },
              { name: 'Luxury Assets', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', desc: 'Superyachts, private aviation fleets, blue-chip fine art, and rare collectables.' }
            ].map((sector, idx) => (
              <div key={idx} className={styles.sectorCard}>
                <svg className={styles.sectorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={sector.icon} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className={styles.sectorName}>{sector.name}</h3>
                <p className={styles.sectorDesc}>{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LEN Section */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <span className={styles.sectionLabel}>Core Competencies</span>
            <h2 className={styles.sectionTitle}>Why Lux Estate Network</h2>
            <p className={styles.sectionText}>
              Providing the standard of service, technology, and discretion that institutional capital allocators expect.
            </p>
          </div>
          
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <span className={styles.whyNum}>01</span>
              <h3 className={styles.whyTitle}>Verified Opportunities</h3>
              <p className={styles.whyText}>Every listing is reviewed before publication. We verify deal structures, ownership, and credentials to maintain high-integrity flow.</p>
            </div>
            
            <div className={styles.whyCard}>
              <span className={styles.whyNum}>02</span>
              <h3 className={styles.whyTitle}>Elite Investor Network</h3>
              <p className={styles.whyText}>Connect with qualified global investors. Engage directly with family office principals, accredited UHNWIs, and fund allocators.</p>
            </div>
            
            <div className={styles.whyCard}>
              <span className={styles.whyNum}>03</span>
              <h3 className={styles.whyTitle}>Premium Visibility</h3>
              <p className={styles.whyText}>Reach decision-makers and capital allocators. List through target channels that isolate opportunities from search noise.</p>
            </div>
            
            <div className={styles.whyCard}>
              <span className={styles.whyNum}>04</span>
              <h3 className={styles.whyTitle}>AI-Powered Insights</h3>
              <p className={styles.whyText}>Advanced investment intelligence tools. Our algorithmic engines parse mandates to recommend high-probability matches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section — Premium Redesign */}
      <section className={styles.presenceSection}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.presenceHeader}>
            <span className={styles.sectionLabel}>GLOBAL COVERAGE</span>
            <h2 className={styles.presenceTitle}>GLOBAL CAPITAL NETWORK</h2>
            <div className={styles.crownDivider}>♛</div>
            <p className={styles.presenceDescriptionText}>
              Connecting premium opportunities with qualified investors worldwide.
            </p>
          </div>

          <div className={styles.commandCenter}>
            <div className={styles.mapContainer}>
              {/* SVG Map */}
              <svg viewBox="0 0 1000 500" className={styles.worldMapSvg}>
                {/* Connection lines */}
                {connections.map((conn, idx) => {
                  const fromCity = MAP_CITIES.find(c => c.id === conn.from);
                  const toCity = MAP_CITIES.find(c => c.id === conn.to);
                  if (!fromCity || !toCity) return null;
                  const pathD = getArcPath(fromCity.x, fromCity.y, toCity.x, toCity.y);
                  return (
                    <g key={`conn-${idx}`}>
                      <path
                        d={pathD}
                        className={styles.connectionLineBg}
                      />
                      <path
                        d={pathD}
                        className={styles.connectionLineActive}
                      />
                    </g>
                  );
                })}

                {/* Map landmass dots */}
                {mapDots.map((dot) => (
                  <circle
                    key={dot.id}
                    cx={dot.x}
                    cy={dot.y}
                    r={1.2}
                    className={styles.mapLandDot}
                  />
                ))}

                {/* City Nodes */}
                {MAP_CITIES.map((city) => {
                  const isHovered = hoveredHub && hoveredHub.id === city.id;
                  return (
                    <g
                      key={city.id}
                      className={`${styles.mapMarkerGroup} ${isHovered ? styles.markerHovered : ''}`}
                      onMouseEnter={() => setHoveredHub(city)}
                      onMouseLeave={() => setHoveredHub(null)}
                      transform={`translate(${city.x}, ${city.y})`}
                    >
                      {/* Pulsing ring */}
                      <circle r="12" className={styles.mapMarkerOuterRing} />
                      <circle r="6" className={styles.mapMarkerMiddleRing} />
                      {/* Core */}
                      <circle r="3.5" className={styles.mapMarkerInnerCircle} />
                      {/* City name text label on map */}
                      <text
                        dx={city.dx || 0}
                        dy={city.dy || -16}
                        textAnchor={city.textAnchor || "middle"}
                        className={styles.mapCityTextLabel}
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Executive Terminal Panel */}
              <div className={styles.commandPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.radarPing}></div>
                  <span className={styles.panelTag}>HUB INQUIRY RADAR</span>
                </div>
                <div className={styles.panelDivider}></div>
                
                {hoveredHub ? (
                  <div className={styles.panelBody}>
                    <div className={styles.panelField}>
                      <span className={styles.fieldLabel}>City Hub</span>
                      <span className={styles.fieldValueCity}>{hoveredHub.name}</span>
                    </div>
                    <div className={styles.panelField}>
                      <span className={styles.fieldLabel}>Region</span>
                      <span className={styles.fieldValue}>{hoveredHub.region}</span>
                    </div>
                    <div className={styles.panelField}>
                      <span className={styles.fieldLabel}>Investment Focus</span>
                      <span className={styles.fieldValueFocus}>{hoveredHub.focus}</span>
                    </div>
                    <div className={styles.panelField}>
                      <span className={styles.fieldLabel}>Status</span>
                      <span className={styles.fieldValueStatus}>● Connected & Online</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.panelBodyEmpty}>
                    <p className={styles.panelPlaceholder}>
                      HOVER OVER A FINANCIAL NODE TO ESTABLISH LINK & DECRYPT MANDATE FOCUS
                    </p>
                    <div className={styles.radarLines}>
                      <span>[SYS STATUS: READY]</span>
                      <span>[COGNITIVE FEED: ACTIVE]</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.founderHeading}>
            <span className={styles.sectionLabel}>Leadership</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Message From The Founder</h2>
          </div>

          <div className={styles.founderLayout}>
            {founderImage === null ? (
              // Placeholder State
              <div className={styles.uploadPlaceholder}>
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <h3 className={styles.uploadTitle}>Founder Image Required</h3>
                <p className={styles.uploadText}>
                  To align with administrative policy, a verification photograph must be provided. Please select and upload the founder's corporate portrait to activate this profile.
                </p>
                <button className={styles.uploadBtn} onClick={triggerUploadClick}>
                  Upload Photograph
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className={styles.fileInput} 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            ) : (
              // Profile State (Wait for upload before rendering)
              <div className={styles.activeProfileLayout}>
                <div className={styles.founderImgContainer}>
                  <img src={founderImage} alt="Founder photograph" className={styles.founderImg} />
                </div>
                <div className={styles.founderDetails}>
                  <span className={styles.quoteIcon}>“</span>
                  <blockquote className={styles.founderMessage}>
                    Lux Estate Network was founded on a simple belief:
                    <br/>
                    Not every opportunity deserves attention, and not every platform deserves exceptional opportunities.
                    <br/>
                    In today's digital world, countless investment platforms are overcrowded with unverified listings, low-quality projects, and endless noise. We chose a different path.
                    <br/>
                    Lux Estate Network is intentionally selective.
                    <br/>
                    Our mission is not to become the largest marketplace in the world. Our mission is to become one of the most respected private investment networks for qualified investors, family offices, entrepreneurs, developers, fund managers, and business owners.
                    <br/>
                    We believe exclusivity creates value.
                  </blockquote>
                  <h4 className={styles.founderName}>Arda Çakin</h4>
                  <p className={styles.founderRole}>Founder & CEO</p>
                  
                  <div className={styles.founderActionRow}>
                    <button className={styles.changePhotoBtn} onClick={triggerUploadClick}>
                      Update Photo
                    </button>
                    <span style={{ color: 'var(--text-muted)' }}>|</span>
                    <button className={styles.changePhotoBtn} onClick={removeFounderImage} style={{ color: 'var(--accent-red)' }}>
                      Remove Photo
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className={styles.fileInput} 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call-To-Action (CTA) Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>JOIN THE WORLD'S MOST EXCLUSIVE INVESTMENT NETWORK</h2>
          <p className={styles.ctaText}>
            Unlock access to off-market transactions, family office mandates, and premium startup equity rounds.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register?role=investor" className={styles.btnPrimary}>
              Become an Investor
            </Link>
            <Link href="/listings/create" className={styles.btnSecondary}>
              Publish Opportunity
            </Link>
            <Link href="/listings" className={styles.btnSecondary} style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>
              Explore Investments
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
