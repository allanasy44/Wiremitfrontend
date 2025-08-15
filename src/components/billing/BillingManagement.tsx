import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, Download, Star, Check, Clock, AlertCircle, 
  TrendingUp, DollarSign, Calendar, FileText 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/financial';
import { useToast } from '@/hooks/use-toast';

interface BillingManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  fee: number;
  reference: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  amount: number;
  currency: string;
  nextBilling: string;
  features: string[];
}

export default function BillingManagement({ isOpen, onClose }: BillingManagementProps) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, ...updates } : tx
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateSubscription = (updates: Partial<Subscription>) => {
    setSubscription(prev => prev ? { ...prev, ...updates } : null);
  };

  useEffect(() => {
    // Mock billing data
    const mockTransactions: Transaction[] = [
      {
        id: 'tx_001',
        date: '2024-01-15',
        description: 'Money transfer to John Smith',
        amount: 250.00,
        currency: 'USD',
        status: 'completed',
        fee: 5.00,
        reference: 'WMT_250_001',
      },
      {
        id: 'tx_002',
        date: '2024-01-14',
        description: 'Exchange rate conversion fee',
        amount: 12.50,
        currency: 'USD',
        status: 'completed',
        fee: 0.00,
        reference: 'FEE_001',
      },
      {
        id: 'tx_003',
        date: '2024-01-12',
        description: 'Premium subscription',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        fee: 0.00,
        reference: 'SUB_001',
      },
      {
        id: 'tx_004',
        date: '2024-01-10',
        description: 'Money transfer to Sarah Johnson',
        amount: 150.00,
        currency: 'USD',
        status: 'pending',
        fee: 3.00,
        reference: 'WMT_150_002',
      },
    ];

    const mockSubscription: Subscription = {
      id: 'sub_001',
      plan: 'Premium',
      status: 'active',
      amount: 29.99,
      currency: 'USD',
      nextBilling: '2024-02-15',
      features: [
        'Reduced transfer fees',
        'Priority customer support',
        'Advanced analytics',
        'Higher transfer limits',
        'Multi-currency wallets',
      ],
    };

    setTransactions(mockTransactions);
    setSubscription(mockSubscription);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
      case 'cancelled':
      case 'expired':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const downloadInvoice = (transactionId: string) => {
    toast({
      title: 'Invoice Downloaded',
      description: `Invoice for transaction ${transactionId} has been downloaded.`,
    });
  };

  const upgradePlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Plan Upgrade',
        description: 'Redirecting to upgrade options...',
      });
    }, 1000);
  };

  const cancelSubscription = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (subscription) {
        setSubscription({
          ...subscription,
          status: 'cancelled',
        });
      }
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled. You can reactivate anytime.',
        variant: 'destructive',
      });
    }, 1000);
  };

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount + t.fee, 0);

  const thisMonthSpent = transactions
    .filter(t => t.status === 'completed' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount + t.fee, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Billing & Subscriptions</h2>
              </div>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalSpent, 'USD')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">{formatCurrency(thisMonthSpent, 'USD')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="text-2xl font-bold">{subscription?.plan || 'Basic'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="transactions" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="transactions" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">{transaction.description}</TableCell>
                              <TableCell>{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
                              <TableCell>{formatCurrency(transaction.fee, transaction.currency)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(transaction.status)}>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => downloadInvoice(transaction.id)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscription" className="m-0">
                  {subscription ? (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-secondary" />
                            Current Subscription
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{subscription.plan} Plan</h3>
                              <p className="text-2xl font-bold text-primary mb-4">
                                {formatCurrency(subscription.amount, subscription.currency)}/month
                              </p>
                              <Badge className={getStatusColor(subscription.status)}>
                                {subscription.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-2">
                                Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Plan Features</h4>
                              <ul className="space-y-2">
                                {subscription.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success" />
                                    <span className="text-sm">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <Button onClick={upgradePlan} disabled={isLoading}>
                              {isLoading ? 'Processing...' : 'Upgrade Plan'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={cancelSubscription}
                              disabled={isLoading || subscription.status === 'cancelled'}
                            >
                              Cancel Subscription
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Available Plans */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Available Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Basic', 'Premium', 'Enterprise'].map((plan) => (
                              <Card key={plan} className={`border-2 ${subscription.plan === plan ? 'border-primary' : 'border-muted'}`}>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-lg">{plan}</h3>
                                  <p className="text-2xl font-bold mt-2">
                                    {plan === 'Basic' ? 'Free' : plan === 'Premium' ? '$29.99' : '$99.99'}
                                    {plan !== 'Basic' && <span className="text-sm font-normal">/month</span>}
                                  </p>
                                  <Button 
                                    className="w-full mt-4" 
                                    variant={subscription.plan === plan ? "secondary" : "default"}
                                    disabled={subscription.plan === plan}
                                  >
                                    {subscription.plan === plan ? 'Current Plan' : 'Select Plan'}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p>No active subscription</p>
                        <Button className="mt-4" onClick={upgradePlan}>
                          Choose a Plan
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="invoices" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Invoices & Receipts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {transactions.filter(t => t.status === 'completed').map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()} • {transaction.reference}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">
                                {formatCurrency(transaction.amount + transaction.fee, transaction.currency)}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadInvoice(transaction.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}