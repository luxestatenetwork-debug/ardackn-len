'use client';

import React from 'react';
import Image from 'next/image';
import styles from './FounderSection.module.css';

const credentials = [
  '15+ Years in Global Capital Markets',
  'Former Senior Advisor, GCC Sovereign Wealth',
  'Investor & Advisor to 40+ Portfolio Companies',
  'Member, Global Private Equity Council',
];

export default function FounderSection() {
  return (
    <section className={styles.section} id="founder-ceo">
      <div className={styles.inner}>

        {/* Left — portrait */}
        <div className={styles.portraitCol}>
          <div className={styles.portraitFrame}>
            <Image
              src="/founder-portrait.png"
              alt="Founder & CEO of Lux Estate Network"
              fill
              sizes="(max-width: 767px) 90vw, 480px"
              className={styles.portrait}
              priority={false}
            />
            {/* Gold corner accents */}
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
          </div>

          {/* Floating credential card */}
          <div className={styles.credCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.credIcon}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <p className={styles.credTitle}>LEN Verified Founder</p>
              <p className={styles.credSub}>Platform &amp; Vision Architect</p>
            </div>
          </div>
        </div>

        {/* Right — bio */}
        <div className={styles.bioCol}>
          <p className={styles.label}>FOUNDER &amp; CEO</p>
          <h2 className={styles.heading}>
            A Platform Built by<br />
            <span className={styles.goldName}>Someone Who Understands Capital</span>
          </h2>

          <blockquote className={styles.quote}>
            &ldquo;I built LEN because exceptional investment opportunities and serious capital
            were failing to find each other. The gap was not a lack of deals —
            it was a lack of trust, structure, and access.&rdquo;
          </blockquote>

          <p className={styles.bio}>
            The Lux Estate Network was founded with one mission: to create a
            private, verified marketplace where institutional-grade opportunities
            meet qualified global capital. Every design decision — from onboarding
            to compliance — reflects decades of experience in cross-border deal flow.
          </p>

          <ul className={styles.credList}>
            {credentials.map((c) => (
              <li key={c} className={styles.credItem}>
                <span className={styles.credCheck}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 8 6 12 14 4" />
                  </svg>
                </span>
                {c}
              </li>
            ))}
          </ul>

          <div className={styles.signature}>
            <div className={styles.sigLine} />
            <div className={styles.sigMeta}>
              <p className={styles.sigName}>The Founder, LEN</p>
              <p className={styles.sigRole}>Founder &amp; Chief Executive Officer</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
