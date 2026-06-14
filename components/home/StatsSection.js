import React from 'react';
import styles from './StatsSection.module.css';

export default function StatsSection() {
  return (
    <section className={styles.section} id="home-stats">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.label}>Total Placements</span>
            <span className={styles.value}>$12.8B+</span>
            <p className={styles.text}>Capital value listed and structured across asset classes.</p>
          </div>
          
          <div className={styles.card}>
            <span className={styles.label}>Global Members</span>
            <span className={styles.value}>1,500+</span>
            <p className={styles.text}>Verified Family Offices, VCs, and Ultra-High-Net-Worth individuals.</p>
          </div>
          
          <div className={styles.card}>
            <span className={styles.label}>Match Accuracy</span>
            <span className={styles.value}>94.2%</span>
            <p className={styles.text}>AI recommendation relevancy based on mandate analysis.</p>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Avg. Close Time</span>
            <span className={styles.value}>45 Days</span>
            <p className={styles.text}>From initial contact request to final investment execution.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
