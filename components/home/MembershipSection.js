'use client';

import React from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from './MembershipSection.module.css';

const investorFeatures = [
  'Full access to investment database',
  'Advanced semantic matching AI',
  'Direct messaging with listing owners',
  'Save favourites and track updates',
  'Private support dashboard',
];

const platinumFeatures = [
  { text: '5 Active Placements', bold: true, suffix: ' at any time' },
  { text: 'Pause, replace, renew listings freely' },
  { text: 'Up to ', bold: false, boldPart: '30 images', suffix: ' per listing + video & PDF' },
  { text: 'Receive investor inquiries directly in inbox' },
  { text: 'AI-powered investor matching engine' },
  { text: 'System slots automatically managed' },
  { text: 'Priority placement in search results' },
  { text: 'Instant approval priority queue' },
];

function CrownIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 17h20l-2-9-5 4L12 4 9 12 4 8 2 17z" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );
}

export default function MembershipSection() {
  const { user, profile } = useAuthStore();

  const baseGumroadUrl = 'https://luxestate3.gumroad.com/l/xhqsuf';
  const redirectParam =
    typeof window !== 'undefined'
      ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}`
      : '';
  const checkoutUrl = user
    ? `${baseGumroadUrl}?userId=${user.uid}&email=${encodeURIComponent(user.email)}${redirectParam}`
    : '/register?redirect=publish';

  const purchased = profile?.slots_purchased || 0;
  const used = profile?.slots_used || 0;
  const isPremium = profile?.isPremium || profile?.premium || false;
  const available = Math.max(0, (isPremium ? 5 : purchased) - used);

  return (
    <section className={styles.section} id="membership-pricing">
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.label}>EXCLUSIVE ACCESS</p>
          <h2 className={styles.heading}>
            PARTNER &amp; <span className={styles.goldText}>LISTING MEMBERSHIPS</span>
          </h2>
          <p className={styles.desc}>
            Acquire listing slots to publish premium placements. Investors browse and communicate free of charge.
          </p>
          <div className={styles.divider} />
        </div>

        {/* Pricing grid */}
        <div className={styles.grid}>

          {/* ── Tier 1: Free Investor ── */}
          <div className={styles.card} id="tier-investor">
            <div className={styles.tierTop}>
              <div className={styles.freeIconWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={styles.freeIcon}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <h3 className={styles.tierName}>Qualified Investor</h3>

            <div className={styles.priceRow}>
              <span className={styles.currency}>$</span>
              <span className={styles.price}>0</span>
              <span className={styles.period}>/ lifetime</span>
            </div>

            <p className={styles.tierDesc}>
              For family offices, wealth managers, venture capital allocators, and angel investors.
            </p>

            <ul className={styles.features}>
              {investorFeatures.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.check}><CheckIcon /></span>
                  {f}
                </li>
              ))}
            </ul>

            <a href="/register" className={styles.btnSecondary} id="btn-register-investor">
              Register Free Profile
            </a>
          </div>

          {/* ── Tier 2: Platinum ── */}
          <div className={`${styles.card} ${styles.platinumCard}`} id="tier-owner">
            <div className={styles.featuredBadge}>⭐ PLATINUM MEMBERSHIP</div>

            <div className={styles.tierTop}>
              <div className={styles.platinumIconWrap}>
                <CrownIcon className={styles.crownIcon} />
              </div>
            </div>

            <h3 className={`${styles.tierName} ${styles.platinumName}`}>Platinum Listing Member</h3>

            <div className={styles.priceRow}>
              <span className={`${styles.currency} ${styles.goldCurrency}`}>$</span>
              <span className={`${styles.price} ${styles.goldPrice}`}>499</span>
              <span className={styles.period}>/ year</span>
            </div>

            <p className={styles.tierDesc}>
              For luxury property developers, business brokers, startup founders, and fund managers seeking global capital exposure.
            </p>

            <ul className={styles.features}>
              {platinumFeatures.map((f, i) => (
                <li key={i} className={`${styles.featureItem} ${styles.platinumFeature}`}>
                  <span className={`${styles.check} ${styles.goldCheck}`}><CheckIcon /></span>
                  {f.bold && f.suffix
                    ? <><strong>{f.text}</strong>{f.suffix}</>
                    : f.boldPart
                    ? <>{f.text}<strong>{f.boldPart}</strong>{f.suffix}</>
                    : f.text}
                </li>
              ))}
            </ul>

            {/* Slot pill */}
            <div className={styles.slotPill}>
              <span className={styles.slotNum}>5</span>
              <div>
                <p className={styles.slotLabel}>Listing Slots Included</p>
                <p className={styles.slotSub}>Pause, replace, or renew at any time</p>
              </div>
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
                  ? 'Renew Platinum — $499/yr'
                  : 'Upgrade to Platinum — $499/yr'
                : 'Register & Activate Platinum'}
            </a>

            <p className={styles.guarantee}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{display:'inline-block',verticalAlign:'middle',marginRight:5}}>
                <rect x="3" y="7" width="10" height="8" rx="1" />
                <path d="M5 7V5a3 3 0 016 0v2" />
              </svg>
              Secure payment via Gumroad · Annual subscription
            </p>
          </div>
        </div>

        {/* ── Dynamic Status Box (logged-in users only) ── */}
        {user && profile && (
          <div className={styles.statusBox} id="membership-status-box">
            <h4 className={styles.statusTitle}>Your Membership Status</h4>
            <div className={styles.statusRow}>
              {[
                {
                  label: 'Current Plan',
                  value: isPremium
                    ? '★ Platinum'
                    : purchased > 0
                    ? 'Active Member'
                    : profile.role === 'investor'
                    ? 'Investor (Free)'
                    : '— No Package',
                  gold: isPremium,
                },
                { label: 'Total Slots', value: isPremium ? 5 : purchased },
                { label: 'Used Slots', value: used },
                {
                  label: 'Available',
                  value: available,
                  color: available > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                },
              ].map((item) => (
                <div key={item.label} className={styles.statusItem}>
                  <span className={styles.statusLabel}>{item.label}</span>
                  <span
                    className={styles.statusVal}
                    style={{
                      color: item.gold
                        ? 'var(--lux-gold)'
                        : item.color || 'inherit',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
