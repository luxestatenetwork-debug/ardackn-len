'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FeaturedOpportunities.module.css';

const FEATURED_OPPORTUNITIES = [
  {
    id: 'london-hotel',
    title: 'LONDON HOTEL PORTFOLIO',
    location: 'London, United Kingdom',
    flag: '🇬🇧',
    sector: 'HOTELS & RESORTS',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dubai-luxury',
    title: 'DUBAI LUXURY DEVELOPMENT',
    location: 'Dubai, UAE',
    flag: '🇦🇪',
    sector: 'LUXURY REAL ESTATE',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'singapore-family-office',
    title: 'SINGAPORE FAMILY OFFICE OPPORTUNITY',
    location: 'Singapore',
    flag: '🇸🇬',
    sector: 'PRIVATE EQUITY',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'uk-renewable',
    title: 'UK RENEWABLE ENERGY PROJECT',
    location: 'United Kingdom',
    flag: '🇬🇧',
    sector: 'RENEWABLE ENERGY',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'monaco-waterfront',
    title: 'MONACO WATERFRONT RESIDENCE',
    location: 'Monaco',
    flag: '🇲🇨',
    sector: 'LUXURY REAL ESTATE',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'saudi-infrastructure',
    title: 'SAUDI INFRASTRUCTURE PROJECT',
    location: 'Riyadh, Saudi Arabia',
    flag: '🇸🇦',
    sector: 'INFRASTRUCTURE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FeaturedOpportunities() {
  return (
    <section className={styles.section} id="home-featured-opportunities">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>FEATURED OPPORTUNITIES</h2>
            <p className={styles.subtitle}>
              Selected premium opportunities available within the Lux Estate Network.
            </p>
          </div>
          <Link href="/listings" className={styles.viewAllLink}>
            VIEW ALL OPPORTUNITIES &gt;
          </Link>
        </div>

        <div className={styles.grid}>
          {FEATURED_OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={opp.image} alt={opp.title} className={styles.image} />
              </div>

              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <span className={styles.flag}>{opp.flag}</span>
                  <h3 className={styles.cardTitle}>{opp.title}</h3>
                </div>

                <div className={styles.location}>{opp.location}</div>
                <div className={styles.sector}>{opp.sector}</div>

                <div className={styles.actionRow}>
                  <Link href={`/listings`} className={styles.viewBtn}>
                    VIEW OPPORTUNITY
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
