import React from 'react';
import styles from './Testimonials.module.css';

const TESTIMONIALS_DATA = [
  {
    quote: "Lux Estate Network has completely replaced our reliance on traditional brokers. The capability to screen private equity and luxury developments within a single secure portal is unprecedented.",
    author: "Alastair Sterling",
    role: "Managing Director, Sterling & Co. Family Office",
    location: "London, UK"
  },
  {
    quote: "We raised our Series B round within 40 days of deploying our listing slot here. The investors who contacted us were pre-vetted and understood our technology mandate instantly.",
    author: "Elena Rostova",
    role: "Founder & CEO, Quantum Cloud Computing",
    location: "Zurich, Switzerland"
  },
  {
    quote: "The AI semantic matching is incredibly advanced. It matches our investment mandates with precise yield proposals and highlights hidden variables automatically.",
    author: "Hassan Al-Mansoori",
    role: "Chief Investment Officer, Al-Mansoori Holdings",
    location: "Abu Dhabi, UAE"
  }
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="home-testimonials">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>CLIENT REVIEWS</span>
          <h2 className={styles.title}>
            TRUSTED BY <span className="gold-gradient-text">GLOBAL CAPITAL</span>
          </h2>
          <p className={styles.desc}>
            Hear from our elite community of family offices, venture capitals, and high-growth founders.
          </p>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div key={idx} className={styles.card}>
              <span className={styles.quoteIcon}>“</span>
              <blockquote className={styles.quote}>{t.quote}</blockquote>
              <div className={styles.meta}>
                <cite className={styles.author}>{t.author}</cite>
                <span className={styles.role}>{t.role}</span>
                <span className={styles.location}>{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
