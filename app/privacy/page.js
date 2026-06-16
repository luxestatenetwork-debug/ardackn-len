import React from 'react';
import styles from './Legal.module.css';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Understand how Lux Estate Network protects and manages your investment data, private credentials, and personal information in compliance with GDPR and global regulations.',
  alternates: { canonical: 'https://luxestatenetwork.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <span className={styles.date}>Effective Date: June 2, 2026</span>

        <section className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal identity information necessary to secure your access to our private investment marketplace, including email addresses, company names, credentials, and financial parameters.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Data Processing and GDPR Compliance</h2>
          <p>
            Under GDPR regulations, we process data based on legitimate business interests and explicit consent. Users have the right to request access, rectification, or complete erasure of their account records at any time.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Cookies and Consent</h2>
          <p>
            We deploy secure session cookies to verify authorization keys and protect site integrity. You can manage preferences using our cookie banner settings.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Security Safeguards</h2>
          <p>
            All communications and database documents are encrypted in transit and at rest using Firebase Firestore security configurations and transport Layer Security (TLS).
          </p>
        </section>
      </div>
    </div>
  );
}
