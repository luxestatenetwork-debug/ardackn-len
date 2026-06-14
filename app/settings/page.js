'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import styles from './Settings.module.css';

const TARGET_TYPES_OPTIONS = [
  { id: 'residential', label: 'Residential Real Estate' },
  { id: 'commercial', label: 'Commercial Real Estate' },
  { id: 'hotel', label: 'Hotel & Hospitality' },
  { id: 'land', label: 'Land & Development' },
  { id: 'industrial', label: 'Industrial & Logistics' },
  { id: 'mixed-use', label: 'Mixed-Use Projects' },
  { id: 'reit', label: 'REITs & Funds' },
  { id: 'golden-visa', label: 'Golden Visa Programs' },
];

export default function SettingsPage() {
  const { user, profile, loading: authLoading, updateProfileInfo, logout } = useAuthStore();
  const { addToast } = useUiStore();
  const router = useRouter();

  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Investor profile fields
  const [investmentVolume, setInvestmentVolume] = useState('');
  const [targetTypes, setTargetTypes] = useState([]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setCompanyName(profile.companyName || '');
      setPhone(profile.phone || '');
      setPhotoPreview(profile.photoURL || '');
      setInvestmentVolume(profile.investmentVolume || '');
      setTargetTypes(profile.targetTypes || []);
      setCountry(profile.country || '');
      setCity(profile.city || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleTargetTypeToggle = (typeId) => {
    setTargetTypes(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      addToast('Display name is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfileInfo(displayName, photoFile, {
        companyName,
        phone,
      });
      addToast('Profile updated successfully.', 'success');
      setPhotoFile(null);
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInvestor = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileInfo(displayName, null, {
        investmentVolume,
        targetTypes,
        country,
        city,
        bio,
      });
      addToast('Investor profile updated successfully.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update investor profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || !user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const isPremium = profile?.isPremium || profile?.premium || false;
  const slotsUsed = profile?.slots_used || 0;
  const slotsPurchased = profile?.slots_purchased || 0;

  const TABS = [
    { key: 'profile', label: '👤 Profile', icon: '👤' },
    { key: 'investor', label: '🌐 Investor Info', icon: '🌐' },
    { key: 'account', label: '⚙️ Account', icon: '⚙️' },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {(profile?.displayName || 'U')[0].toUpperCase()}
                </div>
              )}
              {isPremium && <span className={styles.premiumBadge}>👑</span>}
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{profile?.displayName || 'User'} <img src="/images/gold_seal.png" alt="Seal" style={{ width: 22, height: 22, verticalAlign: 'middle', marginLeft: 8, display: 'inline-block', borderRadius: '50%' }} /></h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.roleBadge}>
                {profile?.role === 'admin' ? '🛡️ Admin' : profile?.role === 'owner' ? '🏢 Listing Member' : '💼 Investor'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{slotsUsed}</div>
              <div className={styles.statLabel}>Active Listings</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statValue}>{slotsPurchased}</div>
              <div className={styles.statLabel}>Purchased Slots</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${isPremium ? styles.premiumStat : ''}`}>
                {isPremium ? 'Premium' : 'Standard'}
              </div>
              <div className={styles.statLabel}>Membership</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className={styles.form}>
            <div className={styles.sectionTitle}>Personal Information</div>

            <div className={styles.field}>
              <label className={styles.label}>Profile Photo</label>
              <div className={styles.photoUploadRow}>
                <div className={styles.photoPreviewSm}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className={styles.photoImg} />
                  ) : (
                    <div className={styles.photoPlaceholder}>📷</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className={styles.fileInput}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className={styles.uploadBtn}>
                  Choose Photo
                </label>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Display Name *</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={styles.input}
                  placeholder="Your full name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., Capital Partners LLC"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email (Read-only)</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className={`${styles.input} ${styles.inputReadonly}`}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}

        {/* TAB: Investor Info */}
        {activeTab === 'investor' && (
          <form onSubmit={handleSaveInvestor} className={styles.form}>
            <div className={styles.sectionTitle}>Investor Profile</div>
            <p className={styles.sectionSubtitle}>
              Complete your investor profile to receive tailored investment opportunities matching your criteria.
            </p>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., United States"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., New York"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Investment Volume (USD)</label>
              <select
                value={investmentVolume}
                onChange={(e) => setInvestmentVolume(e.target.value)}
                className={styles.select}
              >
                <option value="">Select Investment Range</option>
                <option value="under-1m">Under $1M</option>
                <option value="1m-5m">$1M – $5M</option>
                <option value="5m-20m">$5M – $20M</option>
                <option value="20m-100m">$20M – $100M</option>
                <option value="above-100m">Above $100M</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target Investment Types</label>
              <div className={styles.checkboxGrid}>
                {TARGET_TYPES_OPTIONS.map(opt => (
                  <label key={opt.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={targetTypes.includes(opt.id)}
                      onChange={() => handleTargetTypeToggle(opt.id)}
                      className={styles.checkbox}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Bio / Investment Mandate</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.textarea}
                placeholder="Briefly describe your investment strategy, focus areas, and criteria..."
              />
            </div>

            <button type="submit" disabled={saving} className={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save Investor Profile'}
            </button>
          </form>
        )}

        {/* TAB: Account */}
        {activeTab === 'account' && (
          <div className={styles.form}>
            <div className={styles.sectionTitle}>Account Management</div>

            {/* Membership / Slot Status */}
            <div className={styles.membershipCard}>
              <div className={styles.membershipHeader}>
                <span className={styles.membershipIcon}>{isPremium ? '👑' : '📋'}</span>
                <div>
                  <div className={styles.membershipTitle}>
                    {isPremium ? 'Premium Membership' : 'Standard Membership'}
                  </div>
                  <div className={styles.membershipDesc}>
                    {isPremium
                      ? '5 listing slots included with premium membership'
                      : `${slotsPurchased} slot(s) purchased, ${slotsUsed} used`}
                  </div>
                </div>
              </div>

              {!isPremium && (
                <a
                  href={`https://luxestate3.gumroad.com/l/xhqsuf?userId=${user.uid}&email=${encodeURIComponent(user.email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.upgradeBtn}
                >
                  🚀 Upgrade to Premium — $499
                </a>
              )}
            </div>

            <div className={styles.slotBarWrapper}>
              <div className={styles.slotBarLabel}>
                Listing Slots Used: {slotsUsed} / {isPremium ? 5 : slotsPurchased}
              </div>
              <div className={styles.slotBarTrack}>
                <div
                  className={styles.slotBarFill}
                  style={{
                    width: `${Math.min(100, (slotsUsed / Math.max(1, isPremium ? 5 : slotsPurchased)) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.dangerZone}>
              <div className={styles.dangerTitle}>⚠️ Danger Zone</div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
