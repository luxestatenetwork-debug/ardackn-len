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
function RegisterForm() {
  const { register, user, profile, error, clearError, loading } = useAuthStore();
  const { addToast } = useUiStore();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [displayName, setDisplayName]   = useState('');
  const [role, setRole]                 = useState('owner');
  const [acceptKVKK, setAcceptKVKK]     = useState(false);
  const [acceptTerms, setAcceptTerms]   = useState(false);
  const [photoFile, setPhotoFile]       = useState(null);
  const router   = useRouter();
  const params   = useSearchParams();
  const redirect = params.get('redirect'); // 'publish' when coming from hero CTA

  // If already logged in handle redirect
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
      if (userProfile?.role === 'owner' || role === 'owner') {
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
    if (!email || !password || !displayName) {
      addToast('Please complete all required fields.', 'error'); return;
    }
    if (!acceptKVKK || !acceptTerms) {
      addToast('You must accept the KVKK and User Agreement.', 'error'); return;
    }
    try {
      await register(email, password, displayName, role, photoFile);
      addToast('Registration successful! Redirecting…', 'success');

      if (redirect === 'publish' && role === 'owner') {
        // New owner with zero slots — send straight to Gumroad
        const redirectParam = typeof window !== 'undefined' ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}` : '';
        window.location.href = `${GUMROAD_BASE}?email=${encodeURIComponent(email)}&source=register${redirectParam}`;
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>

          {/* Logo branding */}
          <div className={styles.logoRow}>
            <Image
              src="/images/logo.png"
              alt="Lux Estate Network"
              width={120}
              height={48}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h1 className={styles.title}>
            {redirect === 'publish' ? 'Request Publisher Access' : 'Apply for Membership'}
          </h1>
          <p className={styles.subtitle}>
            {redirect === 'publish'
              ? 'Begin your onboarding — then select a listing package to publish opportunities.'
              : 'Lux Estate Network is an exclusive private ecosystem. All applications undergo a strict vetting process to maintain the highest standard of global capital flow.'}
          </p>

          {/* Payment funnel step indicator */}
          {redirect === 'publish' && (
            <div className={styles.funnelBadge}>
              <span>📋</span> Step 1 of 2 — Register &rarr; Payment
            </div>
          )}

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="displayName" className={styles.label}>Full Name / Corporation</label>
              <input
                id="displayName" type="text" required value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={styles.input} placeholder="John Doe or Sterling Ltd"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Corporate Email</label>
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
                autoComplete="new-password"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="role" className={styles.label}>Mandate Type</label>
              <select
                id="role" value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
              >
                <option value="owner">Listing Owner (Publish investment opportunities)</option>
                <option value="investor">Qualified Investor (Browse &amp; contact listings)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="photoFile" className={styles.label}>Profile Photo (Optional)</label>
              <input
                id="photoFile" type="file" accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className={styles.input}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox" checked={acceptKVKK}
                  onChange={(e) => setAcceptKVKK(e.target.checked)} required
                />
                I have read and accept the KVKK (GDPR) Clarification Text. *
              </label>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox" checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)} required
                />
                I have read and accept the{' '}
                <Link href="/terms" className={styles.link} target="_blank">User Agreement</Link>. *
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.btnSubmit}
              id="btn-register-submit"
            >
              {loading
                ? 'Processing Application...'
                : redirect === 'publish' && role === 'owner'
                ? 'Submit Application & Proceed to Payment →'
                : 'Submit Membership Application'}
            </button>
          </form>

          <p className={styles.footerText}>
            Already registered?{' '}
            <Link
              href={redirect ? `/login?redirect=${redirect}` : '/login'}
              className={styles.link}
            >
              Member Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Default export wraps in Suspense to satisfy Next.js 14 ──────────────────
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)'
      }}>
        Loading…
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
