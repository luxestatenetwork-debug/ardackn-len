import ContactPageClient from './ContactPageClient';

export const metadata = {
  title: 'Contact Private Capital Office',
  description:
    'Communicate securely with the Lux Estate Network Private Capital Office. Connect with our managing directors for investment inquiries, listing partnerships, and institutional mandates.',
  alternates: { canonical: 'https://luxestatenetwork.com/contact' },
  openGraph: {
    title: 'Contact Private Capital Office | Lux Estate Network',
    description:
      'Reach our Private Capital Office for investment inquiries and partnership mandates. Global offices in London, Istanbul, Dubai, and Miami.',
    url: 'https://luxestatenetwork.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
