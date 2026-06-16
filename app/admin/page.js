'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { db } from '../../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import Link from 'next/link';
import styles from './Admin.module.css';

// ─── Helper ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

function formatCurrency(val) {
  if (!val) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function isActiveUser(lastLogin) {
  if (!lastLogin) return false;
  const diff = Date.now() - new Date(lastLogin).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
}

// ─── Message Modal ──────────────────────────────────────────────────────────
function MessageModal({ target, onClose, onSend }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !body) return;
    setSending(true);
    await onSend(target, subject, body);
    setSending(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          📧 Mesaj Gönder — {target?.displayName || target?.email || target?.title || ''}
        </h3>
        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Konu</label>
          <input className={styles.modalInput} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Mesaj konusu..." />
        </div>
        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Mesaj</label>
          <textarea className={styles.modalTextarea} rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Mesajınızı yazın..." />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onClose}>İptal</button>
          <button className={styles.btnPrimary} onClick={handleSend} disabled={sending}>
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Simple Bar Chart (SVG-free, pure CSS) ─────────────────────────────────
function BarChart({ data, label }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className={styles.chartBox}>
      <div className={styles.chartTitle}>{label}</div>
      <div className={styles.barChart}>
        {data.map((d, i) => (
          <div key={i} className={styles.barCol}>
            <div className={styles.barValue}>{d.value > 0 ? formatCurrency(d.value) : ''}</div>
            <div className={styles.bar} style={{ height: `${Math.max(4, (d.value / maxVal) * 130)}px` }} />
            <div className={styles.barLabel}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const { addToast } = useUiStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [msgModal, setMsgModal] = useState(null); // { target, receiverId }

  // Finance period
  const [financePeriod, setFinancePeriod] = useState('monthly');

  // Slot editing
  const [slotEdits, setSlotEdits] = useState({});

  // Listings filter
  const [listingFilter, setListingFilter] = useState('all');

  // ── Access guard
  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/');
    }
  }, [user, profile, authLoading, router]);

  // ── Data loading
  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [usersSnap, listingsSnap, messagesSnap, paymentsSnap, ticketsSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'listings'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'payments')),
        getDocs(query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'))),
      ]);

      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setListings(listingsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setMessages(messagesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPayments(paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTickets(ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Admin load error:', err);
      addToast('Veri yüklenirken hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Admin actions

  const handleUpdateRole = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
      addToast(`Rol güncellendi: ${newRole}`, 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleUpdateSlots = async (uid, slots) => {
    const val = parseInt(slots, 10);
    if (isNaN(val) || val < 0) { addToast('Geçersiz slot sayısı.', 'error'); return; }
    try {
      await updateDoc(doc(db, 'users', uid), { slots_purchased: val });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, slots_purchased: val } : u));
      setSlotEdits(prev => { const n = { ...prev }; delete n[uid]; return n; });
      addToast(`Slot güncellendi: ${val}`, 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handlePurchaseSlots = async (uid) => {
    try {
      const user = users.find(u => u.id === uid);
      const current = user?.slots_purchased || 0;
      const newVal = current + 5; // 5 ekstra slot
      await updateDoc(doc(db, 'users', uid), { slots_purchased: newVal });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, slots_purchased: newVal } : u));
      addToast(`5 ek slot alındı, yeni toplam: ${newVal}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };
  const handleDeleteUser = async (uid, email) => {
    if (!window.confirm(`"${email}" hesabını silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(prev => prev.filter(u => u.id !== uid));
      addToast('Kullanıcı silindi.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleDeleteListing = async (lid) => {
    if (!window.confirm('Bu ilanı kaldırmak istediğinize emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'listings', lid));
      setListings(prev => prev.filter(l => l.id !== lid));
      addToast('İlan kaldırıldı.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleRejectListing = async (l) => {
    if (!window.confirm('Bu ilanı yasal ihlal sebebiyle reddedip silmek istediğinize emin misiniz?')) return;
    try {
      if (l.ownerId) {
        await addDoc(collection(db, 'messages'), {
          senderId: user.uid,
          senderName: 'Lux Estate Admin',
          senderEmail: user.email,
          receiverId: l.ownerId,
          listingId: l.id,
          listingTitle: l.title,
          subject: 'İlan Kaldırma Bildirimi',
          body: 'İlanınız platformumuzun yasal ihlali sebebi ile kaldırılmıştır.',
          read: false,
          archived: false,
          createdAt: new Date().toISOString()
        });
        await addDoc(collection(db, 'notifications'), {
          userId: l.ownerId,
          type: 'admin_message',
          message: `İlanınız platformumuzun yasal ihlali sebebi ile kaldırılmıştır: ${l.title}`,
          read: false,
          link: '/dashboard',
          createdAt: new Date().toISOString()
        });
      }
      await deleteDoc(doc(db, 'listings', l.id));
      setListings(prev => prev.filter(item => item.id !== l.id));
      addToast('İlan ihlal sebebiyle silindi ve kullanıcıya mesaj gönderildi.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleToggleListingStatus = async (lid, currentStatus) => {
    const next = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await updateDoc(doc(db, 'listings', lid), { status: next });
      setListings(prev => prev.map(l => l.id === lid ? { ...l, status: next } : l));
      addToast(`İlan durumu: ${next}`, 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleDeleteMessage = async (mid) => {
    try {
      await deleteDoc(doc(db, 'messages', mid));
      setMessages(prev => prev.filter(m => m.id !== mid));
      addToast('Mesaj silindi.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleCloseTicket = async (tid) => {
    try {
      await updateDoc(doc(db, 'support_tickets', tid), { status: 'closed' });
      setTickets(prev => prev.map(t => t.id === tid ? { ...t, status: 'closed' } : t));
      addToast('Destek talebi kapatıldı.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleSendMessage = async (target, subject, body) => {
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        senderName: 'Lux Estate Admin',
        senderEmail: user.email,
        receiverId: target.receiverId,
        listingId: target.listingId || null,
        listingTitle: target.listingTitle || null,
        subject,
        body,
        read: false,
        archived: false,
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'notifications'), {
        userId: target.receiverId,
        type: 'admin_message',
        message: `Admin mesajı: "${subject}"`,
        read: false,
        link: '/dashboard',
        createdAt: new Date().toISOString()
      });
      addToast('Mesaj gönderildi.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  // ── Finance helpers
  const getFinanceData = () => {
    const now = new Date();
    const filtered = payments.filter(p => {
      const d = new Date(p.createdAt || p.date || 0);
      if (financePeriod === 'daily') return d.toDateString() === now.toDateString();
      if (financePeriod === 'monthly') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      if (financePeriod === 'yearly') return d.getFullYear() === now.getFullYear();
      return true;
    });
    const total = filtered.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    return { filtered, total, count: filtered.length };
  };

  const getChartData = () => {
    if (financePeriod === 'daily') {
      // Last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString('tr-TR', { weekday: 'short' });
        const value = payments.filter(p => new Date(p.createdAt || p.date || 0).toDateString() === d.toDateString())
          .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
        return { label, value };
      });
    }
    if (financePeriod === 'monthly') {
      // Last 6 months
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
        const label = d.toLocaleDateString('tr-TR', { month: 'short' });
        const value = payments.filter(p => {
          const pd = new Date(p.createdAt || p.date || 0);
          return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
        }).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
        return { label, value };
      });
    }
    // Yearly — last 4 years
    return Array.from({ length: 4 }, (_, i) => {
      const year = new Date().getFullYear() - (3 - i);
      const value = payments.filter(p => new Date(p.createdAt || p.date || 0).getFullYear() === year)
        .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
      return { label: String(year), value };
    });
  };

  // ── Activity stats
  const activeUsers = users.filter(u => isActiveUser(u.lastLogin));
  const passiveUsers = users.filter(u => !isActiveUser(u.lastLogin));
  const thisMonthUsers = users.filter(u => {
    const d = new Date(u.createdAt || 0);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const todayUsers = users.filter(u => {
    const d = new Date(u.createdAt || 0);
    return d.toDateString() === new Date().toDateString();
  });

  if (authLoading) {
    return <div className={styles.loading}>Yetki doğrulanıyor...</div>;
  }

  if (!user || profile?.role !== 'admin') return null;

  const { filtered: financeFiltered, total: financeTotal, count: financeCount } = getFinanceData();

  const filteredListings = listingFilter === 'all' ? listings : listings.filter(l => l.status === listingFilter);

  const NAV_ITEMS = [
    { key: 'users', icon: '👥', label: 'Kullanıcılar' },
    { key: 'listings', icon: '📋', label: 'İlanlar' },
    { key: 'messages', icon: '💬', label: 'Mesajlar' },
    { key: 'finance', icon: '💰', label: 'Finans' },
    { key: 'activity', icon: '📊', label: 'Aktivite' },
    { key: 'support', icon: '🎫', label: 'Destek' },
    { key: 'investor', icon: '🌐', label: 'Yatırımcı Ağı' },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Message Modal */}
      {msgModal && (
        <MessageModal
          target={msgModal}
          onClose={() => setMsgModal(null)}
          onSend={handleSendMessage}
        />
      )}

      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.adminBadge}>
            <div className={styles.adminIcon}>👑</div>
            <div className={styles.adminInfo}>
              <h3>Admin Paneli</h3>
              <span>Lux Estate Network</span>
            </div>
          </div>

          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`${styles.navBtn} ${activeTab === item.key ? styles.active : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className={styles.navDivider} />

          <Link href="/dashboard" className={styles.navBtn}>
            <span className={styles.navIcon}>⬅️</span>
            Kullanıcı Paneliне Dön
          </Link>
        </aside>

        {/* ── Main ── */}
        <main className={styles.main}>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: USERS */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Kullanıcı Yönetimi</div>
                  <div className={styles.panelSubtitle}>Tüm kayıtlı üyeler ve hesap bilgileri</div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>👤</div>
                  <div className={styles.statValue}>{users.length}</div>
                  <div className={styles.statLabel}>Toplam Üye</div>
                </div>
                <div className={`${styles.statCard} ${styles.statGreen}`}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statValue}>{activeUsers.length}</div>
                  <div className={styles.statLabel}>Aktif (30 gün)</div>
                </div>
                <div className={`${styles.statCard} ${styles.statRed}`}>
                  <div className={styles.statIcon}>💤</div>
                  <div className={styles.statValue}>{passiveUsers.length}</div>
                  <div className={styles.statLabel}>Pasif</div>
                </div>
                <div className={`${styles.statCard} ${styles.statBlue}`}>
                  <div className={styles.statIcon}>🏢</div>
                  <div className={styles.statValue}>{users.filter(u => u.role === 'owner').length}</div>
                  <div className={styles.statLabel}>İlan Üyesi</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Üye Listesi</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ad / Email</th>
                      <th>Rol</th>
                      <th>Kayıt Tarihi</th>
                      <th>Son Giriş</th>
                      <th>Durum</th>
                      <th>Slot (Satın / Kullanılan)</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className={styles.emptyRow} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Yükleniyor...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Henüz kullanıcı yok.</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{fontWeight:600,color:'var(--text-primary)'}}>{u.displayName || '—'}</div>
                          <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{u.email}</div>
                        </td>
                        <td>
                          <select
                            value={u.role || 'investor'}
                            onChange={e => handleUpdateRole(u.id, e.target.value)}
                            className={styles.filterSelect}
                            style={{fontSize:'0.8rem'}}
                          >
                            <option value="investor">Yatırımcı</option>
                            <option value="owner">İlan Üyesi</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td>{formatDate(u.lastLogin)}</td>
                        <td>
                          <span className={`${styles.badge} ${isActiveUser(u.lastLogin) ? styles.badgeActive : styles.badgePaused}`}>
                            {isActiveUser(u.lastLogin) ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'owner' ? (
                            <div className={styles.slotEditor}>
                              <input
                                type="number"
                                min={0}
                                className={styles.slotInput}
                                value={slotEdits[u.id] !== undefined ? slotEdits[u.id] : (u.slots_purchased || 0)}
                                onChange={e => setSlotEdits(prev => ({ ...prev, [u.id]: e.target.value }))}
                              />
                              <span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>/</span>
                              <span style={{fontSize:'0.85rem',color:'var(--text-secondary)'}}>{u.slots_used || 0}</span>
                              {slotEdits[u.id] !== undefined && (
                                <button
                                  className={`${styles.btnSm} ${styles.btnGold}`}
                                  onClick={() => handleUpdateSlots(u.id, slotEdits[u.id])}
                                >Kaydet</button>
                              )}
                              <button
                                className={`${styles.btnSm} ${styles.btnPrimary}`}
                                onClick={() => handlePurchaseSlots(u.id)}
                              >5 Slot Al ($499)</button>
                            </div>
                          ) : (
                            <span style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>—</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button
                              className={`${styles.btnSm} ${styles.btnBlue}`}
                              onClick={() => setMsgModal({ target: u, receiverId: u.id, displayName: u.displayName, email: u.email })}
                            >📧 Mesaj</button>
                            {u.email !== 'luxestatenetwork@gmail.com' && (
                              <button
                                className={`${styles.btnSm} ${styles.btnRed}`}
                                onClick={() => handleDeleteUser(u.id, u.email)}
                              >🗑 Sil</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: LISTINGS */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'listings' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>İlan Yönetimi</div>
                  <div className={styles.panelSubtitle}>Platformdaki tüm aktif ve pasif ilanlar</div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>📋</div>
                  <div className={styles.statValue}>{listings.length}</div>
                  <div className={styles.statLabel}>Toplam İlan</div>
                </div>
                <div className={`${styles.statCard} ${styles.statGreen}`}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statValue}>{listings.filter(l => l.status === 'active').length}</div>
                  <div className={styles.statLabel}>Aktif</div>
                </div>
                <div className={styles.addListingBtnWrapper}>
                  <Link href="/listings/create" className={styles.btnPrimary}>İlan Ekle</Link>
                </div>
                <div className={`${styles.statCard} ${styles.statRed}`}>
                  <div className={styles.statIcon}>⏸</div>
                  <div className={styles.statValue}>{listings.filter(l => l.status === 'paused').length}</div>
                  <div className={styles.statLabel}>Durdurulmuş</div>
                </div>
                <div className={`${styles.statCard} ${styles.statBlue}`}>
                  <div className={styles.statIcon}>👁</div>
                  <div className={styles.statValue}>{listings.reduce((s, l) => s + (l.views || 0), 0)}</div>
                  <div className={styles.statLabel}>Toplam Görüntülenme</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>İlan Listesi</div>
                  <div className={styles.filterRow}>
                    <select className={styles.filterSelect} value={listingFilter} onChange={e => setListingFilter(e.target.value)}>
                      <option value="all">Tümü</option>
                      <option value="active">Aktif</option>
                      <option value="paused">Durdurulmuş</option>
                    </select>
                  </div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>İlan Başlığı</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Konum</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                      <th>👁 / 👍</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Yükleniyor...</td></tr>
                    ) : filteredListings.length === 0 ? (
                      <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>İlan bulunamadı.</td></tr>
                    ) : filteredListings.map(l => {
                      // Find owner
                      const owner = users.find(u => u.id === l.ownerId);
                      return (
                        <tr key={l.id}>
                          <td>
                            <div style={{fontWeight:600,color:'var(--text-primary)',maxWidth:200}}>{l.title}</div>
                            <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{owner?.displayName || owner?.email || l.ownerId || '—'}</div>
                          </td>
                          <td>
                            <span className={`${styles.badge} ${styles.badgeOwner}`} style={{fontSize:'0.68rem'}}>
                              {l.category?.replace(/-/g, ' ')}
                            </span>
                          </td>
                          <td style={{color:'var(--gold-secondary)',fontWeight:700}}>{formatCurrency(l.price)}</td>
                          <td>{l.city && l.country ? `${l.city}, ${l.country}` : (l.location || '—')}</td>
                          <td>
                            <span className={`${styles.badge} ${l.status === 'active' ? styles.badgeActive : styles.badgePaused}`}>
                              {l.status === 'active' ? 'Aktif' : 'Durdurulmuş'}
                            </span>
                          </td>
                          <td>{formatDate(l.createdAt)}</td>
                          <td style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{l.views || 0} / {l.likes || 0}</td>
                          <td>
                            <div className={styles.actionBtns}>
                              <Link href={`/listings/${l.id}`} className={`${styles.btnSm} ${styles.btnGold}`} target="_blank">👁 Gör</Link>
                              <button
                                className={`${styles.btnSm} ${styles.btnGreen}`}
                                onClick={() => handleToggleListingStatus(l.id, l.status)}
                              >{l.status === 'active' ? '⏸' : '▶'}</button>
                              <button
                                className={`${styles.btnSm} ${styles.btnBlue}`}
                                onClick={() => {
                                  const owner = users.find(u => u.id === l.ownerId);
                                  setMsgModal({ receiverId: l.ownerId, displayName: owner?.displayName, email: owner?.email, listingId: l.id, listingTitle: l.title });
                                }}
                              >📧</button>
                              <button
                                className={`${styles.btnSm} ${styles.btnRed}`}
                                onClick={() => handleDeleteListing(l.id)}
                                title="Sil"
                              >🗑</button>
                              <button
                                className={`${styles.btnSm}`}
                                style={{backgroundColor: '#991b1b', color: '#fff'}}
                                onClick={() => handleRejectListing(l)}
                                title="İhlal Sebebiyle İptal Et (Mesaj Gönderir)"
                              >🚨 İhlal</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: MESSAGES */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'messages' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Mesaj Yönetimi</div>
                  <div className={styles.panelSubtitle}>Tüm platform mesajları</div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>💬</div>
                  <div className={styles.statValue}>{messages.length}</div>
                  <div className={styles.statLabel}>Toplam Mesaj</div>
                </div>
                <div className={`${styles.statCard} ${styles.statRed}`}>
                  <div className={styles.statIcon}>🔴</div>
                  <div className={styles.statValue}>{messages.filter(m => !m.read).length}</div>
                  <div className={styles.statLabel}>Okunmamış</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Mesajlar</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Gönderen</th>
                      <th>Alıcı</th>
                      <th>Konu</th>
                      <th>İlan</th>
                      <th>Tarih</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Mesaj bulunamadı.</td></tr>
                    ) : messages.map(m => {
                      const sender = users.find(u => u.id === m.senderId);
                      const receiver = users.find(u => u.id === m.receiverId);
                      return (
                        <tr key={m.id}>
                          <td style={{fontSize:'0.85rem'}}>{m.senderName || sender?.email || m.senderId}</td>
                          <td style={{fontSize:'0.85rem'}}>{receiver?.displayName || receiver?.email || m.receiverId}</td>
                          <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.subject}</td>
                          <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{m.listingTitle || '—'}</td>
                          <td>{formatDate(m.createdAt)}</td>
                          <td>
                            <span className={`${styles.badge} ${m.read ? styles.badgeActive : styles.badgePaused}`}>
                              {m.read ? 'Okundu' : 'Okunmadı'}
                            </span>
                          </td>
                          <td>
                            <button className={`${styles.btnSm} ${styles.btnRed}`} onClick={() => handleDeleteMessage(m.id)}>🗑 Sil</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: FINANCE */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'finance' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Finansal Özet</div>
                  <div className={styles.panelSubtitle}>Gelir ve ödeme takibi</div>
                </div>
              </div>

              <div className={styles.financeTabRow}>
                {['daily', 'monthly', 'yearly'].map(p => (
                  <button
                    key={p}
                    className={`${styles.financeTab} ${financePeriod === p ? styles.active : ''}`}
                    onClick={() => setFinancePeriod(p)}
                  >
                    {{ daily: 'Günlük', monthly: 'Aylık', yearly: 'Yıllık' }[p]}
                  </button>
                ))}
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>💰</div>
                  <div className={styles.statValue}>{formatCurrency(financeTotal)}</div>
                  <div className={styles.statLabel}>Toplam Gelir</div>
                </div>
                <div className={`${styles.statCard} ${styles.statGreen}`}>
                  <div className={styles.statIcon}>📦</div>
                  <div className={styles.statValue}>{financeCount}</div>
                  <div className={styles.statLabel}>İşlem Sayısı</div>
                </div>
                <div className={`${styles.statCard} ${styles.statBlue}`}>
                  <div className={styles.statIcon}>📈</div>
                  <div className={styles.statValue}>{financeCount > 0 ? formatCurrency(financeTotal / financeCount) : '—'}</div>
                  <div className={styles.statLabel}>Ortalama Sipariş</div>
                </div>
              </div>

              <BarChart
                data={getChartData()}
                label={{ daily: 'Son 7 Gün Geliri', monthly: 'Son 6 Ay Geliri', yearly: 'Yıllık Gelir Karşılaştırması' }[financePeriod]}
              />

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Ödeme Kayıtları</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Kullanıcı</th>
                      <th>Paket</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeFiltered.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
                          Bu dönem için ödeme kaydı bulunamadı.
                        </td>
                      </tr>
                    ) : financeFiltered.map(p => {
                      const pUser = users.find(u => u.id === p.userId);
                      return (
                        <tr key={p.id}>
                          <td>{formatDate(p.createdAt || p.date)}</td>
                          <td>{pUser?.displayName || pUser?.email || p.userId || '—'}</td>
                          <td>{p.packageName || p.product_name || '—'}</td>
                          <td style={{color:'var(--gold-secondary)',fontWeight:700}}>{formatCurrency(p.amount)}</td>
                          <td>
                            <span className={`${styles.badge} ${styles.badgeActive}`}>Tamamlandı</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: ACTIVITY */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'activity' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Kullanıcı Aktivitesi</div>
                  <div className={styles.panelSubtitle}>Giriş, kayıt ve pasiflik verileri</div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>🆕</div>
                  <div className={styles.statValue}>{todayUsers.length}</div>
                  <div className={styles.statLabel}>Bugün Kaydolan</div>
                </div>
                <div className={`${styles.statCard} ${styles.statBlue}`}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statValue}>{thisMonthUsers.length}</div>
                  <div className={styles.statLabel}>Bu Ay Kaydolan</div>
                </div>
                <div className={`${styles.statCard} ${styles.statGreen}`}>
                  <div className={styles.statIcon}>🟢</div>
                  <div className={styles.statValue}>{activeUsers.length}</div>
                  <div className={styles.statLabel}>Aktif (son 30 gün)</div>
                </div>
                <div className={`${styles.statCard} ${styles.statRed}`}>
                  <div className={styles.statIcon}>🔴</div>
                  <div className={styles.statValue}>{passiveUsers.length}</div>
                  <div className={styles.statLabel}>Pasif Kullanıcı</div>
                </div>
              </div>

              {/* Active Users */}
              <div className={styles.tableWrapper} style={{marginBottom:28}}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>🟢 Aktif Kullanıcılar (Son 30 Gün)</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ad / Email</th>
                      <th>Rol</th>
                      <th>Kayıt Tarihi</th>
                      <th>Son Giriş</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeUsers.length === 0 ? (
                      <tr><td colSpan={4} style={{textAlign:'center',padding:'24px',color:'var(--text-muted)'}}>Aktif kullanıcı yok.</td></tr>
                    ) : activeUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{fontWeight:600,color:'var(--text-primary)'}}>{u.displayName || '—'}</div>
                          <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{u.email}</div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${u.role === 'admin' ? styles.badgeAdmin : u.role === 'owner' ? styles.badgeOwner : styles.badgeInvestor}`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'owner' ? 'İlan Üyesi' : 'Yatırımcı'}
                          </span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td style={{color:'var(--accent-green)'}}>{formatDate(u.lastLogin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Passive Users */}
              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>🔴 Pasif Kullanıcılar (30+ Gün Giriş Yok)</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ad / Email</th>
                      <th>Rol</th>
                      <th>Kayıt Tarihi</th>
                      <th>Son Giriş</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passiveUsers.length === 0 ? (
                      <tr><td colSpan={4} style={{textAlign:'center',padding:'24px',color:'var(--text-muted)'}}>Tüm kullanıcılar aktif.</td></tr>
                    ) : passiveUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{fontWeight:600,color:'var(--text-primary)'}}>{u.displayName || '—'}</div>
                          <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{u.email}</div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${u.role === 'admin' ? styles.badgeAdmin : u.role === 'owner' ? styles.badgeOwner : styles.badgeInvestor}`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'owner' ? 'İlan Üyesi' : 'Yatırımcı'}
                          </span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td style={{color:'var(--accent-red)'}}>{formatDate(u.lastLogin) || 'Hiç giriş yapmadı'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: SUPPORT */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'support' && (
            <div>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Destek Talepleri</div>
                  <div className={styles.panelSubtitle}>Tüm support ticket'ları</div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statGold}`}>
                  <div className={styles.statIcon}>🎫</div>
                  <div className={styles.statValue}>{tickets.length}</div>
                  <div className={styles.statLabel}>Toplam Talep</div>
                </div>
                <div className={`${styles.statCard} ${styles.statRed}`}>
                  <div className={styles.statIcon}>🔓</div>
                  <div className={styles.statValue}>{tickets.filter(t => t.status !== 'closed').length}</div>
                  <div className={styles.statLabel}>Açık</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Destek Talepleri</div>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Konu</th>
                      <th>Kullanıcı</th>
                      <th>Tarih</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.length === 0 ? (
                      <tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Destek talebi yok.</td></tr>
                    ) : tickets.map(t => {
                      const tUser = users.find(u => u.id === t.userId);
                      return (
                        <tr key={t.id}>
                          <td style={{fontWeight:600,color:'var(--text-primary)'}}>{t.subject || t.title || '—'}</td>
                          <td style={{fontSize:'0.85rem'}}>{tUser?.displayName || tUser?.email || t.userId || '—'}</td>
                          <td>{formatDate(t.createdAt)}</td>
                          <td>
                            <span className={`${styles.badge} ${t.status === 'closed' ? styles.badgePaused : styles.badgeActive}`}>
                              {t.status === 'closed' ? 'Kapalı' : 'Açık'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              {t.userId && (
                                <button
                                  className={`${styles.btnSm} ${styles.btnBlue}`}
                                  onClick={() => {
                                    const tUser = users.find(u => u.id === t.userId);
                                    setMsgModal({ receiverId: t.userId, displayName: tUser?.displayName, email: tUser?.email });
                                  }}
                                >📧 Yanıtla</button>
                              )}
                              {t.status !== 'closed' && (
                                <button className={`${styles.btnSm} ${styles.btnGreen}`} onClick={() => handleCloseTicket(t.id)}>✓ Kapat</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
