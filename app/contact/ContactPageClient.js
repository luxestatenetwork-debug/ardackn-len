'use client';

import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUiStore } from '../../store/uiStore';
import styles from './Contact.module.css';

export default function ContactPageClient() {
  const { addToast } = useUiStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_requests'), {
        name,
        email,
        phone,
        message,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      addToast('Your contact request has been sent to our private office.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      addToast(err.message || 'Failed to submit form.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Private Capital Office</h1>
          <p className={styles.subtitle}>Communicate securely with our corporate representatives.</p>
        </div>

        <div className={styles.layout}>
          {/* Left panel: Private Office Mandate */}
          <div className={styles.infoCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Private Office Mandate</h3>
              <p className={styles.introDesc}>
                Lux Estate Network operates an exclusive Private Capital Office, providing bespoke transactional advisory
                services to high-net-worth investors, family offices, and institutional partners globally.
              </p>

              <ul className={styles.introList}>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Secure Communications:</strong> All digital communications are encrypted, and messages are
                    handled directly by assigned managing directors.
                  </div>
                </li>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Response SLA:</strong> Registered network members receive a priority response within 4 hours.
                    General mandates are reviewed within 1 business day.
                  </div>
                </li>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Direct Access:</strong> Telephonic routing is reserved for authenticated premium partners and
                    active mandate holders.
                  </div>
                </li>
              </ul>

              <div className={styles.contactDetails}>
                <p>✉️ Corporate Registry: executive@luxestatenetwork.com</p>
                <p>🕒 Core Advisory Hours: 09:00 – 18:00 (GMT)</p>
                <div className={styles.linkedinSection} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" width="24" height="24" fill="var(--lux-gold)" style={{ marginRight: '8px' }}>
                    <path d="M34 17c0 9.389-7.611 17-17 17S0 26.389 0 17 7.611 0 17 0s17 7.611 17 17zM9.735 12.308h4.529V27.6h-4.53V12.308zm2.264-5.378c1.453 0 2.632 1.18 2.632 2.633 0 1.453-1.179 2.632-2.632 2.632-1.453 0-2.632-1.179-2.632-2.632 0-1.453 1.179-2.633 2.632-2.633zM20.667 23.977c0-5.535-3.007-7.852-6.817-7.852-1.923 0-3.202.806-3.903 1.353v-1.146h-4.528c.06 1.034 0 15.292 0 15.292h4.528v-9.098c0-.489.035-.978.173-1.326.342-.885 1.122-1.804 2.428-1.804 1.715 0 2.404 1.302 2.404 3.212v8.016h4.528v-8.599z" />
                  </svg>
                  <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lux-gold)', fontWeight: '600', textDecoration: 'none' }}>
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className={styles.formCol}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Secure Inquiry Form</h2>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-name">Full Name / Organization *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="John Doe"
                    id="contact-name"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-email">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="name@organization.com"
                    id="contact-email"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-phone">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                    placeholder="+1 (555) 0199"
                    id="contact-phone"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-message">Secure Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.textarea}
                    placeholder="Detail your request or inquiry mandate..."
                    id="contact-message"
                  />
                </div>

                <button type="submit" disabled={submitting} className={styles.submitBtn} id="contact-btn">
                  {submitting ? 'Transmitting...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Global Offices Section */}
        <section className={styles.officesSection}>
          <h2 className={styles.officesTitle}>Global Office Network</h2>

          <div className={styles.officesGrid}>
            {[
              {
                name: 'London (Global HQ)',
                address: 'One Canada Square, Canary Wharf,\nLondon E14 5AB, United Kingdom',
                phone: '+44 20 7183 0199',
                email: 'london@luxestatenetwork.com',
                embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5404245942426!2d-0.0211181!3d51.5048455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9e6ff1b31%3A0x8bb57f2df4cf1cb7!2sOne%20Canada%20Square!5e0!3m2!1sen!2s!4v1717830000000!5m2!1sen!2s',
                title: 'London HQ Location',
              },
              {
                name: 'Istanbul Regional Office',
                address: 'Nurol Tower, İzzet Paşa Mahallesi,\nYeni Yol Cd. No:3, 34387 Şişli / Istanbul, Turkey',
                phone: '+90 212 555 0199',
                email: 'istanbul@luxestatenetwork.com',
                embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2045558914616!2d28.9863483!3d41.0645607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab6e382d61993%3A0x67efcd9c464c8dcf!2sNurol%20Tower!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str',
                title: 'Istanbul Office Location',
              },
              {
                name: 'Dubai MEASA Hub',
                address: 'Al Sufouh – Dubai Internet City,\nDubai, United Arab Emirates',
                phone: '+971 4 455 0199',
                email: 'dubai@luxestatenetwork.com',
                embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.56846985448!2d55.1539203!3d25.1011116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b67fd5ab01d%3A0x7d90c9b0cf7bc5!2sDubai%20Internet%20City!5e0!3m2!1sen!2s!4v1717830100000!5m2!1sen!2s',
                title: 'Dubai Office Location',
              },
              {
                name: 'Miami Americas Hub',
                address: '1111 Brickell Ave,\nMiami, FL 33131, USA',
                phone: '+1 305 555 0199',
                email: 'miami@luxestatenetwork.com',
                embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.1558296338424!2d-80.1930278!3d25.7654279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b68ff0df4dfd%3A0xbd86b16cc8c42a20!2s1111%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131%2C%20USA!5e0!3m2!1sen!2s!4v1717830200000!5m2!1sen!2s',
                title: 'Miami Office Location',
              },
            ].map((office) => (
              <div key={office.name} className={styles.officeCard}>
                <div className={styles.officeHeader}>
                  <h3 className={styles.officeName}>{office.name}</h3>
                  <address className={styles.officeAddress}>
                    {office.address.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                    ))}
                  </address>
                  <div className={styles.officeContact}>
                    <span>📞 {office.phone}</span>
                    <span>✉️ {office.email}</span>
                  </div>
                </div>
                <div className={styles.officeMap}>
                  <iframe
                    title={office.title}
                    src={office.embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
