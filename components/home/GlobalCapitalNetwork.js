'use client';

import React, { useState, useEffect } from 'react';
import styles from './GlobalCapitalNetwork.module.css';

// 9 Global Hubs
const HUBS = [
  {
    id: 'new-york',
    name: 'New York',
    x: 250,
    y: 180,
    timezoneOffset: -4, // EDT
    type: 'Venture Capital & Hedge Funds',
    focus: 'Institutional Assets & Private Equity',
    dealSize: '$150M+ Average',
    activeFlow: 'New York ➜ London',
  },
  {
    id: 'london',
    name: 'London',
    x: 480,
    y: 140,
    timezoneOffset: 1, // BST
    type: 'Private Equity & Sovereign Wealth',
    focus: 'Cross-Border Real Estate & Corporate Capital',
    dealSize: '$120M+ Average',
    activeFlow: 'London ➜ Dubai',
  },
  {
    id: 'zurich',
    name: 'Zurich',
    x: 505,
    y: 155,
    timezoneOffset: 2, // CEST
    type: 'Private Wealth Management',
    focus: 'Family Offices & Alternative Funds',
    dealSize: '$200M+ Average',
    activeFlow: 'Zurich ➜ Monaco',
  },
  {
    id: 'monaco',
    name: 'Monaco',
    x: 500,
    y: 170,
    timezoneOffset: 2, // CEST
    type: 'UHNW Asset Allocation',
    focus: 'Luxury Real Estate & Private Equity',
    dealSize: '$300M+ Average',
    activeFlow: 'Monaco ➜ Zurich',
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    x: 535,
    y: 175,
    timezoneOffset: 3, // TRT
    type: 'Real Estate & Infrastructure Capital',
    focus: 'Hospitality Assets & Strategic JV',
    dealSize: '$85M+ Average',
    activeFlow: 'Istanbul ➜ Riyadh',
  },
  {
    id: 'riyadh',
    name: 'Riyadh',
    x: 575,
    y: 225,
    timezoneOffset: 3, // AST
    type: 'Sovereign Wealth & Infrastructure',
    focus: 'Mega-Development Projects & Energy Assets',
    dealSize: '$500M+ Average',
    activeFlow: 'Riyadh ➜ Dubai',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    x: 595,
    y: 220,
    timezoneOffset: 4, // GST
    type: 'Family Office Hub & Sovereign Capital',
    focus: 'Global Commercial Assets & Private Equity',
    dealSize: '$250M+ Average',
    activeFlow: 'Dubai ➜ Singapore',
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    x: 755,
    y: 235,
    timezoneOffset: 8, // HKT
    type: 'Institutional Investment Hub',
    focus: 'Alternative Wealth & Global Real Estate',
    dealSize: '$180M+ Average',
    activeFlow: 'Hong Kong ➜ Singapore',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    x: 745,
    y: 300,
    timezoneOffset: 8, // SGT
    type: 'Asian Private Wealth & Family Offices',
    focus: 'Real Estate Portfolio & Venture Allocations',
    dealSize: '$220M+ Average',
    activeFlow: 'Singapore ➜ New York',
  },
];

// Connection Flows
const CONNECTIONS = [
  { from: 'new-york', to: 'london' },
  { from: 'london', to: 'dubai' },
  { from: 'zurich', to: 'monaco' },
  { from: 'monaco', to: 'zurich' },
  { from: 'istanbul', to: 'riyadh' },
  { from: 'riyadh', to: 'dubai' },
  { from: 'dubai', to: 'singapore' },
  { from: 'hong-kong', to: 'singapore' },
  { from: 'singapore', to: 'new-york' },
  { from: 'new-york', to: 'dubai' },
  { from: 'london', to: 'singapore' },
];

