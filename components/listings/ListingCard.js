'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useListingStore } from '../../store/listingStore';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  const {
    id,
    title,
    category,
    description,
    price,
    currency = 'USD',
    location,
    images = [],
    coverImage,
    views = 0,
    likes = 0,
    dislikes = 0,
    likedBy = [],
    dislikedBy = [],
    ownerId,
  } = listing;

  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const { likeListing, dislikeListing } = useListingStore();
  const router = useRouter();

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);
  const [localLikedBy, setLocalLikedBy] = useState(likedBy);
  const [localDislikedBy, setLocalDislikedBy] = useState(dislikedBy);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (ownerId) {
      if (ownerId.startsWith('mock-owner-')) {
        setOwnerProfile({
          displayName: 'Elite Partner',
          isPremium: true
        });
      } else {
        const fetchOwner = async () => {
          try {
            const docRef = doc(db, 'users', ownerId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setOwnerProfile(docSnap.data());
            }
          } catch (e) {
            console.warn('Failed to load owner profile:', e);
          }
        };
        fetchOwner();
      }
    }
  }, [ownerId]);

  const hasLiked = user ? localLikedBy.includes(user.uid) : false;
  const hasDisliked = user ? localDislikedBy.includes(user.uid) : false;

  const fallbackImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80';
  const displayImage = coverImage || (images.length > 0 ? images[0] : fallbackImage);

  const formatPrice = (value) => {
    if (!value) return 'Contact for Details';
    if (isNaN(value)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCategoryLabel = (catId) => {
    if (!catId) return 'Asset';
    return catId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Beğenmek için giriş yapmanız gerekiyor.', 'error');
      router.push('/login');
      return;
    }
    if (actionLoading) return;
    setActionLoading(true);
    try {
      // Optimistic UI update
      if (hasLiked) {
        setLocalLikes(prev => prev - 1);
        setLocalLikedBy(prev => prev.filter(uid => uid !== user.uid));
      } else {
        setLocalLikes(prev => prev + 1);
        setLocalLikedBy(prev => [...prev, user.uid]);
        if (hasDisliked) {
          setLocalDislikes(prev => Math.max(0, prev - 1));
          setLocalDislikedBy(prev => prev.filter(uid => uid !== user.uid));
        }
      }
      await likeListing(id, user.uid);
    } catch (err) {
      // Revert on error
      setLocalLikes(likes);
      setLocalDislikes(dislikes);
      setLocalLikedBy(likedBy);
      setLocalDislikedBy(dislikedBy);
      if (err.message === 'not_authenticated') {
        addToast('Giriş yapmanız gerekiyor.', 'error');
      } else {
        addToast('İşlem gerçekleştirilemedi.', 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Beğenmemek için giriş yapmanız gerekiyor.', 'error');
      router.push('/login');
      return;
    }
    if (actionLoading) return;
    setActionLoading(true);
    try {
      // Optimistic UI update
      if (hasDisliked) {
        setLocalDislikes(prev => Math.max(0, prev - 1));
        setLocalDislikedBy(prev => prev.filter(uid => uid !== user.uid));
      } else {
        setLocalDislikes(prev => prev + 1);
        setLocalDislikedBy(prev => [...prev, user.uid]);
        if (hasLiked) {
          setLocalLikes(prev => Math.max(0, prev - 1));
          setLocalLikedBy(prev => prev.filter(uid => uid !== user.uid));
        }
      }
      await dislikeListing(id, user.uid);
    } catch (err) {
      // Revert on error
      setLocalLikes(likes);
      setLocalDislikes(dislikes);
      setLocalLikedBy(likedBy);
      setLocalDislikedBy(dislikedBy);
      if (err.message === 'not_authenticated') {
        addToast('Giriş yapmanız gerekiyor.', 'error');
      } else {
        addToast('İşlem gerçekleştirilemedi.', 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <article className={styles.card} id={`listing-card-${id}`}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={displayImage} 
          alt={title} 
          className={styles.image} 
          loading="lazy"
        />
        <div className={styles.categoryBadge}>{getCategoryLabel(category)}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.location}>{location || 'Global Opportunity'}</span>
          <span className={styles.views}>👁️ {views}</span>
        </div>

        {ownerProfile && (
          <div className={styles.ownerRow}>
            <span className={styles.ownerLabel}>By:</span>
            <span className={styles.ownerName}>
              {ownerProfile.displayName || 'Advisor'}
              <img src="/images/gold_seal.png" alt="Seal" style={{ width: 14, height: 14, verticalAlign: 'middle', marginLeft: 4, display: 'inline-block', borderRadius: '50%' }} />
              {(ownerProfile.isPremium || ownerProfile.premium) && (
                <span className={styles.premiumCrown} title="Premium Partner">👑 Premium</span>
              )}
            </span>
          </div>
        )}

        <h3 className={styles.title}>{title}</h3>
        
        <p className={styles.description}>
          {description ? (description.length > 100 ? `${description.slice(0, 100)}...` : description) : 'Explore this exclusive investment offer details.'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', borderRadius: '4px' }}>Verified ✓</span>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{listing.country || (listing.location ? listing.location.split(', ').pop() : 'Global')}</span>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{listing.sector || getCategoryLabel(category)}</span>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{listing.investmentType || listing.listingType || 'Direct Investment'}</span>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{listing.contactMethod || 'Secure Messaging'}</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <Link href={`/listings/${id}`} className={styles.detailsBtn} id={`listing-view-${id}`}>
            View Placement
          </Link>
        </div>

        {/* Like / Dislike Row */}
        <div className={styles.reactionRow}>
          <button
            onClick={handleLike}
            disabled={actionLoading}
            className={`${styles.reactionBtn} ${styles.likeBtn} ${hasLiked ? styles.likeActive : ''}`}
            id={`listing-like-${id}`}
            title={user ? (hasLiked ? 'Beğeniyi Geri Al' : 'Beğen') : 'Beğenmek için giriş yapın'}
            aria-pressed={hasLiked}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <span>{localLikes}</span>
          </button>

          <div className={styles.reactionDivider} />

          <button
            onClick={handleDislike}
            disabled={actionLoading}
            className={`${styles.reactionBtn} ${styles.dislikeBtn} ${hasDisliked ? styles.dislikeActive : ''}`}
            id={`listing-dislike-${id}`}
            title={user ? (hasDisliked ? 'Beğenmemeyi Geri Al' : 'Beğenme') : 'Beğenmemek için giriş yapın'}
            aria-pressed={hasDisliked}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={hasDisliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
            </svg>
            <span>{localDislikes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
