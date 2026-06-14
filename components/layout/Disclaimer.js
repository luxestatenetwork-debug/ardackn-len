import React from 'react';
import styles from './Disclaimer.module.css';

export default function Disclaimer() {
  return (
    <div className={styles.disclaimerContainer} id="legal-disclaimer">
      <p className={styles.text}>
        <span className={styles.bold}>Disclaimer:</span> This platform is for information purposes only and does not constitute financial advice. All listings are properties of their respective owners.
      </p>
    </div>
  );
}
