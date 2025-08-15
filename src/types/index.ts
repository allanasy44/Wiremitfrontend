// Comprehensive type definitions for Wiremit Financial App

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  isVerified: boolean;
  mfaEnabled: boolean;
  profileImage?: string;
  tier: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionToken?: string;
  refreshToken?: string;
  mfaPending: boolean;
  verificationStep: 'none' | 'email' | 'sms' | 'otp';
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  exchangeRate: number;
  lastUpdated: string;
}

export interface ExchangeRate {
  USD: number;
  GBP: number;
  ZAR: number;
  USDT: number;
}

export interface Transaction {
  id: string;
  userId: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  destinationCountry: 'UK' | 'South Africa';
  currency: 'GBP' | 'ZAR';
  sourceAmount: number;
  exchangeRate: number;
  fee: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  memo?: string;
  transactionHash?: string;
  estimatedArrival?: string;
  createdAt: string;
  completedAt?: string;
  receipt?: {
    id: string;
    downloadUrl: string;
  };
}

export interface TransactionTemplate {
  id: string;
  name: string;
  recipientName: string;
  destinationCountry: 'UK' | 'South Africa';
  currency: 'GBP' | 'ZAR';
  isDefault: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country: 'UK' | 'South Africa';
  preferredCurrency: 'GBP' | 'ZAR';
  accountDetails?: {
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
  };
  isActive: boolean;
  lastUsed?: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  priority: number;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  transactionLimits: {
    daily: number;
    monthly: number;
  };
  trustedDevices: string[];
  securityQuestions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface AppState {
  auth: AuthState;
  exchangeRates: ExchangeRate | null;
  ratesLastUpdated: string | null;
  transactions: Transaction[];
  recipients: Recipient[];
  advertisements: Advertisement[];
  isOnline: boolean;
  lastSyncTime: string | null;
}

export interface SendMoneyFormData {
  amount: number;
  destinationCountry: 'UK' | 'South Africa';
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  memo?: string;
  saveAsTemplate?: boolean;
  templateName?: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  transactionUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface TransactionFilters {
  status?: Transaction['status'][];
  currency?: ('GBP' | 'ZAR')[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface DashboardMetrics {
  totalSent: number;
  transactionCount: number;
  favoriteRecipient: string;
  averageTransactionAmount: number;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
  currencyBreakdown: Array<{
    currency: string;
    amount: number;
    percentage: number;
  }>;
}