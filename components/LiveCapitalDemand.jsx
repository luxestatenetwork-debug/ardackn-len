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
    iconPath: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01',
  },
  {
    id: 'commercial-real-estate',
    sector: 'Commercial Real Estate',
    capital: '$85M',
    description: 'Class-A office and mixed-use assets, Western Europe.',
    allocation: 'Capital Allocation Target',
    iconPath: 'M14 14.76V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v11.26M22 21H2M20 21v-7a1 1 0 0 0-1-1h-5M10 21v-4h4v4M10 6h.01M10 10h.01M10 14h.01',
  },
  {
    id: 'technology-companies',
    sector: 'Technology Companies',
    capital: '$40M',
    description: 'Series B – D technology firms with proven revenue.',
    allocation: 'Capital Allocation Target',
    iconPath: 'M4 4h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM2 10h20M12 16v4M8 20h8',
  },
  {
    id: 'renewable-energy',
    sector: 'Renewable Energy',
    capital: '$200M',
    description: 'Solar, wind and energy storage infrastructure projects.',
    allocation: 'Capital Allocation Target',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    id: 'private-equity',
    sector: 'Private Equity',
    capital: '$150M',
    description: 'Buyout and growth equity in healthcare and industrials.',
    allocation: 'Capital Allocation Target',
    iconPath: 'M3 3v18h18M19 9l-5 5-4-4-3 3',
  },
  {
    id: 'hospitality-leisure',
    sector: 'Hospitality & Leisure',
    capital: '$65M',
    description: 'Premium resorts, marinas and lifestyle destinations.',
    allocation: 'Capital Allocation Target',
    iconPath: 'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z',
  },
];

export default function LiveCapitalDemand() {
  return (
    <section className={styles.section} id="live-capital-demand">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.label}>LIVE CAPITAL ALLOCATION</p>
          <h2 className={styles.heading} id="capital-demand-title">Active Capital Seeking Investment</h2>
          <p className={styles.subtitle} id="capital-demand-subtitle">
            Institutional and private capital actively seeking investments.
          </p>
          <div className={styles.divider} />
        </div>

        <div className={styles.grid}>
          {capitalItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.sectorIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <VerificationBadge />
              </div>

              <h3 className={styles.sector}>{item.sector}</h3>

              <div className={styles.capitalBlock}>
                <span className={styles.allocationLabel}>{item.allocation}</span>
                <span className={styles.capitalFigure}>{item.capital}</span>
              </div>

              <p className={styles.description}>{item.description}</p>

              <Link href={`/capital-demand/${item.id}`} className={styles.btn}>
                VIEW DETAILS
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
