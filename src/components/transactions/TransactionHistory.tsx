import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Filter, Search, Download, Eye, RefreshCw, Calendar,
  TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft,
  Clock, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/financial';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { Transaction as StoreTransaction } from '@/types';

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DisplayTransaction {
  id: string;
  type: 'send' | 'receive' | 'fee' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled';
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  description: string;
  timestamp: Date;
  exchangeRate?: number;
  fee: number;
  reference: string;
  destinationCountry?: string;
  paymentMethod?: string;
}

export default function TransactionHistory({ isOpen, onClose }: TransactionHistoryProps) {
  const { auth, getTransactionHistory } = useAppStore();
  const { toast } = useToast();
  const [mockTransactions, setMockTransactions] = useState<DisplayTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<DisplayTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convert store transactions to display format and combine with mock ones
  const storeTransactions = getTransactionHistory().map((tx: StoreTransaction): DisplayTransaction => ({
    id: tx.id,
    type: 'send',
    amount: tx.sourceAmount,
    currency: tx.currency,
    status: tx.status,
    recipientName: tx.recipientName,
    recipientEmail: tx.recipientEmail,
    description: `Money transfer to ${tx.recipientName}`,
    timestamp: new Date(tx.createdAt),
    exchangeRate: tx.exchangeRate,
    fee: tx.fee,
    reference: tx.transactionHash || `WMT_${tx.id.slice(-6).toUpperCase()}`
  }));
  const allTransactions = [...storeTransactions, ...mockTransactions];

  useEffect(() => {
    loadMockTransactions();
    
    // Real-time updates simulation
    const interval = setInterval(() => {
      updateTransactionStatuses();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [allTransactions, searchQuery, statusFilter, typeFilter]);

  const loadMockTransactions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTxs: DisplayTransaction[] = Array.from({ length: 15 }, (_, i) => {
        const types: DisplayTransaction['type'][] = ['send', 'receive', 'fee', 'refund'];
        const statuses: DisplayTransaction['status'][] = ['completed', 'processing', 'pending', 'failed', 'cancelled'];
        const currencies = ['USD', 'GBP', 'ZAR'];
        
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const currency = currencies[Math.floor(Math.random() * currencies.length)];
        const amount = Math.floor(Math.random() * 1000) + 50;
        
        return {
          id: `mock_tx_${i + 1}`,
          type,
          amount,
          currency,
          status,
          recipientName: type === 'send' ? ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson'][Math.floor(Math.random() * 4)] : undefined,
          recipientEmail: type === 'send' ? 'recipient@example.com' : undefined,
          senderName: type === 'receive' ? ['Alice Cooper', 'Bob Johnson', 'Carol White'][Math.floor(Math.random() * 3)] : undefined,
          description: type === 'send' ? 'Money transfer' : 
                      type === 'receive' ? 'Received payment' :
                      type === 'fee' ? 'Transaction fee' : 'Refund processed',
          timestamp: new Date(Date.now() - ((i + 5) * 24 * 60 * 60 * 1000) - Math.random() * 24 * 60 * 60 * 1000),
          exchangeRate: currency !== 'USD' ? (currency === 'GBP' ? 0.74 : 17.75) : undefined,
          fee: type === 'send' ? amount * (currency === 'GBP' ? 0.1 : 0.2) : 0,
          reference: `WMT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          destinationCountry: type === 'send' ? (currency === 'GBP' ? 'United Kingdom' : 'South Africa') : undefined,
          paymentMethod: ['Bank Transfer', 'Card', 'Mobile Money'][Math.floor(Math.random() * 3)],
        };
      });

      setMockTransactions(mockTxs);
    } catch (error) {
      toast({
        title: 'Error Loading Transactions',
        description: 'Failed to load transaction history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransactionStatuses = () => {
    setMockTransactions(prev => prev.map(transaction => {
      if (transaction.status === 'processing' && Math.random() > 0.7) {
        return { ...transaction, status: 'completed' as const };
      }
      if (transaction.status === 'pending' && Math.random() > 0.8) {
        return { ...transaction, status: 'processing' as const };
      }
      return transaction;
    }));
  };

  const filterTransactions = () => {
    let filtered = allTransactions;

    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const exportTransactions = () => {
    // Simulate CSV export
    const csvContent = [
      'Date,Type,Description,Amount,Currency,Status,Reference',
      ...filteredTransactions.map(tx => 
        `${tx.timestamp.toLocaleDateString()},${tx.type},${tx.description},${tx.amount},${tx.currency},${tx.status},${tx.reference}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Transaction history has been exported to CSV.',
    });
  };

  const getStatusIcon = (status: DisplayTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: DisplayTransaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'fee':
        return <DollarSign className="h-4 w-4 text-warning" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-primary" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DisplayTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning';
      case 'pending':
        return 'bg-muted text-muted-foreground border-muted';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'cancelled':
        return 'bg-muted text-muted-foreground border-muted';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: allTransactions.length,
    completed: allTransactions.filter(tx => tx.status === 'completed').length,
    pending: allTransactions.filter(tx => tx.status === 'pending' || tx.status === 'processing').length,
    totalSent: allTransactions
      .filter(tx => tx.type === 'send' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Transaction History</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={exportTransactions}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" onClick={onClose}>×</Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sent</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.totalSent, 'USD')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="send">Sent</SelectItem>
                  <SelectItem value="receive">Received</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={loadMockTransactions} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background border-b">
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : paginatedTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">No transactions found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {transaction.timestamp.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.timestamp.toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.recipientName && (
                              <p className="text-sm text-muted-foreground">
                                To: {transaction.recipientName}
                              </p>
                            )}
                            {transaction.senderName && (
                              <p className="text-sm text-muted-foreground">
                                From: {transaction.senderName}
                              </p>
                            )}
                            {transaction.destinationCountry && (
                              <p className="text-xs text-muted-foreground">
                                {transaction.destinationCountry}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={`font-semibold ${
                              transaction.type === 'send' || transaction.type === 'fee' 
                                ? 'text-destructive' 
                                : 'text-success'
                            }`}>
                              {transaction.type === 'send' || transaction.type === 'fee' ? '-' : '+'}
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                            {transaction.fee > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Fee: {formatCurrency(transaction.fee, transaction.currency)}
                              </p>
                            )}
                            {transaction.exchangeRate && (
                              <p className="text-xs text-muted-foreground">
                                Rate: {transaction.exchangeRate}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              <span className="capitalize">{transaction.status}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {transaction.reference}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}