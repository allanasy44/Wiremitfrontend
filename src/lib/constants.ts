// Financial App Constants and Configuration

export const APP_CONFIG = {
  name: 'Wiremit',
  version: '2.0.0',
  description: 'Professional money transfer for Zimbabwean families',
  supportEmail: 'support@wiremit.com',
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  ZAR: { symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  USDT: { symbol: '₮', name: 'Tether USD', flag: '₮' },
} as const;

export const COUNTRIES = {
  UK: {
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    feePercentage: 10,
    processingTime: '1-2 business days',
  },
  'South Africa': {
    name: 'South Africa', 
    currency: 'ZAR',
    flag: '🇿🇦',
    feePercentage: 20,
    processingTime: '2-3 business days',
  },
} as const;

export const TRANSACTION_LIMITS = {
  basic: {
    daily: 1000,
    monthly: 10000,
    perTransaction: { min: 1, max: 500 }, // Minimum $1 as per requirements
  },
  premium: {
    daily: 5000,
    monthly: 50000,
    perTransaction: { min: 1, max: 2000 }, // Minimum $1 as per requirements
  },
  enterprise: {
    daily: 20000,
    monthly: 200000,
    perTransaction: { min: 1, max: 10000 }, // Minimum $1 as per requirements
  },
} as const;

export const TRANSACTION_STATUS = {
  pending: { color: 'warning', label: 'Pending' },
  processing: { color: 'primary', label: 'Processing' },
  completed: { color: 'success', label: 'Completed' },
  failed: { color: 'destructive', label: 'Failed' },
  cancelled: { color: 'muted', label: 'Cancelled' },
} as const;

export const API_ENDPOINTS = {
  exchangeRates: 'https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS',
  // Mock endpoints for development
  auth: '/api/auth',
  transactions: '/api/transactions',
  recipients: '/api/recipients',
  advertisements: '/api/advertisements',
} as const;

export const STORAGE_KEYS = {
  authToken: 'wiremit_auth_token',
  refreshToken: 'wiremit_refresh_token',
  userPreferences: 'wiremit_user_preferences',
  exchangeRates: 'wiremit_exchange_rates',
  lastSync: 'wiremit_last_sync',
  sessionData: 'wiremit_session_data',
} as const;

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  phone: {
    minLength: 10,
    maxLength: 15,
  },
  transaction: {
    memoMaxLength: 140,
    recipientNameMaxLength: 50,
  },
} as const;

export const FEATURE_FLAGS = {
  mfaEnabled: true,
  biometricAuth: false,
  realTimeNotifications: true,
  advancedAnalytics: true,
  cryptoPayments: false,
  recurringTransfers: false,
} as const;

export const RATE_LIMITS = {
  login: { attempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  sendMoney: { attempts: 10, windowMs: 60 * 60 * 1000 }, // 10 transfers per hour
  forgotPassword: { attempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
} as const;

export const SECURITY_CONFIG = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxDevices: 5,
  requireMfaForHighValue: 1000, // USD threshold
} as const;