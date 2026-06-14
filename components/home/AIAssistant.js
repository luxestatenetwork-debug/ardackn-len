'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './AIAssistant.module.css';

/* ───────── Önerilen Sorular ───────── */
const SUGGESTED_QUESTIONS = [
  'Türkiye\'de yüksek getirili gayrimenkul fırsatları',
  'Avrupa\'da %8+ IRR altyapı yatırımları',
  'Lüks yat ve denizcilik varlıkları',
  'Yenilenebilir enerji projeleri',
  'Girişim sermayesi teknoloji fırsatları',
  'İş satın alma ve özel sermaye',
];

/* ───────── Kategori filtreleri ───────── */
const CATEGORY_FILTERS = [
  { id: 'all', label: 'Tümü', icon: '🌍' },
  { id: 'luxury-real-estate', label: 'Gayrimenkul', icon: '🏛️' },
  { id: 'business-acquisitions', label: 'İş Satın Alma', icon: '🏢' },
  { id: 'venture-capital', label: 'Girişim Sermayesi', icon: '🚀' },
  { id: 'luxury-yachts', label: 'Yatlar', icon: '🛥️' },
  { id: 'renewable-energy', label: 'Enerji', icon: '⚡' },
  { id: 'aviation', label: 'Havacılık', icon: '✈️' },
  { id: 'agriculture', label: 'Tarım', icon: '🌿' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Merhaba! Lux Estate AI Yatırım Danışmanına hoş geldiniz. Yatırım kriterlerinizi tanımlayın veya aşağıdaki filtrelerden seçim yapın. Size en uygun fırsatları bulacağım.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  /* ───── API'ye sorgu gönder ───── */
  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim()) return;

    setIsExpanded(true);
    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!queryText) setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.reply,
            matches: data.matches,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'Belirttiğiniz kriterlere uygun bir fırsat bulunamadı. Lütfen farklı parametreler deneyin.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ───── Kategori filtresi seç ───── */
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === 'all') return;
    const label = CATEGORY_FILTERS.find((f) => f.id === filterId)?.label || filterId;
    handleSendQuery(`${label} kategorisindeki yatırım fırsatlarını göster`);
  };

  /* ───── Önerilen soruya tıkla ───── */
  const handleSuggestionClick = (question) => {
    handleSendQuery(question);
  };

  /* ───── Form gönder ───── */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery();
  };

  return (
    <section className={styles.section} id="home-ai-assistant">
      {/* Arka plan animasyonu */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      <div className={styles.container}>
        {/* Başlık */}
        <div className={styles.header}>
          <span className={styles.badge}>
            <span className={styles.badgeDot}></span>
            YAPAY ZEKÂ DESTEKLİ
          </span>
          <h2 className={styles.title}>
            AKILLI YATIRIM{' '}
            <span className="gold-gradient-text">FİLTRELEME &amp; DANIŞMAN</span>
          </h2>
          <p className={styles.desc}>
            Yatırım kriterlerinizi doğal dilde tanımlayın, AI tüm fırsatları tarar ve
            size en yüksek uyum puanıyla eşleşen seçenekleri sunar.
          </p>
        </div>

        {/* Kategori filtreleri */}
        <div className={styles.filterBar}>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterChip} ${activeFilter === f.id ? styles.filterChipActive : ''}`}
              onClick={() => handleFilterClick(f.id)}
            >
              <span className={styles.filterIcon}>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Arama formu */}
        <form onSubmit={handleFormSubmit} className={styles.searchForm}>
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Yatırım kriterlerinizi yazın... (ör: Türkiye'de gayrimenkul, %7+ getiri)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className={styles.searchInput}
            id="ai-prompt-input"
          />
          <button type="submit" className={styles.searchBtn} id="ai-submit-btn" disabled={loading}>
            {loading ? (
              <span className={styles.spinnerSmall}></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4z"/>
                  <path d="m22 2-11 11"/>
                </svg>
                AI&apos;ya Sor
              </>
            )}
          </button>
        </form>

        {/* Önerilen sorular */}
        {!isExpanded && (
          <div className={styles.suggestions}>
            <span className={styles.sugLabel}>Popüler Sorular:</span>
            <div className={styles.sugChips}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className={styles.sugChip}
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sohbet alanı — sadece soru sorulduğunda genişler */}
        {isExpanded && (
          <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <span className={styles.chatPulse}></span>
                <span className={styles.chatTitle}>Lux AI Danışman</span>
              </div>
              <button
                className={styles.chatMinimize}
                onClick={() => setIsExpanded(false)}
              >
                Küçült ▾
              </button>
            </div>

            <div className={styles.messagesBox}>
              {messages.map((m, idx) => (
                <div key={idx} className={`${styles.msgRow} ${styles[m.sender]}`}>
                  <div className={styles.avatar}>
                    {m.sender === 'assistant' ? '🤖' : '👤'}
                  </div>
                  <div className={styles.bubble}>
                    <p className={styles.msgText}>{m.text}</p>

                    {/* Eşleşen fırsatlar kartları */}
                    {m.matches && m.matches.length > 0 && (
                      <div className={styles.matchesGrid}>
                        <h4 className={styles.matchesTitle}>
                          🎯 Tespit Edilen Fırsatlar:
                        </h4>
                        {m.matches.map((match) => (
                          <div key={match.id} className={styles.matchCard}>
                            <div className={styles.matchCardHeader}>
                              <span className={styles.matchName}>
                                {match.title}
                              </span>
                              <span className={styles.matchScore}>
                                Uyum: %{Math.round(match.score * 100)}
                              </span>
                            </div>
                            <p className={styles.matchReason}>{match.reason}</p>
                            <div className={styles.matchScoreBar}>
                              <div
                                className={styles.matchScoreFill}
                                style={{ width: `${Math.round(match.score * 100)}%` }}
                              ></div>
                            </div>
                            <Link
                              href={`/listings/${match.id}`}
                              className={styles.viewLink}
                            >
                              Detayları Görüntüle →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className={`${styles.msgRow} ${styles.assistant}`}>
                  <div className={styles.avatar}>🤖</div>
                  <div className={styles.bubble}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Panel içi girdi */}
            <div className={styles.chatFooter}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className={styles.chatForm}
              >
                <input
                  type="text"
                  placeholder="Ek soru sorun veya filtreyi daraltın..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className={styles.chatInput}
                  id="ai-panel-input"
                />
                <button type="submit" className={styles.chatSendBtn} id="ai-panel-btn" disabled={loading}>
                  Gönder
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
