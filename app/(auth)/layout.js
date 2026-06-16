// Auth route-group layout — provides metadata for login & register without touching client pages

export const metadata = {
  robots: { index: false, follow: false }, // Don't index auth pages
  openGraph: {
    siteName: 'Lux Estate Network',
    type: 'website',
  },
};

export default function AuthLayout({ children }) {
  return children;
}
