'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, profile, logout, initAuth } = useAuthStore();
  const { aiAssistantOpen, setAiAssistantOpen } = useUiStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logoContainer} id="nav-logo">
          <div className={styles.logoWrapper}>
            <img src="/images/logo.png" alt="Lux Estate Network Logo" className={styles.logoImg} />
            <div className={styles.logoTextGroup}>
              <span className={styles.logoMain}>LEN</span>
              <span className={styles.logoSub}>LUX ESTATE NETWORK</span>
              <span className={styles.logoMuted}>PRIVATE CAPITAL & LUXURY INVESTMENTS</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/listings?tab=categories" className={styles.navLink} id="nav-categories">
            CATEGORIES
          </Link>
          <Link href="/about" className={styles.navLink} id="nav-about">
            ABOUT LEN
          </Link>
          <button 
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)} 
            className={styles.navLink}
            id="nav-ai-assistant"
          >
            AI ASSISTANT
          </button>
          <Link href="/contact" className={styles.navLink} id="nav-contact">
            CONTACT
          </Link>
        </nav>

        {/* User / CTA Area */}
        <div className={styles.authArea}>
          {user ? (
            <div className={styles.userMenu}>
              {profile?.role === 'owner' && (
                <div className={styles.slotsIndicator} id="nav-slots-indicator">
                  Slots: <span className={styles.slotsCount}>{profile.slots_used || 0}/{profile.slots_purchased || 0}</span>
                </div>
              )}
              
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className={styles.profileBtn}
                id="nav-profile-menu"
              >
                {(profile?.isPremium || profile?.premium) && <span style={{ marginRight: 4 }}>👑</span>}
                {profile?.displayName || user.email} <img src="/images/gold_seal.png" alt="Seal" style={{ width: 16, height: 16, verticalAlign: 'middle', marginLeft: 6, display: 'inline-block', borderRadius: '50%' }} />
                <span className={styles.arrow}>▼</span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown} id="nav-dropdown-menu">
                  <Link 
                    href="/dashboard" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    id="nav-dashboard-link"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    id="nav-settings-link"
                  >
                    Settings
                  </Link>
                  {profile?.role === 'owner' && (
                    <Link 
                      href="/listings/create" 
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                      id="nav-create-listing-link"
                    >
                      Publish Listing
                    </Link>
                  )}
                  {profile?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                      id="nav-admin-link"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }} 
                    className={`${styles.dropdownItem} ${styles.logout}`}
                    id="nav-logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.guestActions}>
              <Link href="/login" className={styles.privateAccessBtn} id="nav-login-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px', transform: 'translateY(-1px)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                PRIVATE ACCESS
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
