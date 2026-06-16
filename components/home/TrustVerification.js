'use client';

import React from 'react';
import styles from './TrustVerification.module.css';

const pillars = [
  {
    id: 'kyc',
    title: 'KYC / KYB Verification',
    desc: 'Every investor and opportunity owner undergoes Know Your Customer and Know Your Business checks before gaining access to the platform.',
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    id: 'accreditation',
    title: 'Accredited Investor Validation',
    desc: 'Only SEC-equivalent accredited investors and qualified purchasers are permitted to view and respond to private capital placements.',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    id: 'due-diligence',
    title: 'Opportunity Due Diligence',
    desc: 'Every listing is reviewed by our compliance team before publication. Unverified, speculative, or incomplete submissions are declined.',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7',
  },
  {
    id: 'nda',
    title: 'NDA-Protected Communication',
    desc: 'All investor-owner communications are conducted under mutual NDA protocols, ensuring full confidentiality at every stage.',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'compliance',
    title: 'Multi-Jurisdictional Compliance',
    desc: 'The platform adheres to regulatory frameworks across the EU, GCC, UK, and Singapore — covering GDPR, DIFC, and MAS requirements.',
    iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'privacy',
    title: 'Private-by-Default Architecture',
    desc: 'Contact details, financial data, and personal information are never exposed publicly. All data is encrypted at rest and in transit.',
    iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
];

const stats = [
  { value: '100%', label: 'Verified Members' },
  { value: '0', label: 'Public Data Exposed' },
  { value: '48h', label: 'Compliance Review SLA' },
  { value: 'AES-256', label: 'Encryption Standard' },
];

export default function TrustVerification() {
  return (
    <section className={styles.section} id="trust-verification">
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.label}>TRUST &amp; VERIFICATION</p>
          <h2 className={styles.heading}>Built on Institutional-Grade Security</h2>
          <p className={styles.subtitle}>
            Every participant on the LEN platform is vetted, verified, and bound by strict compliance protocols.
            We are the private marketplace that serious capital trusts.
          </p>
          <div className={styles.divider} />
        </div>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Pillars grid */}
        <div className={styles.grid}>
          {pillars.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.iconWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                  <path d={p.iconPath} />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarDesc}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom seal */}
        <div className={styles.seal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.sealIcon}>
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className={styles.sealText}>LEN Verified Platform · Private Access · Institutional Standards</span>
        </div>

      </div>
    </section>
  );
}
