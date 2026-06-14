'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../../../store/authStore';
import { useUiStore } from '../../../store/uiStore';
import styles from './Auth.module.css';

const GUMROAD_BASE = 'https://luxestate3.gumroad.com/l/xhqsuf';

// ── Inner component reads useSearchParams (must be inside Suspense) ──────────
function LoginForm() {
  const { login, user, profile, error, clearError, loading } = useAuthStore();
  const { addToast } = useUiStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const router   = useRouter();
  const params   = useSearchParams();
  const redirect = params.get('redirect'); // 'publish' when coming from hero CTA

  // If already logged in, handle redirect immediately
  useEffect(() => {
    if (user && profile) handlePostAuthRedirect(user, profile);
    return () => clearError();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  const handlePostAuthRedirect = (firebaseUser, userProfile) => {
    if (userProfile?.role === 'admin') {
      router.push('/admin');
      return;
    }
    if (redirect === 'publish') {
      if (userProfile?.role === 'owner') {
        const hasPaid =
          (userProfile?.slots_purchased || 0) > 0 ||
          userProfile?.isPremium ||
          userProfile?.premium;
        if (!hasPaid) {
          const redirectParam = typeof window !== 'undefined' ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}` : '';
          window.location.href = `${GUMROAD_BASE}?userId=${firebaseUser.uid}&email=${encodeURIComponent(firebaseUser.email)}${redirectParam}`;
          return;
        }
        router.push('/listings/create');
        return;
      }
    }
    router.push('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { addToast('Please enter both email and password.', 'error'); return; }
    try {
      await login(email, password);
      addToast('Successfully signed in.', 'success');
      // Navigation handled by useEffect once profile loads
    } catch (err) {
      addToast(err.message || 'Authentication failed.', 'error');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>

          <div className={styles.logoRow}>
            <Image src="/images/logo.png" alt="Lux Estate Network" width={120} height={48} style={{ objectFit: 'contain' }} />
          </div>

          <h1 className={styles.title}>Member Access Portal</h1>
          <p className={styles.subtitle}>
            {redirect === 'publish'
              ? 'Sign in to continue to your listing package.'
              : 'Enter your secure credentials to access the private network.'}
          </p>

          {redirect === 'publish' && (
            <div className={styles.funnelBadge}>
              <span>🔒</span> Sign in to publish your listing
            </div>
          )}

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input} placeholder="name@organization.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Secure Password</label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input} placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit} id="btn-login-submit">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.footerText}>
            First time?{' '}
            <Link href={redirect ? `/register?redirect=${redirect}` : '/register'} className={styles.link}>
              Apply for Membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Default export wraps in Suspense to satisfy Next.js 14 ──────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
