'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { useUiStore } from '../../../store/uiStore';
import { useListingStore } from '../../../store/listingStore';
import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import Link from 'next/link';
import styles from './Detail.module.css';

const MOCK_DETAILS = {
  'mock-1': {
    id: 'mock-1',
    title: 'Penthouse Suite - Bosphorus Views',
    category: 'luxury-real-estate',
    description: 'Ultra-exclusive 5-bedroom duplex penthouse overlooking the Bosphorus strait. Complete with private infinity pool, direct elevator entry, and state-of-the-art automation systems. Fully furnished with premium Italian designer assets, smart security integrations, and a 4-car garage. Exceptional rental yield potential and capital appreciation in Istanbul\'s most sought-after premium residential enclave Bebek.',
    price: 18500000,
    currency: 'USD',
    location: 'Bebek, Istanbul, Turkey',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=600'],
    views: 451,
    likes: 88,
    ownerId: 'mock-owner-1'
  },
  'mock-2': {
    id: 'mock-2',
    title: 'Geneva Private Banking Group Acquisition',
    category: 'business-acquisitions',
    description: 'Rare opportunity to acquire a fully licensed boutique wealth management and private banking institution in Geneva. Highly prestigious client portfolio, global compliance infrastructure, and operating license. Turnkey management structures can remain in place. Financial summaries available upon signed NDA verification by qualified buyers.',
    price: 42000000,
    currency: 'USD',
    location: 'Geneva, Switzerland',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600'],
    views: 313,
    likes: 54,
    ownerId: 'mock-owner-2'
  },
  'mock-3': {
    id: 'mock-3',
    title: 'Venture Capital Opportunity - Quantum Cloud AI',
    category: 'venture-capital',
    description: 'Series A funding round for an industry-leading quantum encryption & AI infrastructure software suite. Solid patent portfolio and proven market adoption rates. Core architecture has been validated by major defense partners. Target raise is $7.5M for scaling business expansion and enterprise sales pipelines.',
    price: 7500000,
    currency: 'USD',
    location: 'Silicon Valley, California, United States',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=600'],
    views: 290,
    likes: 42,
    ownerId: 'mock-owner-3'
  },
  'mock-4': {
    id: 'mock-4',
    title: 'Benetti Oasis 40M Superyacht',
    category: 'luxury-yachts',
    description: 'Immaculate 40-meter Benetti yacht delivered in 2023. Features spectacular beach club area, unfolding wings, dip pool, and luxury accommodation for up to 10 guests. Stabilizers at anchor, zero-speed capabilities, and twin MAN diesel configurations offering efficient transatlantic range. Available for immediate placement inspections in Monaco.',
    price: 22000000,
    currency: 'EUR',
    location: 'Monaco Marina',
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&h=600'],
    views: 190,
    likes: 31,
    ownerId: 'mock-owner-4'
  },
  'mock-5': {
    id: 'mock-5',
    title: '45MW Andalusia Solar Farm',
    category: 'renewable-energy',
    description: 'Fully permitted grid-connected utility-scale solar generation project ready for final assembly. Long term PPA secured with tier-1 utilities. EPC contract is ready for execution, projecting solid 9.5% unlevered IRR with guaranteed capital support systems.',
    price: 34000000,
    currency: 'USD',
    location: 'Andalusia, Spain',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600'],
    views: 155,
    likes: 22,
    ownerId: 'mock-owner-5'
  },
  'mock-6': {
    id: 'mock-6',
    title: 'Prime Napa Valley Vineyard',
    category: 'agriculture',
    description: 'Bespoke operational organic vineyard and estate winery producing award-winning Cabernet Sauvignon. Includes master estate villa, barrel tasting rooms, climate-controlled warehousing facilities, and direct shipping licenses to 42 states.',
    price: 15000000,
    currency: 'USD',
    location: 'Napa Valley, California, United States',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&h=600'],
    views: 212,
    likes: 45,
    ownerId: 'mock-owner-6'
  }
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { addToast } = useUiStore();
  const { likeListing, dislikeListing } = useListingStore();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Local reaction state for optimistic UI
  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [localLikedBy, setLocalLikedBy] = useState([]);
  const [localDislikedBy, setLocalDislikedBy] = useState([]);
  const [reactionLoading, setReactionLoading] = useState(false);

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [privateNote, setPrivateNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [conversation, setConversation] = useState(null);

  const hasLiked = user ? localLikedBy.includes(user.uid) : false;
  const hasDisliked = user ? localDislikedBy.includes(user.uid) : false;

  // Sync details from DB or fallback
  useEffect(() => {
    if (!id) return;

    const fetchListingDetail = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListing({ id: docSnap.id, ...data });
          setLocalLikes(data.likes || 0);
          setLocalDislikes(data.dislikes || 0);
          setLocalLikedBy(data.likedBy || []);
          setLocalDislikedBy(data.dislikedBy || []);
          
          // Increment views
          await updateDoc(docRef, {
            views: increment(1)
          });
        } else if (MOCK_DETAILS[id]) {
          const mock = MOCK_DETAILS[id];
          setListing(mock);
          setLocalLikes(mock.likes || 0);
          setLocalDislikes(mock.dislikes || 0);
          setLocalLikedBy([]);
          setLocalDislikedBy([]);
        } else {
          addToast("Listing placement not found.", "error");
          router.push('/listings');
        }
      } catch (err) {
        console.error("Failed to read listing detail, using mockup fallback: ", err);
        if (MOCK_DETAILS[id]) {
          const mock = MOCK_DETAILS[id];
          setListing(mock);
          setLocalLikes(mock.likes || 0);
          setLocalDislikes(mock.dislikes || 0);
          setLocalLikedBy([]);
          setLocalDislikedBy([]);
        } else {
          router.push('/listings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [id, router, addToast]);

  // Fetch Listing Owner profile
  useEffect(() => {
    if (listing && listing.ownerId) {
      if (listing.ownerId.startsWith('mock-owner-')) {
        setOwnerProfile({
          displayName: 'Elite Partner',
          isPremium: true,
          email: 'partner@luxestate.com',
          phone: '+1 800 555 0199'
        });
      } else {
        const fetchOwner = async () => {
          try {
            const docRef = doc(db, 'users', listing.ownerId);
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
  }, [listing]);

  // Fetch Private Note (if logged in)
  useEffect(() => {
    if (listing && user) {
      const fetchNote = async () => {
        try {
          const docRef = doc(db, `users/${user.uid}/notes`, listing.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPrivateNote(docSnap.data().noteText || '');
          }
        } catch (e) {
          console.warn('Failed to load private note:', e);
        }
      };
      fetchNote();
    }
  }, [listing, user]);

  // Fetch Conversation metadata (if logged in)
  useEffect(() => {
    if (listing && user && listing.ownerId) {
      const conversationId = `${listing.id}_${user.uid}_${listing.ownerId}`;
      const fetchConversation = async () => {
        try {
          const docRef = doc(db, 'conversations', conversationId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setConversation(docSnap.data());
          }
        } catch (e) {
          console.warn('Failed to load conversation:', e);
        }
      };
      fetchConversation();
    }
  }, [listing, user]);

  const handleSaveNote = async () => {
    if (!user || !listing) return;
    setIsSavingNote(true);
    try {
      const docRef = doc(db, `users/${user.uid}/notes`, listing.id);
      await setDoc(docRef, {
        listingId: listing.id,
        listingTitle: listing.title,
        noteText: privateNote,
        updatedAt: new Date().toISOString()
      });
      addToast('Özel notunuz başarıyla kaydedildi! 📝', 'success');
    } catch (e) {
      addToast('Not kaydedilirken hata oldu.', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to initiate messaging.', 'error');
      router.push('/login');
      return;
    }

    if (!msgSubject || !msgBody) {
      addToast('Subject and Message details are required.', 'error');
      return;
    }

    setSendingMsg(true);
    try {
      const conversationId = `${listing.id}_${user.uid}_${listing.ownerId || 'system-admin'}`;

      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: user.uid,
        senderName: profile?.displayName || user.email,
        senderEmail: user.email,
        receiverId: listing.ownerId || 'system-admin',
        listingId: listing.id,
        listingTitle: listing.title,
        subject: msgSubject,
        body: msgBody,
        read: false,
        archived: false,
        createdAt: new Date().toISOString()
      });

      // Upsert conversation metadata
      await setDoc(doc(db, 'conversations', conversationId), {
        conversationId,
        listingId: listing.id,
        listingTitle: listing.title,
        investorId: user.uid,
        investorName: profile?.displayName || user.email,
        ownerId: listing.ownerId || 'system-admin',
        contactShared: false,
        lastMessage: msgBody,
        lastMessageAt: new Date().toISOString()
      }, { merge: true });

      // Also generate notification for the receiver
      await addDoc(collection(db, 'notifications'), {
        userId: listing.ownerId || 'system-admin',
        type: 'message',
        message: `New inquiry regarding "${listing.title}" from ${profile?.displayName || user.email}.`,
        read: false,
        link: '/dashboard',
        createdAt: new Date().toISOString()
      });

      addToast('Your inquiry has been successfully sent to the listing owner.', 'success');
      setMsgSubject('');
      setMsgBody('');
      
      // Reload conversation state
      const docRef = doc(db, 'conversations', conversationId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConversation(docSnap.data());
      }
    } catch (err) {
      addToast(err.message || 'Failed to deliver message.', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      addToast('Beğenmek için giriş yapmanız gerekiyor.', 'error');
      router.push('/login');
      return;
    }
    if (reactionLoading) return;
    setReactionLoading(true);
    const prevLikes = localLikes;
    const prevLikedBy = [...localLikedBy];
    const prevDislikes = localDislikes;
    const prevDislikedBy = [...localDislikedBy];
    try {
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
      await likeListing(listing.id, user.uid);
    } catch (err) {
      setLocalLikes(prevLikes);
      setLocalLikedBy(prevLikedBy);
      setLocalDislikes(prevDislikes);
      setLocalDislikedBy(prevDislikedBy);
      addToast('İşlem gerçekleştirilemedi.', 'error');
    } finally {
      setReactionLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      addToast('Beğenmemek için giriş yapmanız gerekiyor.', 'error');
      router.push('/login');
      return;
    }
    if (reactionLoading) return;
    setReactionLoading(true);
    const prevLikes = localLikes;
    const prevLikedBy = [...localLikedBy];
    const prevDislikes = localDislikes;
    const prevDislikedBy = [...localDislikedBy];
    try {
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
      await dislikeListing(listing.id, user.uid);
    } catch (err) {
      setLocalLikes(prevLikes);
      setLocalLikedBy(prevLikedBy);
      setLocalDislikes(prevDislikes);
      setLocalDislikedBy(prevDislikedBy);
      addToast('İşlem gerçekleştirilemedi.', 'error');
    } finally {
      setReactionLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Connecting to placement dossier...</div>;
  }

  if (!listing) return null;

  const displayImage = listing.coverImage 
    ? listing.coverImage
    : (listing.images && listing.images.length > 0 
      ? listing.images[0] 
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');

  const formatPrice = (val) => {
    if (!val) return 'Contact for Details';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: listing.currency || 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.detailHeader}>
          <div className={styles.metaRow}>
            <span className={styles.catBadge}>{listing.category}</span>
            <span className={styles.location}>📍 {listing.location}</span>
          </div>

          {ownerProfile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
              <span>Published by:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {ownerProfile.displayName || 'Advisor'}
                <img src="/images/gold_seal.png" alt="Seal" style={{ width: 16, height: 16, verticalAlign: 'middle', marginLeft: 6, display: 'inline-block', borderRadius: '50%' }} />
                {(ownerProfile.isPremium || ownerProfile.premium) && (
                  <span style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f9e8a2 50%, #aa7c11 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800',
                    fontSize: '0.72rem',
                    letterSpacing: '0.02em',
                    border: '1px solid #d4af37',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }} title="Premium Partner">👑 Premium</span>
                )}
              </span>
            </div>
          )}

          <h1 className={styles.title}>{listing.title}</h1>
          <span className={styles.price}>{formatPrice(listing.price)}</span>

          {/* ─── Reaction Bar ───────────────────────────────── */}
          <div className={styles.reactionBar}>
            <button
              onClick={handleLike}
              disabled={reactionLoading}
              className={`${styles.reactionBtn} ${styles.likeBtn} ${hasLiked ? styles.likeActive : ''}`}
              id="detail-like-btn"
              title={user ? (hasLiked ? 'Beğeniyi Geri Al' : 'Beğen') : 'Beğenmek için giriş yapın'}
              aria-pressed={hasLiked}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <span className={styles.reactionCount}>{localLikes}</span>
              <span className={styles.reactionLabel}>Beğen</span>
            </button>

            <div className={styles.reactionDivider} />

            <button
              onClick={handleDislike}
              disabled={reactionLoading}
              className={`${styles.reactionBtn} ${styles.dislikeBtn} ${hasDisliked ? styles.dislikeActive : ''}`}
              id="detail-dislike-btn"
              title={user ? (hasDisliked ? 'Beğenmemeyi Geri Al' : 'Beğenme') : 'Beğenmemek için giriş yapın'}
              aria-pressed={hasDisliked}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={hasDisliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
              </svg>
              <span className={styles.reactionCount}>{localDislikes}</span>
              <span className={styles.reactionLabel}>Beğenme</span>
            </button>

            {!user && (
              <span className={styles.reactionHint}>Oy vermek için giriş yapın</span>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className={styles.imageBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImage} alt={listing.title} className={styles.image} />
        </div>

        {/* Content columns */}
        <div className={styles.contentLayout}>
          {/* Left panel: details */}
          <div className={styles.leftCol}>
            <h3 className={styles.sectionTitle}>Mandate Dossier</h3>

            <div className={styles.detailsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification Status</span>
                <span style={{ fontWeight: '600', color: 'var(--gold-secondary)' }}>Verified ✓</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Country</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{listing.country || (listing.location ? listing.location.split(', ').pop() : 'Global')}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sector</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{listing.sector || (listing.category ? listing.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Asset')}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investment Type</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{listing.investmentType || listing.listingType || 'Direct Investment'}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contact Method</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{listing.contactMethod || 'Secure Messaging'}</span>
              </div>
              {listing.targetInvestment && (
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Investment</span>
                  <span style={{ fontWeight: '600', color: 'var(--gold-secondary)' }}>{formatPrice(listing.targetInvestment)}</span>
                </div>
              )}
              {listing.city && (
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>City</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{listing.city}</span>
                </div>
              )}
              {listing.videoUrl && (
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Walkthrough Video</span>
                  <a href={listing.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)', fontWeight: '600', textDecoration: 'underline' }}>
                    Watch video 🎥
                  </a>
                </div>
              )}
            </div>

            <p className={styles.descText}>{listing.description}</p>

            {/* Render additional gallery images if any */}
            {listing.images && listing.images.length > 1 && (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Placement Gallery</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {listing.images.slice(1).map((img, index) => (
                    <a key={index} href={img} target="_blank" rel="noreferrer" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', height: '120px' }}>
                      <img src={img} alt={`gallery-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.disclaimerBox} style={{ marginTop: '30px' }}>
              <p className={styles.disclaimerText}>
                <strong>Disclaimer:</strong> Every placement published on Lux Estate Network is for informational and match-making purposes only. All financial estimates, yield rates, or valuations must be vetted independently. This does not constitute investment advice.
              </p>
            </div>
          </div>

          {/* Right panel: contact */}
          <aside className={styles.rightCol}>
            {/* Direct Contact Details Box (Secure Visibility) */}
            <div className={styles.contactCard} style={{ marginBottom: '20px' }}>
              <h3 className={styles.contactTitle}>Broker Contact Details</h3>
              {user && (user.uid === listing.ownerId || conversation?.contactShared === true) ? (
                <div style={{ marginTop: '14px', background: 'rgba(201, 168, 76, 0.08)', border: '1px solid var(--gold-primary)', borderRadius: '6px', padding: '16px' }}>
                  <p style={{ color: 'var(--gold-secondary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✅ Contact Details Unlocked</span>
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {listing.contactPhone || ownerProfile?.phone || 'Not Provided'}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Email:</strong> {listing.contactEmail || ownerProfile?.email || 'Not Provided'}</p>
                </div>
              ) : (
                <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', padding: '16px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔒 Contact Info Locked</span>
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    Send a secure message below. Once the owner approves access or responds to your message, their direct phone number and email will be revealed here.
                  </p>
                </div>
              )}
            </div>

            {/* Private Notes block for Investors */}
            {user && profile?.role === 'investor' && (
              <div className={styles.contactCard} style={{ marginBottom: '20px' }}>
                <h3 className={styles.contactTitle}>Private Investor Notes</h3>
                <p className={styles.contactSubtitle}>Keep your private notes about this deal here. Visible only to you.</p>
                <div className={styles.contactForm} style={{ marginTop: '12px' }}>
                  <textarea
                    rows={4}
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                    className={styles.textarea}
                    placeholder="Enter yield calculations, due diligence dates, private observations..."
                    style={{ marginBottom: '10px' }}
                  ></textarea>
                  <button
                    onClick={handleSaveNote}
                    disabled={isSavingNote}
                    className={styles.submitBtn}
                    style={{ background: 'transparent', border: '1px solid var(--gold-primary)', color: 'var(--gold-secondary)' }}
                  >
                    {isSavingNote ? 'Saving Note...' : 'Save Private Note'}
                  </button>
                </div>
              </div>
            )}

            {/* Messaging Card */}
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Inquire About Opportunity</h3>
              <p className={styles.contactSubtitle}>Send a secure message directly to the placement manager.</p>

              <form onSubmit={handleSendMessage} className={styles.contactForm}>
                <div className={styles.field}>
                  <label className={styles.label}>Subject</label>
                  <input
                    type="text"
                    required
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Requesting NDA & Financial Dossier"
                    id="contact-subject-input"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Message Detail</label>
                  <textarea
                    required
                    rows={5}
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    className={styles.textarea}
                    placeholder="Provide details about your investment mandate, timeframe, or entity."
                    id="contact-body-input"
                  ></textarea>
                </div>

                <button type="submit" disabled={sendingMsg} className={styles.submitBtn} id="contact-submit-btn">
                  {sendingMsg ? 'Transmitting Inquiries...' : 'Send Secure Inquiry'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
