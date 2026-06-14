'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import styles from './PaymentSuccess.module.css';

export default function PaymentSuccessPage() {
  const { user, profile } = useAuthStore();
  const { addToast } = useUiStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [checking, setChecking]   = useState(true);
  const [manualProfile, setManualProfile] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const currentProfile = manualProfile || profile;

  const hasPaid =
    (currentProfile?.slots_purchased || 0) > 0 ||
    currentProfile?.isPremium ||
    currentProfile?.premium;

  // Once profile loads or syncs, if they paid, stop checking
  useEffect(() => {
    if (currentProfile) {
      if (hasPaid) {
        setChecking(false);
      } else {
        // If profile exists but slots_purchased is still 0, keep checking for 10 seconds or until sync
        const checkTimer = setTimeout(() => {
          setChecking(false);
        }, 8000);
        return () => clearTimeout(checkTimer);
      }
    }
  }, [currentProfile, hasPaid]);

  // Auto-redirect countdown to dashboard ONLY IF they have paid
  useEffect(() => {
    if (!hasPaid) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router, hasPaid]);

  const handleManualSync = async () => {
    if (!user) {
      addToast('Please log in to sync your status.', 'error');
      return;
    }
    setSyncing(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setManualProfile(data);
        if ((data.slots_purchased || 0) > 0 || data.isPremium || data.premium) {
          addToast('Account activated successfully!', 'success');
          setChecking(false);
          setCountdown(5);
        } else {
          addToast('Payment webhook is still processing. Please wait 5-10 seconds and sync again.', 'info');
        }
      } else {
        addToast('Profile document not found on server.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error syncing payment status. Try again.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <Image
            src="/images/logo.png"
            alt="Lux Estate Network"
            width={130}
            height={52}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Animated checkmark or loading spinner */}
        <div className={styles.iconRing}>
          {hasPaid ? (
            <div className={styles.checkIcon}>✓</div>
          ) : (
            <div className={styles.spinnerIcon}>⌛</div>
          )}
        </div>

        <h1 className={styles.title}>
          {hasPaid ? 'Payment Received!' : 'Processing Payment...'}
        </h1>
        
        <p className={styles.subtitle}>
          {hasPaid 
            ? 'Welcome to the Lux Estate Network. Your listing package has been activated.'
            : 'We are verifying your transaction with Gumroad. This normally takes a few seconds.'}
        </p>

        {/* Slot status */}
        {hasPaid && (
          <div className={styles.slotBadge}>
            <span className={styles.slotIcon}>🏛</span>
            <div>
              <div className={styles.slotCount}>{currentProfile?.slots_purchased || 5} Listing Slots</div>
              <div className={styles.slotLabel}>Ready to publish</div>
            </div>
          </div>
        )}

        {/* Sync panel if payment not detected yet */}
        {!hasPaid && (
          <div className={styles.syncContainer}>
            <p className={styles.syncText}>
              Firestore hasn&apos;t received the payment confirmation yet. If you have completed the purchase, click the button below to sync with the server.
            </p>
            <button 
              onClick={handleManualSync} 
              disabled={syncing} 
              className={styles.syncBtn}
            >
              {syncing ? (
                <>
                  <span className={styles.btnSpinner}></span> Syncing Status...
                </>
              ) : (
                '🔄 Sync Payment Status'
              )}
            </button>
          </div>
        )}

        {/* Countdown if paid */}
        {hasPaid && (
          <div className={styles.countdown}>
            Redirecting to your dashboard in{' '}
            <span className={styles.countdownNum}>{countdown}</span>s
          </div>
        )}

        {/* Actions - Return to Dashboard is the most prominent element */}
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryBtn} id="btn-go-dashboard">
            Return to Dashboard
          </Link>
          
          {hasPaid && (
            <Link href="/listings/create" className={styles.secondaryBtn} id="btn-publish-now">
              Publish a Listing →
            </Link>
          )}
        </div>

        <p className={styles.note}>
          Your session is active. You can return to your dashboard or listings page anytime.
        </p>
      </div>
    </div>
  );
}
