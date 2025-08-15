import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SendMoneySection from '@/components/dashboard/SendMoneySection';
import AdCarousel from '@/components/ads/AdCarousel';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { formatCurrency } from '@/lib/utils/financial';

export default function Dashboard() {
  const { auth, setTransactions, setAdvertisements } = useAppStore();
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    if (!auth.user) return;
    
    // Load transactions and ads in parallel
    const [transactionsResponse, adsResponse] = await Promise.all([
      apiService.getTransactions(auth.user.id),
      apiService.getAdvertisements()
    ]);

    if (transactionsResponse.success) {
      setTransactions(transactionsResponse.data || []);
    }
    if (adsResponse.success) {
      setAdvertisements(adsResponse.data || []);
    }
  };

  // Mock transaction history for demo
  const mockTransactions = Array.from({ length: 15 }, (_, i) => ({
    id: `tx_${i + 1}`,
    recipientName: ['John Smith', 'Sarah Johnson', 'Michael Brown'][i % 3],
    amount: 50 + (i * 25),
    currency: ['GBP', 'ZAR'][i % 2] as 'GBP' | 'ZAR',
    status: ['completed', 'processing', 'pending'][i % 3] as 'completed' | 'processing' | 'pending',
    date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  }));

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Send Money Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SendMoneySection />
        </div>

        {/* Sidebar - Ads and Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sent</span>
                  <span className="font-semibold">{formatCurrency(2450, 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">{formatCurrency(450, 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Ads Carousel */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle>Special Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <AdCarousel />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="card-financial mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div>
                    <p className="font-medium text-sm">{tx.recipientName}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(tx.amount, tx.currency)}</p>
                  <Badge variant="outline" className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowAllTransactions(true)}
          >
            View All Transactions
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History Modal */}
      <TransactionHistory 
        isOpen={showAllTransactions} 
        onClose={() => setShowAllTransactions(false)} 
      />
    </DashboardLayout>
  );
}