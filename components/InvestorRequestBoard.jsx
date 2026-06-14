'use client';

import React from 'react';
import Link from 'next/link';
import VerificationBadge from './VerificationBadge';
import styles from './InvestorRequestBoard.module.css';

const requests = [
  {
    id: 'dubai-family-office',
    flag: '🇦🇪',
    type: 'Family Office',
    title: 'Dubai Family Office',
    seeking: 'Luxury Hotel Acquisitions',
    capitalRange: '$50M – $250M',
    markets: 'UAE, Saudi Arabia, Qatar',
  },
  {
    id: 'london-private-equity',
    flag: '🇬🇧',
    type: 'Private Equity',
    title: 'London Private Equity Group',
    seeking: 'Prime Commercial Real Estate',
    capitalRange: '£20M – £100M',
    markets: 'UK, Germany, Netherlands',
  },
  {
    id: 'singapore-capital-group',
    flag: '🇸🇬',
    type: 'Venture Capital',
    title: 'Singapore Capital Group',
    seeking: 'AI & Technology Companies',
    capitalRange: '$5M – $50M',
    markets: 'Singapore, Japan, South Korea',
  },
  {
    id: 'zurich-wealth-fund',
    flag: '🇨🇭',
    type: 'Institutional Fund',
    title: 'Zürich Wealth Fund',
    seeking: 'Renewable Energy Infrastructure',
    capitalRange: '€80M – €300M',
    markets: 'Switzerland, Austria, Germany',
  },
  {
    id: 'new-york-family-office',
    flag: '🇺🇸',
    type: 'Family Office',
    title: 'New York Family Office',
    seeking: 'Private Equity & Buyout Deals',
    capitalRange: '$100M – $500M',
    markets: 'USA, Canada, UK',
  },
  {
    id: 'abu-dhabi-sovereign',
    flag: '🇦🇪',
    type: 'Sovereign Fund',
    title: 'Abu Dhabi Capital Allocator',
    seeking: 'Luxury Mixed-Use Developments',
    capitalRange: '$200M – $1B',
    markets: 'GCC, Europe, Asia',
  },
];

export default function InvestorRequestBoard() {
  return (
    <section className={styles.section} id="investor-request-board">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.label}>ACTIVE INVESTOR DEMAND</p>
          <h2 className={styles.heading}>Verified Investors Seeking Opportunities</h2>
          <p className={styles.subtitle}>
            Verified investors actively seeking opportunities worldwide.
          </p>
          <div className={styles.divider} />
        </div>

        <div className={styles.grid}>
          {requests.map((req) => (
            <div key={req.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.flag}>{req.flag}</span>
                <span className={styles.typeTag}>{req.type}</span>
              </div>

              <h3 className={styles.cardTitle}>{req.title}</h3>

              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Seeking</span>
                <span className={styles.dataValue}>{req.seeking}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Capital Range</span>
                <span className={styles.dataValue}>{req.capitalRange}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Target Markets</span>
                <span className={styles.dataValue}>{req.markets}</span>
              </div>

              <div className={styles.cardFooter}>
                <VerificationBadge />
                <Link href={`/investor-requests/${req.id}`} className={styles.btn}>
                  View Request
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
