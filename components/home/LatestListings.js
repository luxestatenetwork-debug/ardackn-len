'use client';

import React, { useEffect } from 'react';
import { useListingStore } from '../../store/listingStore';
import ListingCard from '../listings/ListingCard';
import styles from './LatestListings.module.css';

const FALLBACK_LATEST = [
  {
    id: 'mock-4',
    title: 'Superyacht - Benetti Oasis 40M',
    category: 'luxury-yachts',
    description: 'Immaculate 40-meter Benetti yacht delivered in 2023. Features spectacular beach club area, unfolding wings, dip pool, and luxury accommodation for up to 10 guests.',
    price: 22000000,
    currency: 'EUR',
    location: 'Monaco Marina',
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80'],
    views: 189,
    likes: 31
  },
  {
    id: 'mock-5',
    title: '45MW Solar Farm - Renewable Infrastructure',
    category: 'renewable-energy',
    description: 'Fully permitted grid-connected utility-scale solar generation project ready for final assembly. Long term PPA secured with tier-1 utilities.',
    price: 34000000,
    currency: 'USD',
    location: 'Andalusia, Spain',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    views: 154,
    likes: 22
  },
  {
    id: 'mock-6',
    title: 'Prime Vineyard & Estate Winery',
    category: 'agriculture',
    description: 'Bespoke operational organic vineyard and estate winery producing award-winning Cabernet Sauvignon. Includes master estate villa and tasting hall.',
    price: 15000000,
    currency: 'USD',
    location: 'Napa Valley, California',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'],
    views: 211,
    likes: 45
  }
];

export default function LatestListings() {
  const { listings, fetchListings, loading } = useListingStore();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const displayList = listings.length > 0 ? listings.slice(0, 3) : FALLBACK_LATEST;

  return (
    <section className={styles.section} id="home-latest">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>RECENT PLACEMENTS</span>
          <h2 className={styles.title}>
            LATEST <span className="gold-gradient-text">OPPORTUNITIES</span>
          </h2>
          <p className={styles.desc}>
            Newly uploaded deals in our private capital database. Updated hourly.
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
