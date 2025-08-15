// Zustand store for global state management

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, User, Transaction, ExchangeRate, Advertisement, Recipient } from '../types';
import { STORAGE_KEYS } from '../lib/constants';
import Cookies from 'js-cookie';

interface AppStore extends AppState {
  // Auth actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMfaPending: (pending: boolean) => void;
  setVerificationStep: (step: AppState['auth']['verificationStep']) => void;
  login: (user: User, sessionToken: string, refreshToken: string) => void;
  logout: () => void;
  
  // Exchange rates actions
  setExchangeRates: (rates: ExchangeRate) => void;
  
  // Transactions actions
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  
  // Recipients actions
  addRecipient: (recipient: Recipient) => void;
  updateRecipient: (id: string, updates: Partial<Recipient>) => void;
  removeRecipient: (id: string) => void;
  setRecipients: (recipients: Recipient[]) => void;
  
  // Advertisements actions
  setAdvertisements: (ads: Advertisement[]) => void;
  
  // System actions
  setOnlineStatus: (online: boolean) => void;
  updateLastSync: () => void;
  
  // Profile actions
  updateProfile: (updates: Partial<User>) => void;
  
  // Notification actions
  addNotification: (notification: any) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Computed values
  getUser: () => User | null;
  isAuthenticated: () => boolean;
  getCurrentExchangeRates: () => ExchangeRate | null;
  getTransactionHistory: () => Transaction[];
  getActiveRecipients: () => Recipient[];
  getUnreadNotificationCount: () => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        sessionToken: undefined,
        refreshToken: undefined,
        mfaPending: false,
        verificationStep: 'none',
      },
      exchangeRates: null,
      ratesLastUpdated: null,
      transactions: [],
      recipients: [],
      advertisements: [],
      isOnline: navigator.onLine,
      lastSyncTime: null,

      // Auth actions
      setUser: (user) => set((state) => ({
        auth: { ...state.auth, user }
      })),
      
      setAuthenticated: (authenticated) => set((state) => ({
        auth: { ...state.auth, isAuthenticated: authenticated }
      })),
      
      setLoading: (loading) => set((state) => ({
        auth: { ...state.auth, isLoading: loading }
      })),
      
      setMfaPending: (pending) => set((state) => ({
        auth: { ...state.auth, mfaPending: pending }
      })),
      
      setVerificationStep: (step) => set((state) => ({
        auth: { ...state.auth, verificationStep: step }
      })),
      
      login: (user, sessionToken, refreshToken) => {
        // Store tokens securely
        Cookies.set(STORAGE_KEYS.authToken, sessionToken, { 
          expires: 7, 
          secure: true, 
          sameSite: 'strict' 
        });
        Cookies.set(STORAGE_KEYS.refreshToken, refreshToken, { 
          expires: 30, 
          secure: true, 
          sameSite: 'strict' 
        });
        
        set((state) => ({
          auth: {
            ...state.auth,
            user,
            isAuthenticated: true,
            sessionToken,
            refreshToken,
            mfaPending: false,
            verificationStep: 'none',
          }
        }));
      },
      
      logout: () => {
        // Clear all tokens and data
        Cookies.remove(STORAGE_KEYS.authToken);
        Cookies.remove(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.sessionData);
        
        set((state) => ({
          auth: {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            sessionToken: undefined,
            refreshToken: undefined,
            mfaPending: false,
            verificationStep: 'none',
          },
          transactions: [],
          recipients: [],
        }));
      },

      // Exchange rates actions
      setExchangeRates: (rates) => set({
        exchangeRates: rates,
        ratesLastUpdated: new Date().toISOString(),
      }),

      // Transaction actions
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      })),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        ),
      })),
      
      setTransactions: (transactions) => set({ transactions }),

      // Recipients actions
      addRecipient: (recipient) => set((state) => ({
        recipients: [...state.recipients, recipient],
      })),
      
      updateRecipient: (id, updates) => set((state) => ({
        recipients: state.recipients.map(r => 
          r.id === id ? { ...r, ...updates } : r
        ),
      })),
      
      removeRecipient: (id) => set((state) => ({
        recipients: state.recipients.filter(r => r.id !== id),
      })),
      
      setRecipients: (recipients) => set({ recipients }),

      // Advertisement actions
      setAdvertisements: (advertisements) => set({ advertisements }),

      // System actions
      setOnlineStatus: (online) => set({ isOnline: online }),
      
      updateLastSync: () => set({ lastSyncTime: new Date().toISOString() }),

      // Profile actions
      updateProfile: (updates) => set((state) => ({
        auth: {
          ...state.auth,
          user: state.auth.user ? { ...state.auth.user, ...updates } : null
        }
      })),

      // Notification actions
      addNotification: (notification) => {
        // This would be implemented if we had a notifications array in state
      },
      
      markNotificationAsRead: (id) => {
        // This would be implemented if we had a notifications array in state
      },

      // Computed values
      getUser: () => get().auth.user,
      isAuthenticated: () => get().auth.isAuthenticated,
      getCurrentExchangeRates: () => get().exchangeRates,
      getTransactionHistory: () => get().transactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      getActiveRecipients: () => get().recipients.filter(r => r.isActive),
      getUnreadNotificationCount: () => {
        const completedTransactions = get().transactions.filter(t => t.status === 'completed');
        return completedTransactions.length;
      },
    }),
    {
      name: 'wiremit-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        exchangeRates: state.exchangeRates,
        ratesLastUpdated: state.ratesLastUpdated,
        lastSyncTime: state.lastSyncTime,
        // Note: sensitive data like tokens are stored in secure cookies
      }),
    }
  )
);

// Initialize online status listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useAppStore.getState().setOnlineStatus(true));
  window.addEventListener('offline', () => useAppStore.getState().setOnlineStatus(false));
}