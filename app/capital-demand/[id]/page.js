import Link from 'next/link';
import VerificationBadge from '../../../components/VerificationBadge';
import styles from './page.module.css';

const capitalData = {
  'luxury-hotels': {
    sector: 'Luxury Hotels',
    capital: '$120M',
    icon: '🏨',
    category: 'Hospitality',
    markets: 'Europe & GCC',
    dealSize: '$20M – $80M per asset',
    description:
      'Institutional capital targeting branded luxury hotel acquisitions across European gateway cities and GCC resort destinations. Assets must demonstrate stable RevPAR, strong brand affiliation and value-add potential through repositioning or capex improvement.',
    criteria: [
      'Branded 5-star or ultra-luxury classification',
      'Minimum 80 keys; maximum 500 keys',
      'Established RevPAR track record (3+ years)',
      'Clear freehold title or long-term leasehold',
      'Located in gateway European or GCC markets',
    ],
  },
  'commercial-real-estate': {
    sector: 'Commercial Real Estate',
    capital: '$85M',
    icon: '🏢',
    category: 'Real Estate',
    markets: 'Western Europe',
    dealSize: '$15M – $50M per asset',
    description:
      'Capital allocated for value-add commercial real estate in major Western European cities. Focus on Class-A office buildings, logistics assets and urban mixed-use developments with strong lease covenants and institutional-grade specifications.',
    criteria: [
      'Class-A or upgradeable Class-B+ office or logistics',
      'WAULT above 4 years',
      'Located in Top 10 European CBDs or logistics corridors',
      'ESG-compliant or repositionable to ESG standards',
      'Minimum lot size €10M, maximum €50M',
    ],
  },
  'technology-companies': {
    sector: 'Technology Companies',
    capital: '$40M',
    icon: '💻',
    category: 'Venture & Growth',
    markets: 'Asia-Pacific',
    dealSize: '$5M – $20M per investment',
    description:
      'Growth capital targeting enterprise software, deep-tech and AI companies at Series B through D stages. Preference for teams with strong technical IP, recurring revenue, and credible international expansion strategies across Asia-Pacific markets.',
    criteria: [
      'Series B, C or D stage',
      'ARR of $2M or above preferred',
      'Proprietary technology or data moat',
      'Founding team with domain expertise',
      'Asia-Pacific market presence or roadmap',
    ],
  },
  'renewable-energy': {
    sector: 'Renewable Energy',
    capital: '$200M',
    icon: '⚡',
    category: 'Infrastructure',
    markets: 'DACH Region',
    dealSize: '$30M – $100M per project',
    description:
      'Long-duration infrastructure capital targeting utility-scale solar, onshore wind and battery storage projects in Germany, Austria and Switzerland. Preference for projects with government-backed revenue certainty and established grid connections.',
    criteria: [
      'Utility-scale solar (>50MW) or onshore wind (>30MW)',
      'Battery storage assets with grid contracts',
      'Government-backed PPA, FIT or CfD in place',
      'Fully permitted or late-stage development',
      'Target net IRR: 7–11%',
    ],
  },
  'private-equity': {
    sector: 'Private Equity',
    capital: '$150M',
    icon: '📈',
    category: 'Private Equity',
    markets: 'North America & UK',
    dealSize: '$20M – $80M per deal',
    description:
      'Buyout and growth equity capital targeting mid-market companies in healthcare services, industrial manufacturing and business services. Preference for founder-led or management-backed transactions with strong free cash flow characteristics.',
    criteria: [
      'EBITDA between $8M and $50M',
      'Non-cyclical or defensively positioned sector',
      'Management team willing to roll equity',
      'Clear operational improvement thesis',
      'Realistic exit in 4–8 years',
    ],
  },
  'hospitality-leisure': {
    sector: 'Hospitality & Leisure',
    capital: '$65M',
    icon: '⛵',
    category: 'Hospitality',
    markets: 'Mediterranean & Caribbean',
    dealSize: '$10M – $40M per asset',
    description:
      'Capital seeking premium resort, marina and lifestyle destination investments across the Mediterranean and Caribbean. Targets include boutique hotels, private members clubs, yacht marinas and integrated leisure developments with strong experiential positioning.',
    criteria: [
      'Premium resort or lifestyle destination assets',
      'Boutique character with global appeal',
      'Marina, beach club or private members element preferred',
      'Strong seasonal revenue with repeat clientele',
      'ESG and sustainability commitments',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(capitalData).map((id) => ({ id }));
}

export function generateMetadata({ params }) {
  const item = capitalData[params.id];
  if (!item) return { title: 'Not Found' };
  return {
    title: `${item.sector} – Capital Demand | Lux Estate Network`,
    description: item.description,
  };
}

export default function CapitalDemandDetail({ params }) {
  const item = capitalData[params.id];

  if (!item) {
    return (
      <main className={styles.notFound}>
        <h1>Not Found</h1>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/#live-capital-demand" className={styles.backLink}>
          ← Back to Capital Demand
        </Link>

        <div className={styles.hero}>
          <div className={styles.heroTop}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.categoryTag}>{item.category}</span>
          </div>
          <h1 className={styles.title}>{item.sector}</h1>
          <div className={styles.capitalDisplay}>
            <span className={styles.capitalLabel}>Capital Allocation Target</span>
            <span className={styles.capitalFigure}>{item.capital}</span>
          </div>
          <VerificationBadge />
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Capital Overview</h2>
              <p className={styles.description}>{item.description}</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Investment Criteria</h2>
              <ul className={styles.reqList}>
                {item.criteria.map((c, i) => (
                  <li key={i} className={styles.reqItem}>
                    <span className={styles.reqBullet}>✦</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.metaCard}>
              <h3 className={styles.metaHeading}>Capital Parameters</h3>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Sector</span>
                <span className={styles.metaValue}>{item.sector}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Total Capital</span>
                <span className={styles.metaValue}>{item.capital}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Target Markets</span>
                <span className={styles.metaValue}>{item.markets}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Deal Size Range</span>
                <span className={styles.metaValue}>{item.dealSize}</span>
              </div>
              <Link href="/contact" className={styles.contactBtn}>
                Submit an Opportunity
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
