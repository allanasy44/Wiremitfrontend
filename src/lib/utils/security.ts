// Security utilities and validation

import { VALIDATION_RULES } from '../constants';

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.password;
  
  if (password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters`);
  }
  
  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (rules.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (rules.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const cleaned = phone.replace(/[^\d+]/g, '');
  const rules = VALIDATION_RULES.phone;
  
  if (cleaned.length < rules.minLength) {
    return { isValid: false, error: `Phone number must be at least ${rules.minLength} digits` };
  }
  
  if (cleaned.length > rules.maxLength) {
    return { isValid: false, error: `Phone number cannot exceed ${rules.maxLength} digits` };
  }
  
  // Basic international format validation
  if (!cleaned.startsWith('+') && !cleaned.startsWith('0')) {
    return { isValid: false, error: 'Phone number must start with + or 0' };
  }
  
  return { isValid: true };
}

/**
 * Generate secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Simple hash function for client-side password hashing (demo purposes)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'wiremit_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Generate OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return otp;
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"&]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    });
}

/**
 * Check if session is expired
 */
export function isSessionExpired(timestamp: number, sessionTimeout: number): boolean {
  return Date.now() - timestamp > sessionTimeout;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length === 32;
}

/**
 * Rate limiting check (client-side)
 */
export function checkRateLimit(
  key: string, 
  attempts: number, 
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const storageKey = `rate_limit_${key}`;
  const now = Date.now();
  
  const stored = localStorage.getItem(storageKey);
  let data = stored ? JSON.parse(stored) : { count: 0, resetTime: now + windowMs };
  
  // Reset if window has expired
  if (now >= data.resetTime) {
    data = { count: 0, resetTime: now + windowMs };
  }
  
  const allowed = data.count < attempts;
  
  if (allowed) {
    data.count++;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  
  return {
    allowed,
    remaining: Math.max(0, attempts - data.count),
    resetTime: data.resetTime,
  };
}

/**
 * Detect suspicious activity patterns
 */
export function detectSuspiciousActivity(
  recentTransactions: Array<{ amount: number; timestamp: string }>
): { isSuspicious: boolean; reason?: string } {
  // Multiple large transactions in short time
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
  const recentLarge = recentTransactions.filter(
    t => new Date(t.timestamp).getTime() > last24Hours && t.amount > 1000
  );
  
  if (recentLarge.length >= 3) {
    return { isSuspicious: true, reason: 'Multiple large transactions in 24 hours' };
  }
  
  // Rapid succession of transactions
  const lastHour = Date.now() - 60 * 60 * 1000;
  const recentCount = recentTransactions.filter(
    t => new Date(t.timestamp).getTime() > lastHour
  ).length;
  
  if (recentCount >= 5) {
    return { isSuspicious: true, reason: 'Too many transactions in the last hour' };
  }
  
  return { isSuspicious: false };
}