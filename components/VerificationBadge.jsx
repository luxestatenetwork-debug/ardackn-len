import React from 'react';
import styles from './VerificationBadge.module.css';

export default function VerificationBadge() {
  return (
    <div className={styles.badge} aria-label="LEN Verified">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles.icon}
        role="img"
        aria-hidden="true"
      >
        <path
          fill="var(--lux-gold)"
          d="M12 1l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-2.01L12 1z"
        />
        <path
          fill="white"
          d="M10 14l-3-3 1.41-1.42L10 11.17l5.59-5.59L17 7l-7 7z"
        />
      </svg>
      <span className={styles.text}>LEN VERIFIED</span>
    </div>
  );
}
