'use client';

import React from 'react';
import Link from 'next/link';
import VerificationBadge from './VerificationBadge';
import styles from './InvestorRequestBoard.module.css';

const requests = [
  {
    id: 'dubai-sovereign-allocator',
    countryCode: 'AE',
    region: 'UAE',
    designation: 'Dubai Family Office',
    type: 'Family Office',
    focus: 'Luxury Hotels & Resorts',
    capital: '$250M+',
    markets: 'GCC, Europe, Asia-Pacific',
  },
  {
    id: 'london-family-office',
    countryCode: 'GB',
    region: 'UK',
    designation: 'London Investor Group',
    type: 'Institutional Investor',
    focus: 'Commercial Real Estate',
    capital: '£120M+',
    markets: 'UK, Germany, France',
  },
  {
    id: 'singapore-venture-capital',
    countryCode: 'SG',
    region: 'SG',
    designation: 'Singapore Capital Partners',
    type: 'Capital Partner',
    focus: 'AI & Technology Companies',
    capital: '$75M+',
    markets: 'Singapore, Japan, South Korea',
  },
  {
    id: 'zurich-institutional-fund',
    countryCode: 'CH',
    region: 'CH',
    designation: 'Zurich Institutional Fund',
    type: 'Institutional Fund',
    focus: 'Infrastructure, Renewables & Core Assets',
    capital: '€150M+',
    markets: 'DACH Region, Benelux',
  },
  {
    id: 'new-york-private-equity',
    countryCode: 'US',
    region: 'US',
    designation: 'New York Buyout Group',
    type: 'Private Equity',
    focus: 'Healthcare & Defensively Positioned Assets',
    capital: '$300M+',
    markets: 'USA, Canada, United Kingdom',
  },
  {
    id: 'abu-dhabi-capital-group',
    countryCode: 'AE',
    region: 'UAE',
    designation: 'Abu Dhabi Capital Group',
    type: 'Sovereign Allocator',
    focus: 'Trophy Assets & Master-Planned Developments',
    capital: '$500M+',
    markets: 'Global Markets',
  },
];

export default function InvestorRequestBoard() {
  return (
    <section className={styles.section} id="investor-request-board">
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <p className={styles.label}>ACTIVE INVESTOR DEMAND</p>
          <h2 className={styles.heading} id="requests-title">ACTIVE INVESTOR REQUESTS</h2>
          <p className={styles.subtitle} id="requests-subtitle">
            Showcasing verified capital allocators and real-time private equity interest 
            actively seeking qualified opportunities globally.
          </p>
          <div className={styles.divider} />
        </div>

        {/* ── Grid / Swipeable Carousel ── */}
        <div className={styles.grid}>
          {requests.map((req) => (
            <div key={req.id} className={styles.card}>

              {/* Top row: Flag + Region + Type Tag */}
              <div className={styles.cardTop}>
                <div className={styles.flagRegion}>
                  <img
                    src={`https://flagcdn.com/w40/${req.countryCode.toLowerCase()}.png`}
                    alt={req.region}
                    className={styles.flagIcon}
                  />
                  <span className={styles.region}>{req.region}</span>
                </div>
                <span className={styles.typeTag}>{req.type}</span>
              </div>

              {/* Designation Title */}
              <h3 className={styles.designation}>{req.designation}</h3>

              {/* Data Block */}
              <div className={styles.dataBlock}>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Seeking</span>
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

              {/* Card Footer: Verified Badge + Action Link */}
              <div className={styles.cardFooter}>
                <div className={styles.badgeWrapper}>
                  <VerificationBadge />
                </div>
                <Link href={`/investor-requests/${req.id}`} className={styles.btn}>
                  VIEW PROFILE
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
