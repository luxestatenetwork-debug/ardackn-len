'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUiStore } from '../../store/uiStore';
import Link from 'next/link';
import styles from './AIAssistantModal.module.css';

export default function AIAssistantModal() {
  const { aiAssistantOpen, setAiAssistantOpen } = useUiStore();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to the Lux Estate Network Private Capital Advisory. Describe your investment criteria, asset preferences, target yields, or region, and I will identify matching placements with detailed fit analysis.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if there's an initial query set by the homepage inline search
    if (aiAssistantOpen && typeof window !== 'undefined') {
      const initialQuery = window.sessionStorage.getItem('lux_initial_ai_query');
      if (initialQuery) {
        window.sessionStorage.removeItem('lux_initial_ai_query');
        handleSendQuery(initialQuery);
      }
    }
  }, [aiAssistantOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!queryText) setInputVal('');
    setLoading(true);

    try {
      // Connect to AI API endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { 
          sender: 'assistant', 
          text: data.reply,
          matches: data.matches // Option to display card previews
        }]);
      } else {
        setMessages((prev) => [...prev, { 
          sender: 'assistant', 
          text: 'I could not find matching placements based on that mandate. Please specify another category or target range.'
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { 
        sender: 'assistant', 
        text: 'Sorry, I encountered an advisory network error. Please try again shortly.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!aiAssistantOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setAiAssistantOpen(false)}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleInfo}>
            <span className={styles.pulse}></span>
            <h3 className={styles.title}>Lux AI Placement Advisor</h3>
          </div>
          <button onClick={() => setAiAssistantOpen(false)} className={styles.closeBtn}>×</button>
        </header>

        {/* Messages */}
        <div className={styles.messagesBox}>
          {messages.map((m, idx) => (
            <div key={idx} className={`${styles.msgRow} ${styles[m.sender]}`}>
              <div className={styles.bubble}>
                <p className={styles.msgText}>{m.text}</p>
                
                {/* Render match card attachments */}
                {m.matches && m.matches.length > 0 && (
                  <div className={styles.matchesGrid}>
                    <h4 className={styles.matchesTitle}>Identified Placements:</h4>
                    {m.matches.map((match) => (
                      <div key={match.id} className={styles.matchCard}>
                        <div className={styles.matchCardHeader}>
                          <span className={styles.matchName}>{match.title}</span>
                          <span className={styles.matchScore}>Fit: {Math.round(match.score * 100)}%</span>
                        </div>
                        <p className={styles.matchReason}>{match.reason}</p>
                        <Link 
                          href={`/listings/${match.id}`} 
                          onClick={() => setAiAssistantOpen(false)}
                          className={styles.viewLink}
                        >
                          View Placement dossier →
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
              <div className={styles.bubble}>
                <span className={styles.loader}>Analyzing opportunities...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <footer className={styles.footer}>
          <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className={styles.form}>
            <input
              type="text"
              placeholder="e.g. Find real estate in Turkey with yield > 7%"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className={styles.input}
              id="ai-panel-input"
            />
            <button type="submit" className={styles.sendBtn} id="ai-panel-btn">
              Consult
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
