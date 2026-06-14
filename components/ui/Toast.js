'use client';

import React from 'react';
import { useUiStore } from '../../store/uiStore';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.closeBtn}>×</button>
        </div>
      ))}
    </div>
  );
}
