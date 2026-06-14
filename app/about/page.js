import React from 'react';
import AboutPageClient from './AboutPageClient';

// Premium Institutional SEO Metadata
export const metadata = {
  title: 'About Lux Estate Network | Private Global Investment Network',
  description: 'Lux Estate Network is a private global investment platform connecting qualified investors, family offices, venture capital firms, and entrepreneurs with curated international opportunities.',
  keywords: 'About Lux Estate Network, Private Capital Network, Family Office Investments, Venture Capital Directory, Luxury Investments, Institutional Real Estate',
  openGraph: {
    title: 'About Lux Estate Network | Private Global Investment Network',
    description: 'Connecting global capital with exceptional investment opportunities in real estate, private equity, startups, and infrastructure.',
    type: 'website',
    url: 'https://luxestatenetwork.com/about',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'About Lux Estate Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Lux Estate Network | Private Global Investment Network',
    description: 'Connecting global capital with exceptional investment opportunities.',
  },
};

export default function AboutPage() {
  return (
    <main id="about-us-page">
      <AboutPageClient />
    </main>
  );
}
