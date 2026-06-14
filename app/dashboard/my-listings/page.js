'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { useListingStore } from '../../../store/listingStore';
import { useUiStore } from '../../../store/uiStore';
import styles from './MyListings.module.css';

export default function MyListingsPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const { fetchMyListings, deleteListing } = useListingStore();
  const { addToast } = useUiStore();
  const router = useRouter();
  
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchMyListings(user.uid);
      setMyListings(data);
    } catch (err) {
      addToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        await deleteListing(id, user.uid);
        addToast('Listing deleted successfully.', 'success');
        loadListings();
      } catch (err) {
        addToast(err.message || 'Error deleting listing.', 'error');
      }
    }
  };

  if (authLoading || !user) {
    return <div className={styles.loading}>Loading authorization...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Listings</h1>
          <Link href="/dashboard" className={styles.backBtn}>Back to Dashboard</Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading your portfolio...</div>
        ) : myListings.length === 0 ? (
          <div className={styles.empty}>
            <p>You have no active listings.</p>
            {profile?.role === 'owner' && (
              <Link href="/listings/create" className={styles.createBtn}>Publish New Placement</Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {myListings.map(listing => (
              <div key={listing.id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.cardPrice}>{listing.currency} {listing.price?.toLocaleString()}</p>
                  <p className={styles.cardStatus}>Status: {listing.status}</p>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleDelete(listing.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
