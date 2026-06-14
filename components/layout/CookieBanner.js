'use client';

import React, { useEffect, useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const { cookieConsent, setCookieConsent, initCookieConsent } = useUiStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    initCookieConsent();
    const consent = localStorage.getItem('lux_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, [initCookieConsent]);

  const handleAccept = () => {
    setCookieConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={styles.banner} id="gdpr-cookie-consent">
      <div className={styles.content}>
        <p className={styles.text}>
          We use cookies to personalize content, analyze traffic, and enhance security. By continuing to explore our premium marketplace, you agree to our terms.
        </p>
        <div className={styles.actions}>
          <button onClick={handleDecline} className={styles.btnDecline} id="btn-cookie-decline">
            Decline
          </button>
          <button onClick={handleAccept} className={styles.btnAccept} id="btn-cookie-accept">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
