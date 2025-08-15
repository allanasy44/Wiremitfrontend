// API service layer with comprehensive error handling and caching

import { API_ENDPOINTS, STORAGE_KEYS } from '../lib/constants';
import type { APIResponse, ExchangeRate, Transaction, User, Advertisement } from '../types';
import Cookies from 'js-cookie';

class APIService {
  private baseURL = '';
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  constructor() {
    // Initialize request interceptors
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Add default headers and auth token to requests
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  private defaultHeaders: Record<string, string> = {};

  private getAuthHeaders(): Record<string, string> {
    const token = Cookies.get(STORAGE_KEYS.authToken);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheTTL?: number
  ): Promise<APIResponse<T>> {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (cacheTTL && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const result: APIResponse<T> = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };

      // Cache successful responses
      if (cacheTTL) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTTL,
        });
      }

      return result;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Exchange Rates API
  async getExchangeRates(): Promise<APIResponse<ExchangeRate>> {
    try {
      const response = await this.makeRequest<any[]>(
        API_ENDPOINTS.exchangeRates,
        { method: 'GET' },
        5 * 60 * 1000 // Cache for 5 minutes
      );

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch exchange rates');
      }

      // Transform the API response to our expected format
      const rates: ExchangeRate = {
        USD: 1, // Base currency
        GBP: 0.74,
        ZAR: 17.75,
        USDT: 1,
      };

      // Extract rates from the API response
      response.data.forEach((item: any) => {
        Object.keys(item).forEach(currency => {
          if (currency in rates) {
            (rates as any)[currency] = item[currency];
          }
        });
      });

      return {
        success: true,
        data: rates,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Exchange rates error:', error);
      return {
        success: false,
        error: {
          code: 'EXCHANGE_RATES_ERROR',
          message: 'Failed to fetch current exchange rates',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Mock Authentication API
  async login(email: string, password: string): Promise<APIResponse<{ user: User; sessionToken: string; refreshToken: string }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - in production, this would be server-side
    const mockUsers = JSON.parse(localStorage.getItem('wiremit_users') || '[]');
    const user = mockUsers.find((u: any) => u.email === email);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'No account found with this email address',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // In production, you'd verify the password hash
    if (user.password !== password) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const sessionToken = this.generateToken();
    const refreshToken = this.generateToken();

      // Update last login and store current user
      user.lastLoginAt = new Date().toISOString();
      localStorage.setItem('wiremit_users', JSON.stringify(mockUsers));
      localStorage.setItem('wiremit_current_user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled,
        tier: user.tier,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      }));

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
          mfaEnabled: user.mfaEnabled,
          tier: user.tier,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
        sessionToken,
        refreshToken,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<APIResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUsers = JSON.parse(localStorage.getItem('wiremit_users') || '[]');
    
    // Check if user already exists
    if (mockUsers.some((u: any) => u.email === userData.email)) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const newUser: User = {
      id: this.generateId(),
      email: userData.email,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      isVerified: false,
      mfaEnabled: false,
      tier: 'basic',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push({
      ...newUser,
      password: userData.password, // In production, this would be hashed
    });
    localStorage.setItem('wiremit_users', JSON.stringify(mockUsers));

    return {
      success: true,
      data: newUser,
      timestamp: new Date().toISOString(),
    };
  }

  // Mock Transaction API
  async createTransaction(transactionData: any): Promise<APIResponse<Transaction>> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transaction: Transaction = {
      id: this.generateId(),
      userId: transactionData.userId,
      recipientName: transactionData.recipientName,
      recipientEmail: transactionData.recipientEmail,
      recipientPhone: transactionData.recipientPhone,
      destinationCountry: transactionData.destinationCountry,
      currency: transactionData.currency,
      sourceAmount: transactionData.sourceAmount,
      exchangeRate: transactionData.exchangeRate,
      fee: transactionData.fee,
      finalAmount: transactionData.finalAmount,
      status: 'pending',
      memo: transactionData.memo,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for demo
    const transactions = JSON.parse(localStorage.getItem('wiremit_transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('wiremit_transactions', JSON.stringify(transactions));

    // Simulate status progression
    setTimeout(() => this.updateTransactionStatus(transaction.id, 'processing'), 3000);
    setTimeout(() => this.updateTransactionStatus(transaction.id, 'completed'), 8000);

    return {
      success: true,
      data: transaction,
      timestamp: new Date().toISOString(),
    };
  }

  async getTransactions(userId: string): Promise<APIResponse<Transaction[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const allTransactions = JSON.parse(localStorage.getItem('wiremit_transactions') || '[]');
    const userTransactions = allTransactions.filter((t: Transaction) => t.userId === userId);

    return {
      success: true,
      data: userTransactions,
      timestamp: new Date().toISOString(),
    };
  }

  private async updateTransactionStatus(id: string, status: Transaction['status']) {
    const transactions = JSON.parse(localStorage.getItem('wiremit_transactions') || '[]');
    const index = transactions.findIndex((t: Transaction) => t.id === id);
    
    if (index !== -1) {
      transactions[index].status = status;
      if (status === 'completed') {
        transactions[index].completedAt = new Date().toISOString();
      }
      localStorage.setItem('wiremit_transactions', JSON.stringify(transactions));
    }
  }

  // Mock Advertisements API
  async getAdvertisements(): Promise<APIResponse<Advertisement[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockAds: Advertisement[] = [
      {
        id: '1',
        title: 'Send Money to SA - Zero Fees!',
        description: 'Limited time offer: Send money to South Africa with no transfer fees for new customers.',
        imageUrl: '/api/placeholder/400/200',
        ctaText: 'Learn More',
        ctaUrl: '/promotions/zero-fees',
        isActive: true,
        priority: 1,
      },
      {
        id: '2',
        title: 'Refer Friends, Earn Rewards',
        description: 'Get $10 for every friend you refer who makes their first transfer.',
        imageUrl: '/api/placeholder/400/200',
        ctaText: 'Refer Now',
        ctaUrl: '/referrals',
        isActive: true,
        priority: 2,
      },
      {
        id: '3',
        title: 'Mobile App Coming Soon',
        description: 'Get ready for our new mobile app with biometric authentication and instant notifications.',
        imageUrl: '/api/placeholder/400/200',
        ctaText: 'Get Notified',
        ctaUrl: '/mobile-app',
        isActive: true,
        priority: 3,
      },
    ];

    return {
      success: true,
      data: mockAds,
      timestamp: new Date().toISOString(),
    };
  }

  // Utility methods
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache info for debugging
  getCacheInfo(): Array<{ key: string; age: number; size: number }> {
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      size: JSON.stringify(value.data).length,
    }));
  }
}

export const apiService = new APIService();