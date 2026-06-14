'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CategoryIcon from '../ui/CategoryIcons';
import styles from './CategoryGrid.module.css';

export const CATEGORIES_DATA = [
  { id: 'luxury-real-estate', name: 'Luxury Real Estate', icon: '🏰' },
  { id: 'commercial-real-estate', name: 'Commercial Real Estate', icon: '🏢' },
  { id: 'hotels-resorts', name: 'Hotels & Resorts', icon: '🏨' },
  { id: 'land-banking', name: 'Land Banking', icon: '🗺️' },
  { id: 'private-equity', name: 'Private Equity', icon: '📈' },
  { id: 'startups', name: 'Startups', icon: '🚀' },
  { id: 'angel-investments', name: 'Angel Investments', icon: '😇' },
  { id: 'venture-capital', name: 'Venture Capital', icon: '💼' },
  { id: 'luxury-cars', name: 'Luxury Cars', icon: '🏎️' }, // Labeled explicitly
  { id: 'franchises', name: 'Franchises', icon: '🏪' },
  { id: 'business-acquisitions', name: 'Business Acquisitions', icon: '🤝' },
  { id: 'luxury-yachts', name: 'Luxury Yachts', icon: '🛥️' },
  { id: 'marine-investments', name: 'Marine Investments', icon: '⚓' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '🌉' },
  { id: 'renewable-energy', name: 'Renewable Energy', icon: '⚡' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'healthcare', name: 'Healthcare', icon: '🩺' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  { id: 'industrial-projects', name: 'Industrial Projects', icon: '🏭' },
  { id: 'tourism-projects', name: 'Tourism Projects', icon: '🏖️' },
  { id: 'international-funds', name: 'International Funds', icon: '🌐' },
  { id: 'family-office', name: 'Family Office Opportunities', icon: '🏛️' },
  { id: 'contracting', name: 'Contracting Services', icon: '🏗️' },
];

export const CONSULTANCY_SUBCATEGORIES = [
  { id: 'golden-visa', name: 'Golden Visa', icon: '🛂' },
  { id: 'investment-law', name: 'Investment Law', icon: '⚖️' },
  { id: 'investment-advisory', name: 'Investment Advisory', icon: '📊' },
];

export const ARCHITECTURE_SUBCATEGORIES = [
  { id: 'interior-architecture', name: 'Interior Architecture', icon: '🛋️' },
  { id: 'general-architecture', name: 'General Architecture', icon: '📐' },
];

export default function CategoryGrid() {
  const [consultancyOpen, setConsultancyOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);

  return (
    <section className={styles.section} id="home-categories">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>ASSET CLASSES</span>
          <h2 className={styles.title}>
            PREMIUM <span className="gold-gradient-text">INVESTMENT SECTORS</span>
          </h2>
          <p className={styles.desc}>
            Browse our multi-category capital network. Refined for institutional and high-net-worth allocations.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES_DATA.map((cat) => (
            <Link 
              href={`/listings?category=${cat.id}`} 
              key={cat.id} 
              className={styles.card}
              id={`cat-card-${cat.id}`}
            >
              <CategoryIcon id={cat.id} className={styles.icon} />
              <span className={styles.name}>{cat.name}</span>
            </Link>
          ))}

          {/* Consultancy Services (Clickable/Dropdown Sub-categories) */}
          <div 
            className={`${styles.card} ${styles.consultancyCard} ${consultancyOpen ? styles.open : ''}`}
            onClick={() => setConsultancyOpen(!consultancyOpen)}
            id="cat-card-consultancy"
          >
            <div className={styles.consultancyHeader}>
              <CategoryIcon id="consultancy" className={styles.icon} />
              <span className={styles.name}>Consultancy Services</span>
              <span className={styles.chevron}>{consultancyOpen ? '▲' : '▼'}</span>
            </div>
            
            {consultancyOpen && (
              <div className={styles.subCategories} onClick={(e) => e.stopPropagation()}>
                {CONSULTANCY_SUBCATEGORIES.map((sub) => (
                  <Link 
                    href={`/listings?category=consultancy&sub=${sub.id}`} 
                    key={sub.id} 
                    className={styles.subLink}
                    id={`sub-cat-${sub.id}`}
                  >
                    <CategoryIcon id={sub.id} className={styles.subIcon} />
                    <span className={styles.subName}>{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Architecture Services (Clickable/Dropdown Sub-categories) */}
          <div 
            className={`${styles.card} ${styles.consultancyCard} ${architectureOpen ? styles.open : ''}`}
            onClick={() => setArchitectureOpen(!architectureOpen)}
            id="cat-card-architecture"
          >
            <div className={styles.consultancyHeader}>
              <CategoryIcon id="architecture" className={styles.icon} />
              <span className={styles.name}>Architecture Services</span>
              <span className={styles.chevron}>{architectureOpen ? '▲' : '▼'}</span>
            </div>
            
            {architectureOpen && (
              <div className={styles.subCategories} onClick={(e) => e.stopPropagation()}>
                {ARCHITECTURE_SUBCATEGORIES.map((sub) => (
                  <Link 
                    href={`/listings?category=architecture&sub=${sub.id}`} 
                    key={sub.id} 
                    className={styles.subLink}
                    id={`sub-cat-${sub.id}`}
                  >
                    <CategoryIcon id={sub.id} className={styles.subIcon} />
                    <span className={styles.subName}>{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
