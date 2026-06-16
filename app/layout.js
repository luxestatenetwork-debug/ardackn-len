import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CookieBanner from '../components/layout/CookieBanner';
import Toast from '../components/ui/Toast';
import AIAssistantModal from '../components/home/AIAssistantModal';

export const metadata = {
  metadataBase: new URL('https://luxestatenetwork.com'),
  title: {
    default: 'Lux Estate Network | Global Private Capital & Luxury Investments',
    template: '%s | Lux Estate Network',
  },
  description:
    'Connect with family offices, VCs, luxury property developers, startups, and elite opportunities globally. A premium private marketplace for verified investors and exceptional investment opportunities.',
  keywords:
    'luxury real estate, private equity, family office investments, startup funding, venture capital, high net worth marketplace, institutional investor network, global capital',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://luxestatenetwork.com',
  },
  openGraph: {
    title: 'Lux Estate Network | Global Private Capital & Luxury Investments',
    description:
      'The global marketplace connecting family offices, venture capital firms, and high-net-worth investors with elite verified opportunities.',
    type: 'website',
    url: 'https://luxestatenetwork.com',
    siteName: 'Lux Estate Network',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Lux Estate Network — Global Private Investment Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Estate Network | Premium Investment Marketplace',
    description:
      'Connecting global investors with private banking opportunities, luxury listings, and venture capital.',
    images: [
      'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&h=630',
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* JSON-LD: Financial Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: 'Lux Estate Network',
              description:
                'Premium global marketplace for venture capital, private equity, real estate, and high-value investments.',
              url: 'https://luxestatenetwork.com',
              logo: 'https://luxestatenetwork.com/logo.png',
              priceRange: '$$$$',
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'One Canada Square, Canary Wharf',
                  addressLocality: 'London',
                  postalCode: 'E14 5AB',
                  addressCountry: 'GB',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: "Nurol Tower, Yeni Yol Cd. No:3, 34387 Şişli",
                  addressLocality: 'Istanbul',
                  addressCountry: 'TR',
                },
              ],
              sameAs: ['https://www.linkedin.com/company/lux-estate-network'],
              areaServed: 'Worldwide',
            }),
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
