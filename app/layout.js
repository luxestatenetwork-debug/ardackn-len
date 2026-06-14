import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CookieBanner from '../components/layout/CookieBanner';
import Toast from '../components/ui/Toast';
import AIAssistantModal from '../components/home/AIAssistantModal';

export const metadata = {
  title: 'Lux Estate Network | Global Private Capital & Luxury Investments',
  description: 'Connect with family offices, VCs, luxury property developers, startups, and elite opportunities globally. A premium marketplace for private banking and investments.',
  keywords: 'luxury real estate, private equity, family office investments, startup funding, venture capital, high net worth marketplace',
  openGraph: {
    title: 'Lux Estate Network | Global Private Capital & Luxury Investments',
    description: 'The global marketplace connecting family offices, venture capital firms, and high-net-worth investors with elite opportunities.',
    type: 'website',
    url: 'https://luxestatenetwork.com',
    siteName: 'Lux Estate Network',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Lux Estate Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Estate Network | Premium Investment Marketplace',
    description: 'Connecting global investors with private banking opportunities, luxury listings, and venture capital.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Schema Markup for Premium Investment Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              'name': 'Lux Estate Network',
              'description': 'Premium global marketplace for venture capital, private equity, real estate, and high-value investments.',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Nurol Tower, İzzet Paşa Mahallesi, Yeni Yol Cd. No:3, 34387 Şişli',
                'addressLocality': 'Istanbul',
                'addressCountry': 'Turkey'
              },
              'url': 'https://luxestatenetwork.com',
              'logo': 'https://luxestatenetwork.com/logo.png',
              'priceRange': '$$$$'
            })
          }}
        />
      </head>
      <body>
        <Toast />
        <AIAssistantModal />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
          {children}
        </main>
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}
