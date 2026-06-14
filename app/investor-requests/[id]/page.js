import Link from 'next/link';
import VerificationBadge from '../../../components/VerificationBadge';
import styles from './page.module.css';

const requestsData = {
  'dubai-family-office': {
    flag: '🇦🇪',
    type: 'Family Office',
    title: 'Dubai Family Office',
    seeking: 'Luxury Hotel Acquisitions',
    capitalRange: '$50M – $250M',
    markets: 'UAE, Saudi Arabia, Qatar',
    horizon: '2 – 5 Years',
    description:
      'An established Dubai-based family office with over two decades of hospitality investment experience. Currently seeking strategic hotel acquisitions in the GCC and Mediterranean regions. Preference for branded 5-star properties with proven revenue streams and upside repositioning potential.',
    requirements: [
      '5-star or ultra-luxury branded hotel assets',
      'Minimum 80 keys, maximum 500 keys',
      'Existing revenue with 3-year track record',
      'Clear title and no occupancy encumbrances',
    ],
  },
  'london-private-equity': {
    flag: '🇬🇧',
    type: 'Private Equity',
    title: 'London Private Equity Group',
    seeking: 'Prime Commercial Real Estate',
    capitalRange: '£20M – £100M',
    markets: 'UK, Germany, Netherlands',
    horizon: '3 – 7 Years',
    description:
      'A London-headquartered private equity firm specialising in value-add commercial real estate across Western Europe. Targeting Class-A office buildings, logistics hubs and mixed-use developments in prime city-centre locations.',
    requirements: [
      'Class-A or Class-B+ commercial buildings',
      'WAULT above 4 years preferred',
      'Located in Top 10 European cities',
      'Freehold or long-leasehold title',
    ],
  },
  'singapore-capital-group': {
    flag: '🇸🇬',
    type: 'Venture Capital',
    title: 'Singapore Capital Group',
    seeking: 'AI & Technology Companies',
    capitalRange: '$5M – $50M',
    markets: 'Singapore, Japan, South Korea',
    horizon: '5 – 8 Years',
    description:
      'A Singapore-based venture capital firm with a strong portfolio in deep-tech, enterprise AI and climate technology. Seeking Series B and C investment opportunities with founding teams possessing technical depth and international expansion plans.',
    requirements: [
      'Series B or C funding round',
      'Recurring ARR of $2M+ preferred',
      'Founding team with technical IP',
      'Asia-Pacific market presence',
    ],
  },
  'zurich-wealth-fund': {
    flag: '🇨🇭',
    type: 'Institutional Fund',
    title: 'Zürich Wealth Fund',
    seeking: 'Renewable Energy Infrastructure',
    capitalRange: '€80M – €300M',
    markets: 'Switzerland, Austria, Germany',
    horizon: '10 – 25 Years',
    description:
      'A Swiss institutional fund managing long-duration capital on behalf of pension funds and sovereign clients. Focused on renewable energy infrastructure including utility-scale solar, onshore wind and battery storage in DACH countries.',
    requirements: [
      'Fully permitted greenfield or brownfield projects',
      'Government-backed PPA or FIT agreements',
      'Minimum project capacity of 50MW',
      'IRR target 7–11% gross',
    ],
  },
  'new-york-family-office': {
    flag: '🇺🇸',
    type: 'Family Office',
    title: 'New York Family Office',
    seeking: 'Private Equity & Buyout Deals',
    capitalRange: '$100M – $500M',
    markets: 'USA, Canada, UK',
    horizon: '4 – 8 Years',
    description:
      'A multi-generational US family office with a diversified private markets portfolio. Seeking co-investment and lead buyout opportunities in healthcare, industrial manufacturing, and business services sectors across North America and the UK.',
    requirements: [
      'EBITDA $10M+',
      'Strong management team willing to roll equity',
      'Non-cyclical or defensive industry preferred',
      'Clear exit path within 5–8 years',
    ],
  },
  'abu-dhabi-sovereign': {
    flag: '🇦🇪',
    type: 'Sovereign Fund',
    title: 'Abu Dhabi Capital Allocator',
    seeking: 'Luxury Mixed-Use Developments',
    capitalRange: '$200M – $1B',
    markets: 'GCC, Europe, Asia',
    horizon: '10 – 20 Years',
    description:
      'A capital allocator backed by Abu Dhabi sovereign wealth, seeking large-scale luxury mixed-use development projects globally. Preference for trophy assets combining residential, hospitality, retail and cultural components in strategic gateway cities.',
    requirements: [
      'Trophy waterfront or city-centre locations',
      'Total GDV of $500M or above preferred',
      'International brand partnerships welcome',
      'Sustainability-led design mandatory',
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
    title: `${req.title} – Investor Request | Lux Estate Network`,
    description: req.description,
  };
}

export default function InvestorRequestDetail({ params }) {
  const req = requestsData[params.id];

  if (!req) {
    return (
      <main className={styles.notFound}>
        <h1>Request Not Found</h1>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/#investor-request-board" className={styles.backLink}>
          ← Back to Investor Requests
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
              <h2 className={styles.cardHeading}>Investment Overview</h2>
              <p className={styles.description}>{req.description}</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Key Requirements</h2>
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
              <h3 className={styles.metaHeading}>Investment Parameters</h3>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Seeking</span>
                <span className={styles.metaValue}>{req.seeking}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Capital Range</span>
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
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
