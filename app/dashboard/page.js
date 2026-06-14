'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../../store/authStore';
import { useListingStore } from '../../store/listingStore';
import { useUiStore } from '../../store/uiStore';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import styles from './Dashboard.module.css';

const GUMROAD_BASE = 'https://luxestate3.gumroad.com/l/xhqsuf';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading, logout } = useAuthStore();
  const { deleteListing }  = useListingStore();
  const { addToast }       = useUiStore();
  const router             = useRouter();

  const [activeTab, setActiveTab]   = useState('overview');
  const [myListings, setMyListings] = useState([]);
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load listings
      const lq = query(
        collection(db, 'listings'),
        where('ownerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const lSnap = await getDocs(lq);
      setMyListings(lSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Load messages for this user
      const mq = query(
        collection(db, 'messages'),
        where('receiverId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const mSnap = await getDocs(mq);
      setMessages(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (listingId) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteListing(listingId, user.uid);
      addToast('Listing deleted.', 'success');
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const handleMarkRead = async (msgId) => {
    try {
      await updateDoc(doc(db, 'messages', msgId), { read: true });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
    } catch {}
  };

  if (authLoading || !user) {
    return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>;
  }

  const purchased  = profile?.slots_purchased || 0;
  const used       = profile?.slots_used      || 0;
  const isPremium  = profile?.isPremium || profile?.premium || false;
  const maxSlots   = isPremium ? 5 : purchased;
  const isAdmin    = profile?.role === 'admin';
  const available  = isAdmin ? Infinity : Math.max(0, maxSlots - used);
  const isOwner    = profile?.role === 'owner';
  const hasNoPurchase = isOwner && !isPremium && purchased === 0;
  const unread     = messages.filter(m => !m.read).length;

  const redirectParam = typeof window !== 'undefined' ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}` : '';
  const checkoutUrl = `${GUMROAD_BASE}?userId=${user.uid}&email=${encodeURIComponent(user.email)}${redirectParam}`;

  const NAV = [
    { key: 'overview',  icon: '📊', label: 'Overview'  },
    { key: 'listings',  icon: '🏛',  label: 'My Listings' },
    { key: 'messages',  icon: '💬', label: `Messages${unread > 0 ? ` (${unread})` : ''}` },
    { key: 'settings',  icon: '⚙️', label: 'Settings'  },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 60 }}>

      {/* ── Membership Gate Banner ────────────────────────── */}
      {hasNoPurchase && (
        <div className={styles.membershipBanner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerIcon}>🔒</span>
            <div>
              <strong>Complete Your Membership</strong>
              <span> — Purchase a listing package to start publishing investment opportunities.</span>
            </div>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerCta}
              id="dashboard-complete-membership"
            >
              Purchase — $499 →
            </a>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.userBrief}>
            <div className={styles.avatar}>
              {profile?.photoURL
                ? <img src={profile.photoURL} alt="avatar" className={styles.avatarImg} />
                : <span>{(profile?.displayName || 'U')[0].toUpperCase()}</span>
              }
            </div>
            <div>
              <div className={styles.displayName}>
                {isPremium && '👑 '}{profile?.displayName || 'User'} <img src="/images/gold_seal.png" alt="Seal" style={{ width: 18, height: 18, verticalAlign: 'middle', marginLeft: 6, display: 'inline-block', borderRadius: '50%' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
            </div>
            <span className={styles.roleBadge}>
              {isAdmin ? '🛡 Admin' : isOwner ? '🏢 Listing Member' : '💼 Investor'}
            </span>
          </div>

          <nav className={styles.sideNav}>
            {NAV.map(item => (
              <button
                key={item.key}
                className={`${styles.navItem} ${activeTab === item.key ? styles.active : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <Link href="/admin" className={styles.navItem}>
                <span style={{ marginRight: 10 }}>🔧</span>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Slot Status */}
          {(isOwner || isAdmin) && (
            <div className={styles.slotsCard}>
              <div className={styles.slotsTitle}>Listing Slots</div>
              <div className={styles.slotsProgress}>
                <span className={styles.progressText}>{used} used / {maxSlots} total</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${maxSlots > 0 ? Math.min(100, (used / maxSlots) * 100) : 0}%` }}
                  />
                </div>
              </div>
              {!hasNoPurchase && available > 0 ? (
                <Link href="/listings/create" className={styles.createBtn} id="sidebar-create-btn">
                  + Publish New Listing
                </Link>
              ) : hasNoPurchase ? (
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={styles.buyBtn} id="sidebar-buy-btn">
                  Purchase Listing Package
                </a>
              ) : (
                <div className={styles.limitAlert}>
                  <p className={styles.alertText}>All {maxSlots} slots are in use.</p>
                  <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={styles.buyBtn}>
                    Buy More Slots
                  </a>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className={styles.mainContent}>

          {/* ══ TAB: OVERVIEW ════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div>
              <div className={styles.tabHeader}>
                <div className={styles.tabTitle}>Dashboard Overview</div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { icon: '🏛', val: myListings.length,                    label: 'Total Listings' },
                  { icon: '✅', val: myListings.filter(l => l.status === 'active').length, label: 'Active'  },
                  { icon: '💬', val: messages.length,                       label: 'Messages'       },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: '20px 24px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{s.val}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent listings */}
              <div style={{ marginBottom: 8, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Recent Listings
              </div>
              {loading ? (
                <div className={styles.emptyState}>Loading…</div>
              ) : myListings.length === 0 ? (
                <div className={styles.portfolioManagement}>
                  <div className={styles.portfolioHeader}>Private Portfolio Management</div>
                  <div className={styles.portfolioSub}>
                    Secure, high-end oversight for ultra-high-net-worth investments. Monitor global assets, review exclusive mandates, and access institutional-grade analytics.
                  </div>
                  <div className={styles.portfolioGrid}>
                    <div className={styles.portfolioCard}>
                      <div className={styles.portfolioCardIcon}>📈</div>
                      <div className={styles.portfolioCardTitle}>Investment Mandates</div>
                      <div className={styles.portfolioCardDesc}>Review active mandates, capital allocation requests, and confidential off-market opportunities.</div>
                      <div className={styles.dataViz}>
                        <div className={styles.dataBar} style={{ height: '40%' }} />
                        <div className={styles.dataBar} style={{ height: '70%' }} />
                        <div className={styles.dataBar} style={{ height: '50%' }} />
                        <div className={styles.dataBar} style={{ height: '90%' }} />
                        <div className={styles.dataBar} style={{ height: '60%' }} />
                        <div className={styles.dataBar} style={{ height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.portfolioCard}>
                      <div className={styles.portfolioCardIcon}>🌍</div>
                      <div className={styles.portfolioCardTitle}>Global Asset Exposure</div>
                      <div className={styles.portfolioCardDesc}>Geographic distribution of real estate holdings, private equity stakes, and alternative assets.</div>
                      <div className={styles.dataViz}>
                        <div className={styles.dataBar} style={{ height: '80%' }} />
                        <div className={styles.dataBar} style={{ height: '30%' }} />
                        <div className={styles.dataBar} style={{ height: '100%' }} />
                        <div className={styles.dataBar} style={{ height: '50%' }} />
                        <div className={styles.dataBar} style={{ height: '60%' }} />
                        <div className={styles.dataBar} style={{ height: '40%' }} />
                      </div>
                    </div>
                  </div>
                  {!hasNoPurchase ? (
                    <Link href="/listings/create" className={styles.portfolioAction}>Start your journey: Submit your first exclusive opportunity →</Link>
                  ) : (
                    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={styles.portfolioAction}>Activate Portfolio Account →</a>
                  )}
                </div>
              ) : (
                <div className={styles.listingsGrid}>
                  {myListings.slice(0, 3).map(l => (
                    <div key={l.id} className={styles.listingRow}>
                      <div className={styles.listingInfo}>
                        <span className={styles.listingName}>{l.title}</span>
                        <span className={styles.listingCat}>{l.category} · {formatDate(l.createdAt)}</span>
                      </div>
                      <div className={styles.listingActions}>
                        <span className={`${styles.statusBadge} ${l.status === 'active' ? styles.active : styles.paused}`}>
                          {l.status}
                        </span>
                        <Link href={`/listings/${l.id}`} className={styles.rowBtn}>View</Link>
                      </div>
                    </div>
                  ))}
                  {myListings.length > 3 && (
                    <button onClick={() => setActiveTab('listings')} className={styles.rowBtn} style={{ alignSelf: 'flex-start' }}>
                      View all {myListings.length} →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: MY LISTINGS ═════════════════════════════ */}
          {activeTab === 'listings' && (
            <div>
              <div className={styles.tabHeader}>
                <div className={styles.tabTitle}>My Listings</div>
                {!hasNoPurchase && available > 0 && (
                  <Link href="/listings/create" className={styles.actionBtn} id="main-create-btn">
                    + New Listing
                  </Link>
                )}
              </div>

              {loading ? (
                <div className={styles.emptyState}>Loading…</div>
              ) : myListings.length === 0 ? (
                <div className={styles.portfolioManagement}>
                  <div className={styles.portfolioHeader}>Private Portfolio Management</div>
                  <div className={styles.portfolioSub}>
                    Secure, high-end oversight for ultra-high-net-worth investments. Monitor global assets, review exclusive mandates, and access institutional-grade analytics.
                  </div>
                  <div className={styles.portfolioGrid}>
                    <div className={styles.portfolioCard}>
                      <div className={styles.portfolioCardIcon}>📈</div>
                      <div className={styles.portfolioCardTitle}>Investment Mandates</div>
                      <div className={styles.portfolioCardDesc}>Review active mandates, capital allocation requests, and confidential off-market opportunities.</div>
                      <div className={styles.dataViz}>
                        <div className={styles.dataBar} style={{ height: '40%' }} />
                        <div className={styles.dataBar} style={{ height: '70%' }} />
                        <div className={styles.dataBar} style={{ height: '50%' }} />
                        <div className={styles.dataBar} style={{ height: '90%' }} />
                        <div className={styles.dataBar} style={{ height: '60%' }} />
                        <div className={styles.dataBar} style={{ height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.portfolioCard}>
                      <div className={styles.portfolioCardIcon}>🌍</div>
                      <div className={styles.portfolioCardTitle}>Global Asset Exposure</div>
                      <div className={styles.portfolioCardDesc}>Geographic distribution of real estate holdings, private equity stakes, and alternative assets.</div>
                      <div className={styles.dataViz}>
                        <div className={styles.dataBar} style={{ height: '80%' }} />
                        <div className={styles.dataBar} style={{ height: '30%' }} />
                        <div className={styles.dataBar} style={{ height: '100%' }} />
                        <div className={styles.dataBar} style={{ height: '50%' }} />
                        <div className={styles.dataBar} style={{ height: '60%' }} />
                        <div className={styles.dataBar} style={{ height: '40%' }} />
                      </div>
                    </div>
                  </div>
                  {!hasNoPurchase ? (
                    <Link href="/listings/create" className={styles.portfolioAction}>Start your journey: Submit your first exclusive opportunity →</Link>
                  ) : (
                    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={styles.portfolioAction}>Activate Portfolio Account →</a>
                  )}
                </div>
              ) : (
                <div className={styles.listingsGrid}>
                  {myListings.map(l => (
                    <div key={l.id} className={styles.listingRow}>
                      <div className={styles.listingInfo}>
                        <span className={styles.listingName}>{l.title}</span>
                        <span className={styles.listingCat}>{l.category} · {l.city || l.location} · {formatDate(l.createdAt)}</span>
                      </div>
                      <div className={styles.listingActions}>
                        <span className={`${styles.statusBadge} ${l.status === 'active' ? styles.active : styles.paused}`}>
                          {l.status}
                        </span>
                        <Link href={`/listings/${l.id}`} className={styles.rowBtn}>View</Link>
                        <button onClick={() => handleDelete(l.id)} className={`${styles.rowBtn} ${styles.delete}`}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: MESSAGES ════════════════════════════════ */}
          {activeTab === 'messages' && (
            <div>
              <div className={styles.tabHeader}>
                <div className={styles.tabTitle}>Messages</div>
                {unread > 0 && (
                  <span style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold-primary)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px' }}>
                    {unread} unread
                  </span>
                )}
              </div>

              {messages.length === 0 ? (
                <div className={styles.emptyState}>No messages yet.</div>
              ) : (
                <div className={styles.msgContainer}>
                  {messages.map(m => (
                    <div key={m.id} className={styles.msgRow} style={{ opacity: m.read ? 0.7 : 1 }}>
                      <div className={styles.msgMeta}>
                        <span className={styles.msgSender}>{m.senderName || m.senderEmail || 'Unknown'}</span>
                        <span>{formatDate(m.createdAt)}</span>
                      </div>
                      <div className={styles.msgSubject}>{m.subject || '(No subject)'}</div>
                      <div className={styles.msgBody}>{m.body}</div>
                      {!m.read && (
                        <button onClick={() => handleMarkRead(m.id)} className={styles.replyBtn}>
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: SETTINGS ════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div>
              <div className={styles.tabHeader}>
                <div className={styles.tabTitle}>Account Settings</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Link href="/settings" className={styles.actionBtn} style={{ display: 'inline-block', width: 'fit-content' }}>
                  ⚙️ Open Full Settings Page
                </Link>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  Update your profile, investor preferences, company info, and account details from the Settings page.
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 24, marginTop: 8 }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Account Summary</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      ['Email',      user.email],
                      ['Role',       isAdmin ? 'Administrator' : isOwner ? 'Listing Member' : 'Investor'],
                      ['Membership', isPremium ? '👑 Premium' : purchased > 0 ? `Active — ${purchased} slots` : 'No active package'],
                      ['Member Since', formatDate(profile?.createdAt)],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { logout(); router.push('/'); }}
                  style={{ alignSelf: 'flex-start', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
