import React from 'react';
import Link from 'next/link';
import Disclaimer from './Disclaimer';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Column: Brand & Address */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logoContainer}>
            <img src="/images/logo.png" alt="Lux Estate Network" className={styles.logoImg} />
          </Link>
          <p className={styles.tagline}>
            The global premium marketplace for elite private capital and luxury investments. Connecting family offices, VCs, and innovators.
          </p>
          <div className={styles.addressSection}>
            <h4 className={styles.colTitle}>Official Address</h4>
            <address className={styles.address}>
              One Canada Square, Canary Wharf,<br />
              London E14 5AB,<br />
              United Kingdom
            </address>
            <a 
              href="https://maps.google.com/?q=One+Canada+Square+Canary+Wharf+London+E14+5AB+United+Kingdom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.mapLink}
              id="footer-map-link"
            >
              View on Google Maps →
            </a>
          </div>
        </div>

        {/* Middle Column: Investment Types */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Opportunities</h4>
          <ul className={styles.list}>
            <li><Link href="/listings?category=real-estate">Luxury Real Estate</Link></li>
            <li><Link href="/listings?category=commercial">Commercial Real Estate</Link></li>
            <li><Link href="/listings?category=private-equity">Private Equity & Startups</Link></li>
            <li><Link href="/listings?category=luxury-cars">Luxury Cars & Yachts</Link></li>
            <li><Link href="/listings?category=alternative">Renewable Energy & Infrastructure</Link></li>
            <li><Link href="/listings?category=consultancy">Golden Visa & Advisory</Link></li>
          </ul>
        </div>

        {/* Right Column: Private Club & Compliance */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Private Club & Compliance</h4>
          <ul className={styles.list}>
            <li><Link href="/about" id="footer-about-link">About The Network</Link></li>
            <li><Link href="/contact">Concierge & VIP Support</Link></li>
            <li><Link href="/privacy">Privacy Policy & Confidentiality</Link></li>
            <li><Link href="/terms">Compliance & Terms of Service</Link></li>
            <li><Link href="/listings?tab=membership">Membership Eligibility</Link></li>
          </ul>
        </div>
      </div>

      {/* Embedded Disclaimer at absolute bottom */}
      <Disclaimer />
      
      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Lux Estate Network. All rights reserved. Registered under global compliance standards.
        </p>
      </div>
    </footer>
  );
}