export default function GlobalCapitalNetwork() {
  const [activeHub, setActiveHub] = useState(HUBS.find(h => h.id === 'london'));
  const [timeStrings, setTimeStrings] = useState({});

  // Calculate local times for all hubs
  useEffect(() => {
    const updateTimes = () => {
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const newTimes = {};
      HUBS.forEach(hub => {
        const nd = new Date(utc + (3600000 * hub.timezoneOffset));
        newTimes[hub.id] = nd.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      });
      setTimeStrings(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Curve generator for connecting paths
  const getCurvePath = (fromId, toId) => {
    const fromHub = HUBS.find(h => h.id === fromId);
    const toHub = HUBS.find(h => h.id === toId);
    if (!fromHub || !toHub) return '';

    const startX = fromHub.x;
    const startY = fromHub.y;
    const endX = toHub.x;
    const endY = toHub.y;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    // Arch upward based on horizontal distance
    const archFactor = 0.18;
    const controlX = midX;
    const controlY = midY - (Math.abs(startX - endX) * archFactor);

    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  };

  const handleHubSelect = (hub) => {
    setActiveHub(hub);
    
    // Autofocus scrolling for mobile selector chips
    if (typeof document !== 'undefined') {
      const activeEl = document.getElementById(`chip-${hub.id}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <section className={styles.section} id="global-capital-network">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.tag}>GLOBAL NETWORK</div>
          <h2 className={styles.title} id="network-title">GLOBAL CAPITAL NETWORK</h2>
          <p className={styles.subtitle} id="network-subtitle">
            Connecting investors and premium opportunities across the world's leading financial hubs.
          </p>
        </div>

        {/* Map Layout */}
        <div className={styles.mapWrapper}>
          {/* Map Area */}
          <div className={styles.mapArea}>
            <div className={styles.mapBg}></div>

            {/* Dashboard Legend */}
            <div className={styles.mapLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendActiveFlow}></span>
                <span>Active Capital Flow</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendVerifiedNode}></span>
                <span>Verified Hub Node</span>
              </div>
            </div>

            {/* SVG Interactive Layer */}
            <svg viewBox="0 0 1000 500" className={styles.svgOverlay}>
              {/* Connection Lines */}
              <g id="connections-group">
                {CONNECTIONS.map((conn, idx) => {
                  const isActive = activeHub && (conn.from === activeHub.id || conn.to === activeHub.id);
                  return (
                    <path
                      key={idx}
                      d={getCurvePath(conn.from, conn.to)}
                      className={`${styles.connectionLine} ${isActive ? styles.connectionLineActive : ''}`}
                    />
                  );
                })}
              </g>

              {/* City Dots & Pulses */}
              <g id="hubs-group">
                {HUBS.map(hub => {
                  const isActive = activeHub && activeHub.id === hub.id;
                  return (
                    <g 
                      key={hub.id} 
                      className={styles.hubNode}
                      onClick={() => handleHubSelect(hub)}
                      onMouseEnter={() => handleHubSelect(hub)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulsing Outer Ring */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isActive ? 14 : 7}
                        className={`${styles.nodePulse} ${isActive ? styles.nodePulseActive : ''}`}
                      />
                      {/* Glowing Core Dot */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isActive ? 6 : 4}
                        className={`${styles.nodeCore} ${isActive ? styles.nodeCoreActive : ''}`}
                      />
                      {/* City Text Label */}
                      <text
                        x={hub.x}
                        y={hub.y - 12}
                        textAnchor="middle"
                        className={`${styles.cityLabel} ${isActive ? styles.cityLabelActive : ''}`}
                      >
                        {hub.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Hub Stats Detail Panel */}
          {activeHub && (
            <div className={styles.detailCard} id="hub-detail-card">
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.hubName}>{activeHub.name}</h3>
                  <span className={styles.hubType}>{activeHub.type}</span>
                </div>
                <div className={styles.timeBadge}>
                  <span className={styles.timeLabel}>YEREL SAAT</span>
                  <span className={styles.timeValue}>{timeStrings[activeHub.id] || '--:--'}</span>
                </div>
              </div>

              <div className={styles.cardDivider}></div>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Focus:</span>
                  <span className={styles.metaValue}>{activeHub.focus}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Average Capital Placement:</span>
                  <span className={styles.metaValueHighlight}>{activeHub.dealSize}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Active Corridor Flow:</span>
                  <span className={styles.metaValueGold}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                      <path d="M2 12h20M12 2v20" />
                    </svg>
                    {activeHub.activeFlow}
                  </span>
                </div>
              </div>

              <div className={styles.cardDivider}></div>

              <button className={styles.connectBtn} onClick={() => alert(`${activeHub.name} Yatırım Ağına Bağlanılıyor...`)}>
                CONNECT TO HUB
              </button>
            </div>
          )}
        </div>

        {/* Mobile Friendly Interactive Hub Selector */}
        <div className={styles.mobileSelector}>
          <span className={styles.selectorHint}>TAP A Hub to Highlight:</span>
          <div className={styles.mobileChips}>
            {HUBS.map(hub => {
              const isActive = activeHub && activeHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  id={`chip-${hub.id}`}
                  className={`${styles.mobileChip} ${isActive ? styles.mobileChipActive : ''}`}
                  onClick={() => handleHubSelect(hub)}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
