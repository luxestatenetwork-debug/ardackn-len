'use client';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { useListingStore } from '../../../store/listingStore';
import { useUiStore } from '../../../store/uiStore';
import { CATEGORIES_DATA } from '../../../components/home/CategoryGrid';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Create.module.css';

export default function CreateListingPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const { createListing } = useListingStore();
  const { addToast } = useUiStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES_DATA[0].id);
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [listingType, setListingType] = useState('sale');
  const [targetInvestment, setTargetInvestment] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!title || !price || !description || !contactPhone || !contactEmail || !city || !country) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    if (imageFiles.length === 0) {
      addToast('Please upload at least one image.', 'error');
      return;
    }
    
    if (!coverImageFile) {
      addToast('Please upload a cover image.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const listingData = {
        title,
        category,
        subCategory,
        price: parseFloat(price) || 0,
        currency,
        city,
        country,
        region,
        address,
        location: [city, region, country].filter(Boolean).join(', '),
        listingType,
        targetInvestment,
        videoUrl,
        contactPhone,
        contactEmail,
        description,
      };

      await createListing(listingData, user.uid, imageFiles, pdfFile, coverImageFile);
      addToast('Listing placement published successfully.', 'success');
      router.push('/dashboard');
    } catch (err) {
      if (err.message === 'limit_reached') {
        addToast('Annual listing limit reached. Purchase additional slots.', 'error');
      } else {
        addToast(err.message || 'Failed to create listing.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return <div className={styles.loading}>Loading authorization...</div>;
  }

  const purchased = profile?.slots_purchased || 0;
  const used      = profile?.slots_used || 0;
  const isPremium = profile?.isPremium || profile?.premium || false;
  const isAdmin   = profile?.role === 'admin';
  const isOwner   = profile?.role === 'owner';

  const baseGumroadUrl = 'https://luxestate3.gumroad.com/l/xhqsuf';
  const redirectParam = typeof window !== 'undefined' ? `&redirect_url=${encodeURIComponent(window.location.origin + '/payment-success')}` : '';
  const buySlotsUrl    = `${baseGumroadUrl}?userId=${user.uid}&email=${encodeURIComponent(user.email)}${redirectParam}`;

  // ── GATE 1: No payment yet (owner with zero purchased slots) ──────────────
  const hasNoPurchase = isOwner && !isPremium && purchased === 0;
  if (hasNoPurchase) {
    return (
      <div className={styles.limitWrapper}>
        <div className={styles.membershipGate}>
          <div className={styles.gateLogoRow}>
            <Image src="/images/logo.png" alt="Lux Estate Network" width={120} height={44} style={{ objectFit: 'contain' }} />
          </div>

          <div className={styles.gateBadge}>Complete Your Membership</div>
          <h2 className={styles.gateTitle}>Activate Your Listing Slots</h2>
          <p className={styles.gateText}>
            Your account is registered. To publish investment opportunities on the Lux Estate
            Network, purchase a one-time listing package to receive your slots.
          </p>

          <div className={styles.gateBenefits}>
            <div className={styles.gateBenefit}><span>✓</span> <strong>5 active listing slots</strong></div>
            <div className={styles.gateBenefit}><span>✓</span> Up to 30 images + video &amp; PDF per listing</div>
            <div className={styles.gateBenefit}><span>✓</span> Direct investor inquiries in inbox</div>
            <div className={styles.gateBenefit}><span>✓</span> Priority placement in search results</div>
            <div className={styles.gateBenefit}><span>✓</span> AI-powered investor matching engine</div>
            <div className={styles.gateBenefit}><span>✓</span> Global network visibility</div>
          </div>

          <div className={styles.gatePrice}>
            <span className={styles.gatePriceAmount}>$499</span>
            <span className={styles.gatePricePeriod}>per year · 5 listing slots · Platinum</span>
          </div>

          <div className={styles.limitActions}>
            <a
              href={buySlotsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyBtn}
              id="btn-complete-membership"
            >
              🏛 Purchase Listing Package
            </a>
            <button
              className={styles.refreshBtn}
              onClick={() => window.location.reload()}
            >
              ↻ I&apos;ve Paid — Refresh Status
            </button>
            <Link href="/dashboard" className={styles.backBtn}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── GATE 2: Slot limit reached ────────────────────────────────────────────
  const isLimitReached = !isAdmin && used >= (isPremium ? 5 : purchased);

  if (isLimitReached) {
    return (
      <div className={styles.limitWrapper}>
        <div className={styles.limitCard}>
          <h2 className={styles.limitTitle}>Annual Listing Limit Reached</h2>
          <p className={styles.limitText}>
            You have used all {purchased} of your purchased listing slots ({used} active/used). To publish more investment opportunities, please purchase additional listing packages.
          </p>
          <div className={styles.limitActions}>
            <a 
              href={buySlotsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.buyBtn}
              id="btn-limit-purchase"
            >
              Purchase Additional Listing Package
            </a>
            <Link href="/dashboard" className={styles.backBtn}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Publish Premium Placement</h1>
        <p className={styles.subtitle}>Draft and broadcast a new institutional/luxury proposal.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Title of Opportunity *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="e.g., Prime Luxury Resort Acquisition Opportunity"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Investment Sector *</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className={styles.select}
              >
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="consultancy">Consultancy Services</option>
                <option value="architecture">Architecture Services</option>
              </select>
            </div>

            {category === 'consultancy' && (
              <div className={styles.field}>
                <label className={styles.label}>Advisory Classification *</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select Sub-category</option>
                  <option value="golden-visa">Golden Visa</option>
                  <option value="investment-law">Investment Law</option>
                  <option value="investment-advisory">Investment Advisory</option>
                </select>
              </div>
            )}

            {category === 'architecture' && (
              <div className={styles.field}>
                <label className={styles.label}>Architecture Classification *</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select Sub-category</option>
                  <option value="interior-architecture">Interior Architecture</option>
                  <option value="general-architecture">General Architecture</option>
                </select>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Listing Type *</label>
              <select value={listingType} onChange={(e) => setListingType(e.target.value)} className={styles.select}>
                <option value="sale">Sale</option>
                <option value="lease">Lease</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div className={styles.priceRow}>
              <div className={styles.field} style={{ flex: 2 }}>
                <label className={styles.label}>Target Value / Price *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. 15000000"
                />
              </div>

              <div className={styles.field} style={{ flex: 1 }}>
                <label className={styles.label}>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={styles.select}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target Investment (Optional)</label>
              <input type="text" value={targetInvestment} onChange={(e) => setTargetInvestment(e.target.value)} className={styles.input} placeholder="e.g., 5-8% annual yield" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>City *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Country *</label>
              <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Region / State (Optional)</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className={styles.input} placeholder="e.g. California, Andalusia" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Address (Optional)</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.input} placeholder="e.g. 123 Luxury Way" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Video URL (Youtube/Vimeo)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={styles.input} placeholder="https://..." />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contact Phone *</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={styles.input}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contact Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={styles.input}
                placeholder="broker@luxury.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Listing Cover Image *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0])}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                {coverImageFile && <span className={styles.pdfSuccess}>✅ Selected</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Listing Gallery Images (Max 30) *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setImageFiles(prev => {
                    const combined = [...prev, ...newFiles];
                    if (combined.length > 30) {
                      addToast('Maximum 30 images allowed in total. Excess ignored.', 'error');
                      return combined.slice(0, 30);
                    }
                    return combined;
                  });
                  e.target.value = ''; // clear input so user can add more
                }}
                className={styles.input}
              />
              {imageFiles.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className={styles.previewContainer}>
                      <img src={URL.createObjectURL(file)} alt="preview" className={styles.imagePreview} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)} 
                        className={styles.removePreviewBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Prospectus / Details (PDF)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                {pdfFile && <span className={styles.pdfSuccess}>✅ Selected</span>}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Detailed Description &amp; Investor Mandate *</label>
            <textarea
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Outline the financial yields, structures, exit options, and IRR targets."
            ></textarea>
          </div>

          <button type="submit" disabled={submitting} className={styles.submitBtn}>
            {submitting ? 'Structuring Proposal...' : 'Publish to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
}
