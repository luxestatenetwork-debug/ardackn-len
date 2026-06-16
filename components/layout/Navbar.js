'use client';

// Navbar v2 — Premium Mobile-First Design
// Last updated: 2026-06-16

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home', id: 'nav-home' },
  { href: '/about', label: 'About Us', id: 'nav-about' },
  { href: '/listings?tab=investors', label: 'Investors', id: 'nav-investors' },
  { href: '/listings?tab=developers', label: 'Developers', id: 'nav-developers' },
  { href: '/listings', label: 'Network', id: 'nav-network' },
  { href: '/contact', label: 'Contact', id: 'nav-contact' },
];

export default function Navbar() {
  const { user, profile, logout, initAuth } = useAuthStore();
  const { aiAssistantOpen, setAiAssistantOpen } = useUiStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Detect scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, []);

  // Escape key closes everything
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.container}>

          {/* ── Brand Logo ── */}
          <Link href="/" className={styles.logoContainer} id="nav-logo" onClick={closeMenu}>
            <div className={styles.logoWrapper}>
              <img src="/images/logo.png" alt="Lux Estate Network Logo" className={styles.logoImg} />
              <div className={styles.logoTextGroup}>
                <span className={styles.logoMain}>LEN</span>
                <span className={styles.logoSub}>LUX ESTATE NETWORK</span>
                <span className={styles.logoMuted}>PRIVATE CAPITAL &amp; LUXURY INVESTMENTS</span>
              </div>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, id }) => (
              <Link key={id} href={href} className={styles.navLink} id={id}>
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop User / CTA Area ── */}
          <div className={styles.authArea}>
            {user ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                {profile?.role === 'owner' && (
                  <div className={styles.slotsIndicator} id="nav-slots-indicator">
                    Slots: <span className={styles.slotsCount}>{profile.slots_used || 0}/{profile.slots_purchased || 0}</span>
                  </div>
                )}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={styles.profileBtn}
                  id="nav-profile-menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {(profile?.isPremium || profile?.premium) && <span style={{ marginRight: 4 }}>👑</span>}
                  {profile?.displayName || user.email}
                  <img src="/images/gold_seal.png" alt="Verified" style={{ width: 16, height: 16, verticalAlign: 'middle', marginLeft: 6, display: 'inline-block', borderRadius: '50%' }} />
                  <span className={`${styles.arrow} ${dropdownOpen ? styles.arrowUp : ''}`}>▼</span>
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdown} id="nav-dropdown-menu" role="menu">
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={closeMenu} id="nav-dashboard-link" role="menuitem">Dashboard</Link>
                    <Link href="/settings" className={styles.dropdownItem} onClick={closeMenu} id="nav-settings-link" role="menuitem">Settings</Link>
                    {profile?.role === 'owner' && (
                      <Link href="/listings/create" className={styles.dropdownItem} onClick={closeMenu} id="nav-create-listing-link" role="menuitem">Publish Listing</Link>
                    )}
                    {profile?.role === 'admin' && (
                      <Link href="/admin" className={styles.dropdownItem} onClick={closeMenu} id="nav-admin-link" role="menuitem">Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); closeMenu(); }} className={`${styles.dropdownItem} ${styles.logout}`} id="nav-logout-btn" role="menuitem">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.guestActions}>
                <Link href="/login" className={styles.signInBtn} id="nav-signin-btn">
                  Sign In
                </Link>
                <Link href="/register" className={styles.joinBtn} id="nav-join-btn">
                  Join Network
                </Link>
              </div>
            )}
          </div>

          {/* ── Hamburger — mobile only ── */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            id="nav-hamburger"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {/* ── Mobile Backdrop ── */}
      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <nav
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {/* Drawer header with logo */}
        <div className={styles.mobileHeader}>
          <div className={styles.mobileLogoRow}>
            <img src="/images/logo.png" alt="LEN" className={styles.mobileLogoImg} />
            <div>
              <div className={styles.mobileLogoMain}>LEN</div>
              <div className={styles.mobileLogoSub}>LUX ESTATE NETWORK</div>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Close menu"
            id="nav-close-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.mobileMenuInner}>
          {/* Main nav links */}
          {NAV_LINKS.map(({ href, label, id }, i) => (
            <Link
              key={id}
              href={href}
              className={styles.mobileNavLink}
              onClick={closeMenu}
              id={`mobile-${id}`}
              style={{ animationDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
            >
              {label}
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          {user ? (
            <>
              <Link href="/dashboard" className={styles.mobileNavLink} onClick={closeMenu}>Dashboard</Link>
              <Link href="/settings" className={styles.mobileNavLink} onClick={closeMenu}>Settings</Link>
              {profile?.role === 'owner' && (
                <Link href="/listings/create" className={styles.mobileNavLink} onClick={closeMenu}>Publish Listing</Link>
              )}
              {profile?.role === 'admin' && (
                <Link href="/admin" className={styles.mobileNavLink} onClick={closeMenu}>Admin Panel</Link>
              )}
              <button
                onClick={() => { logout(); closeMenu(); }}
                className={`${styles.mobileNavLink} ${styles.mobileLogout}`}
              >
                Logout
              </button>
            </>
          ) : (
            <div className={styles.mobileAuthButtons}>
              <Link href="/login" className={styles.mobileSignInBtn} onClick={closeMenu} id="mobile-signin-btn">
                Sign In
              </Link>
              <Link href="/register" className={styles.mobileJoinBtn} onClick={closeMenu} id="mobile-join-btn">
                ✦ Join Network
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
