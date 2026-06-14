'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { user, profile } = useAuthStore();

  const getPublishHref = () => {
    if (!user) return '/register?redirect=publish';
    if (profile?.role === 'admin') return '/listings/create';
    if (profile?.role === 'owner') {
      const hasPaid = (profile?.slots_purchased || 0) > 0 || profile?.isPremium || profile?.premium;
      if (!hasPaid) {
        const redirectParam = typeof window !== 'undefined' ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}` : '';
        return `https://luxestate3.gumroad.com/l/xhqsuf?userId=${user.uid}&email=${encodeURIComponent(user.email)}${redirectParam}`;
      }
      return '/listings/create';
    }
    return '/register?redirect=publish';
  };

  const publishHref = getPublishHref();

  return (
    <section className={styles.hero} id="home-hero">
      <div className={styles.visualOverlay}></div>
      <div className={styles.gradientOverlay}></div>

      <div className={styles.content}>
        <div className={styles.badge}>EXECUTIVE INVESTMENT PLATFORM</div>
        
        <h1 className={styles.title} id="hero-title">
          EXCLUSIVE OPPORTUNITIES.<br />
          <span className={styles.goldText}>ELITE INVESTORS.</span>
        </h1>
        
        <p className={styles.subtitle} id="hero-subtitle">
          A private network connecting exceptional investment opportunities with qualified investors worldwide.
        </p>

        <div className={styles.requestAccessWrapper}>
          <Link href="/register" className={styles.primaryAccessBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            REQUEST PRIVATE ACCESS
          </Link>
          <span className={styles.packageText}>ONE-TIME $499 PACKAGE = 5 LISTING SLOTS</span>
        </div>

        <div className={styles.secondaryBtns}>
          <Link href="/listings?tab=categories" className={styles.outlineBtn}>EXPLORE OPPORTUNITIES</Link>
          <Link href={publishHref} className={styles.outlineBtn}>ACQUIRE LISTING SLOTS</Link>
        </div>

        <div className={styles.featuresRow}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.49-.09a5.06 5.06 0 0 1 3.42 1.33v.01a4.91 4.91 0 0 1 1.05 4.38L21 21"/></svg>
            </div>
            <div className={styles.featureText}>CURATED<br/>OPPORTUNITIES</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>
            </div>
            <div className={styles.featureText}>VERIFIED<br/>LISTINGS</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            </div>
            <div className={styles.featureText}>PRIVATE ACCESS<br/>NETWORK</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className={styles.featureText}>GLOBAL CAPITAL<br/>CONNECTIONS</div>
          </div>
        </div>
      </div>

      <div className={styles.categoriesBar}>
        <div className={styles.catLabel}>OUR INVESTMENT<br/>CATEGORIES</div>
        <div className={styles.catDivider}></div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
          LUXURY REAL ESTATE
        </div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
          HOTELS & RESORTS
        </div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 14.76V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v11.26"/><path d="M22 21H2"/><path d="M20 21v-7a1 1 0 0 0-1-1h-5"/><path d="M10 21v-4h4v4"/><path d="M10 6h.01"/><path d="M10 10h.01"/><path d="M10 14h.01"/></svg>
          COMMERCIAL PROPERTIES
        </div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          PRIVATE EQUITY
        </div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
          STARTUP INVESTMENTS
        </div>
        <div className={styles.catItem}>
          <svg className={styles.catIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20"/><path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="m10 16-2.5-4"/><path d="m14 16 2.5-4"/><path d="m8 11.5-2.5-4"/><path d="m16 11.5 2.5-4"/><path d="M3 22h18"/></svg>
          RENEWABLE ENERGY
        </div>
      </div>
    </section>
  );
}
