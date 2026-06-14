'use client';

import React from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from './MembershipSection.module.css';

export default function MembershipSection() {
  const { user, profile } = useAuthStore();

  const baseGumroadUrl = 'https://luxestate3.gumroad.com/l/xhqsuf';
  const redirectParam = typeof window !== 'undefined'
    ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}`
    : '';
  const checkoutUrl = user
    ? `${baseGumroadUrl}?userId=${user.uid}&email=${encodeURIComponent(user.email)}${redirectParam}`
    : '/register?redirect=publish';

  const purchased = profile?.slots_purchased || 0;
  const used      = profile?.slots_used      || 0;
  const isPremium = profile?.isPremium || profile?.premium || false;
  const available = Math.max(0, (isPremium ? 5 : purchased) - used);

  return (
    <section className={styles.section} id="membership-pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>EXCLUSIVE ACCESS</span>
          <h2 className={styles.title}>
            PARTNER &amp; <span className="gold-gradient-text">LISTING MEMBERSHIPS</span>
          </h2>
          <p className={styles.desc}>
            Acquire listing slots to publish premium placements. Investors browse and communicate free of charge.
          </p>
        </div>

        <div className={styles.grid}>

          {/* ── Tier 1: Free Investor ─────────────────────── */}
          <div className={styles.card} id="tier-investor">
            <h3 className={styles.tierName}>Qualified Investor</h3>
            <div className={styles.priceContainer}>
              <span className={styles.currency}>$</span>
              <span className={styles.price}>0</span>
              <span className={styles.period}>/ lifetime</span>
            </div>
            <p className={styles.tierDesc}>
              For single family offices, wealth managers, venture capital allocators, and angel investors.
            </p>
            <ul className={styles.features}>
              <li>✓ Full access to investment database</li>
              <li>✓ Advanced semantic matching AI</li>
              <li>✓ Direct messaging with listing owners</li>
              <li>✓ Save favorites and track updates</li>
              <li>✓ Private support dashboard</li>
            </ul>
            <a href="/register" className={styles.btnSecondary} id="btn-register-investor">
              Register Free Profile
            </a>
          </div>

          {/* ── Tier 2: Platinum Listing Member ──────────── */}
          <div className={`${styles.card} ${styles.platinumCard}`} id="tier-owner">
            <div className={styles.featuredBadge}>⭐ PLATINUM MEMBERSHIP</div>

            {/* Platinum crown icon */}
            <div className={styles.platinumIcon}>👑</div>

            <h3 className={styles.tierName}>Platinum Listing Member</h3>

            <div className={styles.priceContainer}>
              <span className={styles.currency}>$</span>
              <span className={styles.price}>499</span>
              <span className={styles.period}>/ year</span>
            </div>

            <p className={styles.tierDesc}>
              For luxury property developers, business brokers, startup founders, and fund managers seeking global capital exposure.
            </p>

            <ul className={styles.features}>
              <li>✓ <strong>5 Active Placements</strong> at any time</li>
              <li>✓ Pause, replace, renew listings freely</li>
              <li>✓ Up to <strong>30 images</strong> per listing + video & PDF</li>
              <li>✓ Receive investor inquiries directly in inbox</li>
              <li>✓ AI-powered investor matching engine</li>
              <li>✓ System slots automatically managed</li>
              <li>✓ Priority placement in search results</li>
              <li>✓ Instant approval priority queue</li>
            </ul>

            {/* Slot highlight pill */}
            <div className={styles.slotPill}>
              <span className={styles.slotPillNum}>5</span>
              <span className={styles.slotPillLabel}>listing slots included</span>
            </div>

            <a
              href={checkoutUrl}
              target={user ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={styles.btnPrimary}
              id="btn-purchase-membership"
            >
              {user
                ? isPremium || purchased >= 5
                  ? 'Renew Platinum Membership'
                  : 'Upgrade to Platinum — $499/yr'
                : 'Register & Activate Platinum'}
            </a>

            <p className={styles.guarantee}>
              🔒 Secure payment via Gumroad · Annual subscription
            </p>
          </div>
        </div>

        {/* ── Dynamic Status Box (logged-in users) ────────── */}
        {user && profile && (
          <div className={styles.statusBox} id="membership-status-box">
            <h4 className={styles.statusTitle}>Your Membership Status</h4>
            <div className={styles.statusRow}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Current Plan</span>
                <span className={styles.statusVal}>
                  {isPremium
                    ? '👑 Platinum'
                    : purchased > 0
                    ? 'Active Member'
                    : profile.role === 'investor'
                    ? 'Investor (Free)'
                    : '— No Package'}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Total Slots</span>
                <span className={styles.statusVal}>{isPremium ? 5 : purchased}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Used Slots</span>
                <span className={styles.statusVal}>{used}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Available</span>
                <span className={styles.statusVal} style={{ color: available > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {available}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
