'use client';

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedOpportunities from '../components/home/FeaturedOpportunities';
import WhoUsesLen from '../components/home/WhoUsesLen';
import InvestorRequestBoard from '../components/InvestorRequestBoard';
import LiveCapitalDemand from '../components/LiveCapitalDemand';
import GlobalCapitalNetwork from '../components/home/GlobalCapitalNetwork';
import TrustVerification from '../components/home/TrustVerification';
import FounderSection from '../components/home/FounderSection';
import MembershipSection from '../components/home/MembershipSection';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      <HeroSection />
      <InvestorRequestBoard />
      <LiveCapitalDemand />
      <FeaturedOpportunities />
      <GlobalCapitalNetwork />
      <TrustVerification />
      <FounderSection />
      <MembershipSection />
      <WhoUsesLen />
    </div>
  );
}
