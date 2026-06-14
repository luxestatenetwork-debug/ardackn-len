import React from 'react';

export default function CategoryIcon({ id, className = '' }) {
  const getIconSvg = () => {
    switch (id) {
      case 'luxury-real-estate':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-4a3 3 0 0 1 6 0v4M12 4v4M10 6h4" />
          </svg>
        );
      case 'commercial-real-estate':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V7l8-4v18M13 21V9l6 3v9M9 9h2M9 13h2M9 17h2" />
          </svg>
        );
      case 'hotels-resorts':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h6M9 13h6M10 17v4h4v-4" />
            <path d="M12 6v.01" />
          </svg>
        );
      case 'land-banking':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15" />
          </svg>
        );
      case 'private-equity':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            <path d="M15 8h4v4" />
          </svg>
        );
      case 'startups':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5C4 22 6 21 7.5 19.5" />
            <path d="M12 12l9-9-3 12-6 3-3-3-3-6z" />
            <path d="M9 15l3-3" />
            <circle cx="14" cy="10" r="1" />
          </svg>
        );
      case 'angel-investments':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8a2.5 2.5 0 0 1 5 0c0 2.5-2.5 5-5 7-2.5-2-5-4.5-5-7a2.5 2.5 0 0 1 5 0z" />
          </svg>
        );
      case 'venture-capital':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case 'luxury-cars':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10l-1.3-1.4C14.3 8.2 13.7 8 13 8H6c-.7 0-1.3.2-1.7.6L3 10s-2.7.6-4.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
            <path d="M9 17h6" />
          </svg>
        );
      case 'franchises':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10" />
            <path d="M12 2v7" />
          </svg>
        );
      case 'business-acquisitions':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5M8 21H3v-5M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M7.5 10.5l4 4 5-5" />
          </svg>
        );
      case 'luxury-yachts':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 14.5l3-3h12l5 3v3H2v-3z" />
            <path d="M6 11.5l1.5-3.5h7.5l2.5 3.5" />
            <path d="M9 8V5h3v3" />
            <path d="M1 18s4 2 11 2 11-2 11-2" />
          </svg>
        );
      case 'marine-investments':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3" />
            <line x1="12" y1="8" x2="12" y2="22" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
          </svg>
        );
      case 'infrastructure':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21v-8a9 9 0 0 1 18 0v8M12 3v10M3 13h18M6 8V6M18 8V6" />
          </svg>
        );
      case 'renewable-energy':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case 'technology':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
          </svg>
        );
      case 'healthcare':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        );
      case 'agriculture':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22c1.25-5 5.5-8 10-8s8.75 3 10 8M12 2v12M12 6c-2-1.5-4-1.5-6 0M12 10c2-1.5 4-1.5 6 0" />
          </svg>
        );
      case 'industrial-projects':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20h20M17 18h2M12 18h2M7 18h2M19 11l-3 3v6h6v-9zM10 8l-3 3v9h9v-12zM2 14v6h5v-6z" />
          </svg>
        );
      case 'tourism-projects':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 6-3 10-6 18h12c-3-8-6-12-6-18z" />
            <path d="M12 6s3-2 7-1M12 9s-3-2-7-1M12 12s4-1 6 2M12 14s-4-1-6 2" />
          </svg>
        );
      case 'mining':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2.5l7 7M21.5 2.5l-7 7M18 6l-13 13M3.5 20.5l-1-1" />
          </svg>
        );
      case 'international-funds':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
          </svg>
        );
      case 'family-office':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M9 10v11M15 10v11M19 10v11" />
          </svg>
        );
      case 'consultancy':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'golden-visa':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 7h8M8 11h6M8 15h4" />
          </svg>
        );
      case 'investment-law':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="20" />
            <line x1="5" y1="7" x2="19" y2="7" />
            <path d="M5 7l3 6M19 7l-3 6" />
            <path d="M8 13a4 4 0 0 0 8 0H8zM4 20h16" />
          </svg>
        );
      case 'contracting':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 22V12h4v10" />
            <path d="M2 10l10-8 10 8v12H2V10z" />
            <path d="M6 6V3h4v2" />
          </svg>
        );
      case 'architecture':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-8 16M12 3l8 16M12 3v4M4.5 17h15M12 7c-1.5 0-3 1.5-3 3M12 7c1.5 0 3 1.5 3 3" />
          </svg>
        );
      case 'interior-architecture':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 10V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5" />
            <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
            <path d="M3 14h18M6 18v3M18 18v3" />
          </svg>
        );
      case 'general-architecture':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5M12 22V12" />
          </svg>
        );
      case 'investment-advisory':
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10M18 20V4M6 20v-4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
    }
  };

  return (
    <span className={`${className} custom-category-icon`}>
      {getIconSvg()}
    </span>
  );
}
