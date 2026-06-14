'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { useUiStore } from '../../../store/uiStore';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const { user, profile, loading: authLoading, updateProfileInfo, deleteAccount } = useAuthStore();
  const { addToast } = useUiStore();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Dosya boyutu 5MB\'dan küçük olmalıdır.', 'error');
      e.target.value = '';
      return;
    }

    // Sadece resim dosyası kontrolü
    if (!file.type.startsWith('image/')) {
      addToast('Lütfen bir resim dosyası seçin.', 'error');
      e.target.value = '';
      return;
    }

    setPhotoFile(file);
    // Önizleme oluştur
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      addToast('İsim boş bırakılamaz.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfileInfo(displayName.trim(), photoFile);
      addToast('Profil başarıyla güncellendi! ✅', 'success');
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error('Settings update error:', err);
      addToast(err.message || 'Profil güncellenirken hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmText === 'DELETE') {
      setDeleting(true);
      try {
        await deleteAccount();
        addToast('Hesap kalıcı olarak silindi.', 'success');
        router.push('/');
      } catch (err) {
        addToast(err.message || 'Hesap silinirken hata oluştu.', 'error');
        setDeleting(false);
        setShowModal(false);
      }
    } else {
      addToast('Onaylamak için DELETE yazın.', 'error');
    }
  };

  if (authLoading || !user) {
    return <div className={styles.loading}>Yetkilendirme yükleniyor...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <Link href="/dashboard" className={styles.backBtn}>Back to Dashboard</Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
          <form onSubmit={handleUpdate} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name / Corporation</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={styles.input}
                placeholder="Adınızı girin"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Update Profile Photo</label>
              
              {/* Mevcut veya önizleme fotoğrafı */}
              {(photoPreview || profile?.photoURL) && (
                <div className={styles.currentPhoto}>
                  <img
                    src={photoPreview || profile.photoURL}
                    alt="Profile"
                    className={styles.avatar}
                  />
                  {photoPreview && (
                    <span className={styles.previewBadge}>Yeni fotoğraf (henüz kaydedilmedi)</span>
                  )}
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handlePhotoChange}
                className={styles.input}
                id="photoInput"
              />
              <p className={styles.hint}>Maksimum 5MB — JPG, PNG, WebP veya GIF</p>
            </div>
            <button type="submit" disabled={saving} className={styles.saveBtn}>
              {saving ? (
                <span>
                  <span className={styles.spinner}></span>
                  {photoFile ? 'Fotoğraf yükleniyor...' : 'Kaydediliyor...'}
                </span>
              ) : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerText}>
            Deleting your account is permanent. All your data, including active placements, will be removed.
          </p>
          <button onClick={() => setShowModal(true)} disabled={deleting} className={styles.deleteBtn}>
            {deleting ? 'Deleting...' : 'Delete Account Permanently'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Confirm Account Deletion</h3>
            <p className={styles.modalText}>
              This action cannot be undone. To proceed, please type <strong>DELETE</strong> below.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className={styles.modalInput}
              placeholder="DELETE"
            />
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={confirmDelete} className={styles.confirmDeleteBtn}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
