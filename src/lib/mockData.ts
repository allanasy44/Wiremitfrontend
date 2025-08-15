// Mock data for development and testing

import type { Transaction, User } from '../types';

export const generateMockTransactions = (userId: string, count: number = 15): Transaction[] => {
  const mockTransactions: Transaction[] = [];
  const recipients = ['John Doe', 'Sarah Johnson', 'Mike Smith', 'Emma Wilson', 'David Brown', 'Lisa Davis'];
  const countries: Array<'UK' | 'South Africa'> = ['UK', 'South Africa'];
  const statuses: Array<Transaction['status']> = ['completed', 'pending', 'processing', 'completed', 'completed'];
  const purposes = ['Tuition fees', 'Living expenses', 'Medical bills', 'Family support', 'Education', 'Emergency aid'];

  for (let i = 0; i < count; i++) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const sourceAmount = Math.floor(Math.random() * 1000) + 50;
    const fee = randomCountry === 'UK' ? sourceAmount * 0.1 : sourceAmount * 0.2;
    const exchangeRate = randomCountry === 'UK' ? 0.74 : 17.75;
    const finalAmount = (sourceAmount - fee) * exchangeRate;
    
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    mockTransactions.push({
      id: `txn_${Date.now()}_${i}`,
      userId,
      recipientName: recipients[Math.floor(Math.random() * recipients.length)],
      recipientEmail: `recipient${i}@example.com`,
      recipientPhone: `+${Math.floor(Math.random() * 999999999999)}`,
      destinationCountry: randomCountry,
      currency: randomCountry === 'UK' ? 'GBP' : 'ZAR',
      sourceAmount,
      exchangeRate,
      fee,
      finalAmount: Math.ceil(finalAmount * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      memo: purposes[Math.floor(Math.random() * purposes.length)],
      createdAt: createdAt.toISOString(),
      completedAt: Math.random() > 0.3 ? createdAt.toISOString() : undefined,
    });
  }

  return mockTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user_demo_123', // Fixed ID for consistent demo experience
  email: 'john.doe@example.com',
  name: 'John Doe',
  phoneNumber: '+263 77 123 4567',
  isVerified: true,
  mfaEnabled: false,
  tier: 'basic',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  ...overrides,
});

// Initialize mock data in localStorage if not exists
export const initializeMockData = () => {
  const mockUser = createMockUser();
  
  if (!localStorage.getItem('wiremit_transactions')) {
    const mockTransactions = generateMockTransactions(mockUser.id);
    localStorage.setItem('wiremit_transactions', JSON.stringify(mockTransactions));
  }
  
  if (!localStorage.getItem('wiremit_users')) {
    localStorage.setItem('wiremit_users', JSON.stringify([{
      ...mockUser,
      password: 'password123' // For demo purposes
    }]));
  }
  
  // Always ensure current user is set for demo
  if (!localStorage.getItem('wiremit_current_user')) {
    localStorage.setItem('wiremit_current_user', JSON.stringify(mockUser));
  }
};