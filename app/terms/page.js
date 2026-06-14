import React from 'react';
import styles from './Legal.module.css';

export const metadata = {
  title: 'Terms of Service | Lux Estate Network',
  description: 'Review the compliance terms, membership responsibilities, and legal disclaimers of our investment network.',
};

export default function TermsPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <span className={styles.date}>Effective Date: June 2, 2026</span>

        <section className={styles.section}>
          <h2>1. Investment Disclaimer</h2>
          <p className={styles.highlight}>
            WARNING: Lux Estate Network is an information broker and matchmaking platform. We do not provide financial advice, banking services, or direct investment brokerage. All users must perform their own independent due diligence.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Membership and Slots</h2>
          <p>
            Listing memberships are purchased on an annual subscription basis ($99/year for 3 slots). Users are responsible for managing their slots and maintaining active status limits.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Acceptable Listing Guidelines</h2>
          <p>
            Placements must represent valid investment opportunities (Real estate, private equity, etc.). Any misleading listing details or unauthorized representation will result in immediate termination of publishing privileges.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Dispute Resolution</h2>
          <p>
            Disputes arising from transactions initiated via our network shall be governed under relevant corporate jurisdiction guidelines.
          </p>
        </section>
      </div>
    </div>
  );
}
