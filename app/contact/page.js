'use client';

import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUiStore } from '../../store/uiStore';
import styles from './Contact.module.css';

export default function ContactPage() {
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
        createdAt: new Date().toISOString()
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
                Lux Estate Network operates an exclusive Private Capital Office, providing bespoke transactional advisory services to high-net-worth investors, family offices, and institutional partners globally.
              </p>
              
              <ul className={styles.introList}>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Secure Communications:</strong> All digital communications are encrypted, and messages are handled directly by assigned managing directors.
                  </div>
                </li>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Response SLA:</strong> Registered network members receive a priority response within 4 hours. General mandates are reviewed within 1 business day.
                  </div>
                </li>
                <li className={styles.introListItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Direct Access:</strong> Telephonic routing is reserved for authenticated premium partners and active mandate holders.
                  </div>
                </li>
              </ul>

              <div className={styles.contactDetails}>
                <p>✉️ Corporate Registry: executive@luxestatenetwork.com</p>
                <p>🕒 Core Advisory Hours: 09:00 - 18:00 (GMT)</p>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <main className={styles.formCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Secure Inquiry Form</h3>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name / Organization *</label>
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
                  <label className={styles.label}>Corporate Email *</label>
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
                  <label className={styles.label}>Phone Number</label>
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
                  <label className={styles.label}>Secure Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.textarea}
                    placeholder="Detail your request or inquiry mandate..."
                    id="contact-message"
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className={styles.submitBtn} id="contact-btn">
                  {submitting ? 'Transmitting...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </main>
        </div>

        {/* Global Offices Section */}
        <section className={styles.officesSection}>
          <h2 className={styles.officesTitle}>Global Office Network</h2>
          
          <div className={styles.officesGrid}>
            {/* London HQ */}
            <div className={styles.officeCard}>
              <div className={styles.officeHeader}>
                <h4 className={styles.officeName}>London (Global HQ)</h4>
                <address className={styles.officeAddress}>
                  One Canada Square, Canary Wharf,<br />
                  London E14 5AB, United Kingdom
                </address>
                <div className={styles.officeContact}>
                  <span>📞 Phone: +44 20 7183 0199</span>
                  <span>✉️ Email: london@luxestatenetwork.com</span>
                </div>
              </div>
              <div className={styles.officeMap}>
                <iframe
                  title="London HQ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5404245942426!2d-0.0211181!3d51.5048455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9e6ff1b31%3A0x8bb57f2df4cf1cb7!2sOne%20Canada%20Square!5e0!3m2!1sen!2s!4v1717830000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Istanbul Branch */}
            <div className={styles.officeCard}>
              <div className={styles.officeHeader}>
                <h4 className={styles.officeName}>Istanbul Regional Office</h4>
                <address className={styles.officeAddress}>
                  Nurol Tower, İzzet Paşa Mahallesi,<br />
                  Yeni Yol Cd. No:3, 34387 Şişli / Istanbul, Turkey
                </address>
                <div className={styles.officeContact}>
                  <span>📞 Phone: +90 212 555 0199</span>
                  <span>✉️ Email: istanbul@luxestatenetwork.com</span>
                </div>
              </div>
              <div className={styles.officeMap}>
                <iframe
                  title="Istanbul Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2045558914616!2d28.9863483!3d41.0645607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab6e382d61993%3A0x67efcd9c464c8dcf!2sNurol%20Tower!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Dubai Branch */}
            <div className={styles.officeCard}>
              <div className={styles.officeHeader}>
                <h4 className={styles.officeName}>Dubai MEASA Hub</h4>
                <address className={styles.officeAddress}>
                  Al Sufouh - Dubai Internet City,<br />
                  Dubai, United Arab Emirates
                </address>
                <div className={styles.officeContact}>
                  <span>📞 Phone: +971 4 455 0199</span>
                  <span>✉️ Email: dubai@luxestatenetwork.com</span>
                </div>
              </div>
              <div className={styles.officeMap}>
                <iframe
                  title="Dubai Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.56846985448!2d55.1539203!3d25.1011116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b67fd5ab01d%3A0x7d90c9b0cf7bc5!2sDubai%20Internet%20City!5e0!3m2!1sen!2s!4v1717830100000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Miami Branch */}
            <div className={styles.officeCard}>
              <div className={styles.officeHeader}>
                <h4 className={styles.officeName}>Miami Americas Hub</h4>
                <address className={styles.officeAddress}>
                  1111 Brickell Ave,<br />
                  Miami, FL 33131, USA
                </address>
                <div className={styles.officeContact}>
                  <span>📞 Phone: +1 305 555 0199</span>
                  <span>✉️ Email: miami@luxestatenetwork.com</span>
                </div>
              </div>
              <div className={styles.officeMap}>
                <iframe
                  title="Miami Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.1558296338424!2d-80.1930278!3d25.7654279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b68ff0df4dfd%3A0xbd86b16cc8c42a20!2s1111%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131%2C%20USA!5e0!3m2!1sen!2s!4v1717830200000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
