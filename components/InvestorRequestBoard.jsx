'use client';

import React from 'react';
import Link from 'next/link';
import VerificationBadge from './VerificationBadge';
import styles from './InvestorRequestBoard.module.css';

const requests = [
  {
    id: 'london-family-office',
    flag: '🇬🇧',
    region: 'United Kingdom',
    designation: 'London Family Office (UK)',
    type: 'Multi-Generational Family Office',
    focus: 'Prime Commercial Real Estate & Luxury Hospitality',
    capital: '£80M – £220M',
    markets: 'UK, Germany, France',
  },
  {
    id: 'dubai-sovereign-allocator',
    flag: '🇦🇪',
    region: 'UAE',
    designation: 'Dubai Sovereign Wealth Allocator (UAE)',
    type: 'Sovereign Capital Allocator',
    focus: 'Luxury Hotel Acquisitions & Mixed-Use Developments',
    capital: '$150M – $500M',
    markets: 'GCC, Europe, Asia-Pacific',
  },
  {
    id: 'singapore-venture-capital',
    flag: '🇸🇬',
    region: 'Singapore',
    designation: 'Singaporean Venture Capital Group (SG)',
    type: 'Venture & Growth Capital',
    focus: 'Technology, AI & High-Growth Enterprises',
    capital: '$20M – $80M',
    markets: 'Singapore, Japan, South Korea',
  },
  {
    id: 'zurich-institutional-fund',
    flag: '🇨🇭',
    region: 'Switzerland',
    designation: 'Zürich Institutional Wealth Fund (CH)',
    type: 'Institutional Investment Fund',
    focus: 'Infrastructure, Renewables & Core Real Assets',
    capital: '€100M – €350M',
    markets: 'DACH Region, Benelux',
  },
  {
    id: 'new-york-private-equity',
    flag: '🇺🇸',
    region: 'United States',
    designation: 'New York Private Equity Group (USA)',
    type: 'Private Equity & Buyout Capital',
    focus: 'Healthcare, Industrials & Business Services',
    capital: '$100M – $400M',
    markets: 'USA, Canada, United Kingdom',
  },
  {
    id: 'abu-dhabi-capital-group',
    flag: '🇦🇪',
    region: 'Abu Dhabi',
    designation: 'Abu Dhabi Capital Group (UAE)',
    type: 'Institutional Capital Allocator',
    focus: 'Trophy Assets & Luxury Mixed-Use Developments',
    capital: '$200M – $1B+',
    markets: 'Global — GCC, Europe, Asia',
  },
];

export default function InvestorRequestBoard() {
  return (
    <section className={styles.section} id="investor-request-board">
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <p className={styles.label}>ACTIVE INVESTOR DEMAND</p>
          <h2 className={styles.heading}>Verified Capital Seeking Opportunities</h2>
          <p className={styles.subtitle}>
            A regional overview of verified institutional and private capital actively allocating
            across global markets within the Lux Estate Network ecosystem.
          </p>
          <div className={styles.divider} />
        </div>

        {/* ── Grid ── */}
        <div className={styles.grid}>
          {requests.map((req) => (
            <div key={req.id} className={styles.card}>

              {/* Top row: flag + region + type tag */}
              <div className={styles.cardTop}>
                <div className={styles.flagRegion}>
                  <span className={styles.flag}>{req.flag}</span>
                  <span className={styles.region}>{req.region}</span>
                </div>
                <span className={styles.typeTag}>{req.type}</span>
              </div>

              {/* Designation */}
              <h3 className={styles.designation}>{req.designation}</h3>

              {/* Data rows */}
              <div className={styles.dataBlock}>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Investment Focus</span>
                  <span className={styles.dataValue}>{req.focus}</span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Available Capital</span>
                  <span className={styles.capitalFigure}>{req.capital}</span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Target Markets</span>
                  <span className={styles.dataValue}>{req.markets}</span>
                </div>
              </div>

              {/* Footer: badge + CTA */}
              <div className={styles.cardFooter}>
                <VerificationBadge />
                <Link href={`/investor-requests/${req.id}`} className={styles.btn}>
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Confidentiality Note ── */}
        <p className={styles.disclaimer}>
          Data reflects aggregate market capital interest within the Lux Estate Network private ecosystem.
          Specific investor identities remain strictly confidential.
        </p>

      </div>
    </section>
  );
}
