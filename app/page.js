'use client';

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedOpportunities from '../components/home/FeaturedOpportunities';
import WhoUsesLen from '../components/home/WhoUsesLen';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      <HeroSection />
      <FeaturedOpportunities />
      <WhoUsesLen />
    </div>
  );
}

