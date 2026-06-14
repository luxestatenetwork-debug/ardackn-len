import { create } from 'zustand';

export const useUiStore = create((set) => ({
  toasts: [],
  cookieConsent: false,
  aiAssistantOpen: false,

  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 5000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  setCookieConsent: (consent) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lux_cookie_consent', consent ? 'accepted' : 'declined');
    }
    set({ cookieConsent: consent });
  },

  initCookieConsent: () => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('lux_cookie_consent');
      set({ cookieConsent: consent === 'accepted' });
    }
  },

  setAiAssistantOpen: (open) => {
    set({ aiAssistantOpen: open });
  }
}));
