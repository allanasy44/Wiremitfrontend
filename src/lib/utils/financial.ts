// Financial calculations and utilities

import { COUNTRIES, CURRENCIES, TRANSACTION_LIMITS } from '../constants';
import type { Currency, User } from '../../types';

/**
 * Calculate transaction fee based on destination country
 */
export function calculateFee(amount: number, destinationCountry: 'UK' | 'South Africa'): number {
  // 10% fee for GBP (UK), 20% fee for ZAR (South Africa) as per requirements
  const feePercentage = destinationCountry === 'UK' ? 10 : 20;
  return Math.ceil((amount * feePercentage) / 100 * 100) / 100; // Round up to 2 decimal places
}

/**
 * Calculate final amount recipient will receive
 */
export function calculateFinalAmount(
  sourceAmount: number, 
  exchangeRate: number, 
  fee: number
): number {
  const amountAfterFee = sourceAmount - fee;
  return Math.ceil(amountAfterFee * exchangeRate * 100) / 100; // Round up to 2 decimal places
}

/**
 * Format currency amount with appropriate symbol
 */
export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
  const symbol = currencyInfo?.symbol || currency;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ZAR' ? 'ZAR' : currency === 'GBP' ? 'GBP' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(/[A-Z]{3}/, symbol);
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Validate transaction amount against user limits
 */
export function validateTransactionAmount(
  amount: number, 
  user: User | null,
  dailySpent: number = 0,
  monthlySpent: number = 0
): { isValid: boolean; error?: string } {
  if (!user) {
    return { isValid: false, error: 'User not authenticated' };
  }

  const limits = TRANSACTION_LIMITS[user.tier];
  
  if (amount < limits.perTransaction.min) {
    return { 
      isValid: false, 
      error: `Minimum transfer amount is ${formatCurrency(limits.perTransaction.min, 'USD')}` 
    };
  }
  
  if (amount > limits.perTransaction.max) {
    return { 
      isValid: false, 
      error: `Maximum transfer amount is ${formatCurrency(limits.perTransaction.max, 'USD')}` 
    };
  }
  
  if (dailySpent + amount > limits.daily) {
    return { 
      isValid: false, 
      error: `Daily limit of ${formatCurrency(limits.daily, 'USD')} would be exceeded` 
    };
  }
  
  if (monthlySpent + amount > limits.monthly) {
    return { 
      isValid: false, 
      error: `Monthly limit of ${formatCurrency(limits.monthly, 'USD')} would be exceeded` 
    };
  }
  
  return { isValid: true };
}

/**
 * Calculate exchange rate with spread
 */
export function calculateExchangeRateWithSpread(
  baseRate: number, 
  spreadPercentage: number = 2
): number {
  return baseRate * (1 - spreadPercentage / 100);
}

/**
 * Generate transaction reference number
 */
export function generateTransactionRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `WMT${timestamp}${random}`.toUpperCase();
}

/**
 * Calculate processing time estimate
 */
export function getProcessingTimeEstimate(destinationCountry: 'UK' | 'South Africa'): string {
  return COUNTRIES[destinationCountry].processingTime;
}

/**
 * Check if transaction requires additional verification
 */
export function requiresEnhancedVerification(amount: number, user: User | null): boolean {
  if (!user) return true;
  
  // High-value transactions require additional verification
  if (amount >= 1000) return true;
  
  // New users require verification for any amount
  const accountAge = Date.now() - new Date(user.createdAt).getTime();
  const isNewUser = accountAge < 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return isNewUser && amount >= 100;
}

/**
 * Format percentage with proper rounding
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Calculate savings compared to traditional banking
 */
export function calculateSavings(amount: number, ourFee: number): number {
  const traditionalFee = amount * 0.15; // Assume 15% traditional fee
  return Math.max(0, traditionalFee - ourFee);
}

/**
 * Validate and parse amount input
 */
export function parseAmount(input: string): { amount: number; isValid: boolean; error?: string } {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const amount = parseFloat(cleaned);
  
  if (isNaN(amount)) {
    return { amount: 0, isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (amount <= 0) {
    return { amount: 0, isValid: false, error: 'Amount must be greater than zero' };
  }
  
  // Check for too many decimal places
  const decimalPlaces = (cleaned.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { amount: 0, isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  
  return { amount, isValid: true };
}