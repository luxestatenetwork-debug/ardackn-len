'use client';

import React from 'react';
import Link from 'next/link';
import VerificationBadge from './VerificationBadge';
import styles from './LiveCapitalDemand.module.css';

const capitalItems = [
  {
    id: 'luxury-hotels',
    sector: 'Luxury Hotels',
    capital: '$120M',
    description: 'Hospitality assets in Europe and GCC regions.',
    allocation: 'Capital Allocation Target',
    icon: '🏨',
  },
  {
    id: 'commercial-real-estate',
    sector: 'Commercial Real Estate',
    capital: '$85M',
    description: 'Class-A office and mixed-use assets, Western Europe.',
    allocation: 'Capital Allocation Target',
    icon: '🏢',
  },
  {
    id: 'technology-companies',
    sector: 'Technology Companies',
    capital: '$40M',
    description: 'Series B – D technology firms with proven revenue.',
    allocation: 'Capital Allocation Target',
    icon: '💻',
  },
  {
    id: 'renewable-energy',
    sector: 'Renewable Energy',
    capital: '$200M',
    description: 'Solar, wind and energy storage infrastructure projects.',
    allocation: 'Capital Allocation Target',
    icon: '⚡',
  },
  {
    id: 'private-equity',
    sector: 'Private Equity',
    capital: '$150M',
    description: 'Buyout and growth equity in healthcare and industrials.',
    allocation: 'Capital Allocation Target',
    icon: '📈',
  },
  {
    id: 'hospitality-leisure',
    sector: 'Hospitality & Leisure',
    capital: '$65M',
    description: 'Premium resorts, marinas and lifestyle destinations.',
    allocation: 'Capital Allocation Target',
    icon: '⛵',
  },
];

export default function LiveCapitalDemand() {
  return (
    <section className={styles.section} id="live-capital-demand">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.label}>LIVE CAPITAL ALLOCATION</p>
          <h2 className={styles.heading}>Active Capital Seeking Investment</h2>
          <p className={styles.subtitle}>
            Institutional and private capital actively seeking investments.
          </p>
          <div className={styles.divider} />
        </div>

        <div className={styles.grid}>
          {capitalItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{item.icon}</span>
                <VerificationBadge />
              </div>

              <h3 className={styles.sector}>{item.sector}</h3>

              <div className={styles.capitalBlock}>
                <span className={styles.allocationLabel}>{item.allocation}</span>
                <span className={styles.capitalFigure}>{item.capital}</span>
              </div>

              <p className={styles.description}>{item.description}</p>

              <Link href={`/capital-demand/${item.id}`} className={styles.btn}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
