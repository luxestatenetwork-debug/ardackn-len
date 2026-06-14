import React from 'react';
import styles from './WhoUsesLen.module.css';

const USERS = [
  {
    title: "FAMILY OFFICES",
    desc: "Single & Multi Family Offices managing global wealth and legacy portfolios.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    title: "ULTRA HIGH NET WORTH INVESTORS",
    desc: "Individuals seeking exclusive investment opportunities and direct access.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M3 20h18" />
      </svg>
    )
  },
  {
    title: "PRIVATE EQUITY FIRMS",
    desc: "Investment firms deploying capital across private markets globally.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    )
  },
  {
    title: "VENTURE CAPITAL FUNDS",
    desc: "VC funds and angel investors backing innovative high-growth companies.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    )
  },
  {
    title: "REAL ESTATE DEVELOPERS",
    desc: "Developers and operators seeking capital and strategic investment partners.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    )
  },
  {
    title: "HOTEL INVESTMENT GROUPS",
    desc: "Hospitality investors acquiring and developing premium hotel assets.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 22v-6.57" />
        <path d="M12 11h.01" />
        <path d="M12 7h.01" />
        <path d="M14 15.43V22" />
        <path d="M15 16a5 5 0 0 0-6 0" />
        <rect x="4" y="2" width="16" height="20" rx="2" />
      </svg>
    )
  },
  {
    title: "BUSINESS ACQUISITION FIRMS",
    desc: "Firms identifying and acquiring high-value businesses worldwide.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  }
];

export default function WhoUsesLen() {
  return (
    <section className={styles.section} id="home-who-uses-len">
      <div className={styles.container}>
        <div className={styles.titleCol}>
          <h2 className={styles.title}>WHO USES LEN</h2>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.grid}>
          {USERS.map((user, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {user.icon}
              </div>
              <h3 className={styles.cardTitle}>{user.title}</h3>
              <p className={styles.cardDesc}>{user.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
