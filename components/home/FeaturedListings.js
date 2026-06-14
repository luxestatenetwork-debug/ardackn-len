'use client';

import React, { useEffect } from 'react';
import { useListingStore } from '../../store/listingStore';
import ListingCard from '../listings/ListingCard';
import styles from './FeaturedListings.module.css';

const FALLBACK_FEATURED = [
  {
    id: 'mock-1',
    title: 'Penthouse Suite - Bosphorus Views',
    category: 'luxury-real-estate',
    description: 'Ultra-exclusive 5-bedroom duplex penthouse overlooking the Bosphorus strait. Complete with private infinity pool, direct elevator entry, and state-of-the-art automation systems.',
    price: 18500000,
    currency: 'USD',
    location: 'Bebek, Istanbul, Turkey',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    views: 450,
    likes: 88,
    featured: true
  },
  {
    id: 'mock-2',
    title: 'Geneva Private Banking Group Acquisition',
    category: 'business-acquisitions',
    description: 'Rare opportunity to acquire a fully licensed boutique wealth management and private banking institution in Geneva. Highly prestigious client portfolio and operational infrastructure.',
    price: 42000000,
    currency: 'USD',
    location: 'Geneva, Switzerland',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
    views: 312,
    likes: 54,
    featured: true
  },
  {
    id: 'mock-3',
    title: 'Venture Capital Opportunity - Quantum Cloud AI',
    category: 'venture-capital',
    description: 'Series A funding round for an industry-leading quantum encryption & AI infrastructure software suite. Solid patent portfolio and proven market adoption rates.',
    price: 7500000,
    currency: 'USD',
    location: 'Silicon Valley, California',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'],
    views: 289,
    likes: 42,
    featured: true
  }
];

export default function FeaturedListings() {
  const { featuredListings, fetchFeaturedListings, loading } = useListingStore();

  useEffect(() => {
    fetchFeaturedListings();
  }, [fetchFeaturedListings]);

  const displayList = featuredListings.length > 0 ? featuredListings : FALLBACK_FEATURED;

  return (
    <section className={styles.section} id="home-featured">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>EXCLUSIVE PLACEMENTS</span>
          <h2 className={styles.title}>
            FEATURED <span className="gold-gradient-text">OPPORTUNITIES</span>
          </h2>
          <p className={styles.desc}>
            Curated investment proposals verified by our private compliance team.
          </p>
        </div>

        {loading ? (
          <div className={styles.loader}>Loading Placements...</div>
        ) : (
          <div className={styles.grid}>
            {displayList.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
