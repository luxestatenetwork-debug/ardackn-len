'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { CATEGORIES_DATA } from '../../components/home/CategoryGrid';
import ListingCard from '../../components/listings/ListingCard';
import styles from './Browse.module.css';

const MOCK_ALL_PLACEMENTS = [
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
    status: 'active'
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
    status: 'active'
  },
  {
    id: 'mock-3',
    title: 'Venture Capital Opportunity - Quantum Cloud AI',
    category: 'venture-capital',
    description: 'Series A funding round for an industry-leading quantum encryption & AI infrastructure software suite. Solid patent portfolio and proven market adoption rates.',
    price: 7500000,
    currency: 'USD',
    location: 'Silicon Valley, California, United States',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'],
    views: 289,
    likes: 42,
    status: 'active'
  },
  {
    id: 'mock-4',
    title: 'Benetti Oasis 40M Superyacht',
    category: 'luxury-yachts',
    description: 'Immaculate 40-meter Benetti yacht delivered in 2023. Features spectacular beach club area, unfolding wings, dip pool, and luxury accommodation for up to 10 guests.',
    price: 22000000,
    currency: 'EUR',
    location: 'Monaco Marina',
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80'],
    views: 189,
    likes: 31,
    status: 'active'
  },
  {
    id: 'mock-5',
    title: '45MW Andalusia Solar Farm',
    category: 'renewable-energy',
    description: 'Fully permitted grid-connected utility-scale solar generation project ready for final assembly. Long term PPA secured with tier-1 utilities.',
    price: 34000000,
    currency: 'USD',
    location: 'Andalusia, Spain',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    views: 154,
    likes: 22,
    status: 'active'
  },
  {
    id: 'mock-6',
    title: 'Prime Napa Valley Vineyard',
    category: 'agriculture',
    description: 'Bespoke operational organic vineyard and estate winery producing award-winning Cabernet Sauvignon. Includes master estate villa and tasting hall.',
    price: 15000000,
    currency: 'USD',
    location: 'Napa Valley, California, United States',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'],
    views: 211,
    likes: 45,
    status: 'active'
  }
];

function BrowsePlacementsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSub = searchParams.get('sub') || '';
  const initialLocation = searchParams.get('location') || '';

  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(initialSub);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync listings from DB, falling back to mock listings if empty
  useEffect(() => {
    const fetchDBListings = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        const dbList = [];
        snapshot.forEach((d) => {
          dbList.push({ id: d.id, ...d.data() });
        });
        
        // If DB has active listings, use them, otherwise use the rich mockups
        if (dbList.length > 0) {
          setPlacements(dbList);
        } else {
          setPlacements(MOCK_ALL_PLACEMENTS);
        }
      } catch (err) {
        console.error("Listing query failed, falling back to mock details:", err);
        setPlacements(MOCK_ALL_PLACEMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDBListings();
  }, []);

  // Filter listings based on selections
  const filteredPlacements = placements.filter((p) => {
    // Category check
    if (category && p.category !== category) return false;
    
    // Sub-category check (Consultancy subcategories)
    if (subCategory && p.subCategory !== subCategory) return false;
    
    // Location check
    if (locationFilter && !p.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    
    // Price range checks
    if (priceMin && p.price < parseFloat(priceMin)) return false;
    if (priceMax && p.price > parseFloat(priceMax)) return false;
    
    // Full text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = p.title?.toLowerCase().includes(term);
      const matchesDesc = p.description?.toLowerCase().includes(term);
      if (!matchesTitle && !matchesDesc) return false;
    }
    
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Investment Marketplace</h1>
          <p className={styles.subtitle}>Explore and analyze active capital placements worldwide.</p>
        </div>

        <div className={styles.layout}>
          {/* Filters Sidebar */}
          <aside className={styles.filtersPanel}>
            <h3 className={styles.panelTitle}>Refine Portfolios</h3>

            <div className={styles.filterField}>
              <label className={styles.label}>Asset Class</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className={styles.select}
                id="filter-category"
              >
                <option value="">All Categories</option>
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="consultancy">Consultancy Services</option>
                <option value="architecture">Architecture Services</option>
              </select>
            </div>

            {category === 'consultancy' && (
              <div className={styles.filterField}>
                <label className={styles.label}>Consultancy Type</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="">All Advisory Types</option>
                  <option value="golden-visa">Golden Visa</option>
                  <option value="investment-law">Investment Law</option>
                  <option value="investment-advisory">Investment Advisory</option>
                </select>
              </div>
            )}

            {category === 'architecture' && (
              <div className={styles.filterField}>
                <label className={styles.label}>Architecture Type</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="">All Architecture Types</option>
                  <option value="interior-architecture">Interior Architecture</option>
                  <option value="general-architecture">General Architecture</option>
                </select>
              </div>
            )}

            <div className={styles.filterField}>
              <label className={styles.label}>Location / Country</label>
              <input
                type="text"
                placeholder="e.g. Geneva, London"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className={styles.input}
                id="filter-location"
              />
            </div>

            <div className={styles.filterField}>
              <label className={styles.label}>Investment Range (USD)</label>
              <div className={styles.rangeRow}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className={styles.input}
                  id="filter-price-min"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className={styles.input}
                  id="filter-price-max"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                setCategory('');
                setSubCategory('');
                setLocationFilter('');
                setPriceMin('');
                setPriceMax('');
                setSearchTerm('');
              }} 
              className={styles.resetBtn}
              id="filter-reset-btn"
            >
              Reset Filters
            </button>
          </aside>

          {/* Main Grid */}
          <main className={styles.mainGrid}>
            <div className={styles.searchBarRow}>
              <input
                type="text"
                placeholder="Search placements by title, description or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                id="filter-search-input"
              />
            </div>

            {loading ? (
              <div className={styles.loading}>Connecting to Capital Network...</div>
            ) : filteredPlacements.length === 0 ? (
              <div className={styles.empty}>
                <p>No active placements match your selected mandates.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredPlacements.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePlacementsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Connecting to Capital Network...</div>}>
      <BrowsePlacementsContent />
    </Suspense>
  );
}
