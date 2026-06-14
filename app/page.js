'use client';

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedOpportunities from '../components/home/FeaturedOpportunities';
import WhoUsesLen from '../components/home/WhoUsesLen';
import InvestorRequestBoard from '../components/InvestorRequestBoard';
import LiveCapitalDemand from '../components/LiveCapitalDemand';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      <HeroSection />
      <InvestorRequestBoard />
      <LiveCapitalDemand />
      <FeaturedOpportunities />
      <WhoUsesLen />
    </div>
  );
}

