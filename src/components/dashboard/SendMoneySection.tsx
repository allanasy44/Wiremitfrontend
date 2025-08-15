import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Send, ArrowRight, AlertCircle, CheckCircle, 
  Calculator, Clock, Shield, Loader2 
} from 'lucide-react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { 
  calculateFee, 
  calculateFinalAmount, 
  formatCurrency, 
  validateTransactionAmount,
  parseAmount 
} from '@/lib/utils/financial';
import { COUNTRIES } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';

export default function SendMoneySection() {
  const { 
    auth, 
    exchangeRates, 
    addTransaction, 
    setExchangeRates,
    transactions 
  } = useAppStore();
  
  const [formData, setFormData] = useState({
    amount: '',
    destinationCountry: '' as 'UK' | 'South Africa' | '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    memo: '',
  });
  
  const [calculatedValues, setCalculatedValues] = useState({
    fee: 0,
    exchangeRate: 0,
    finalAmount: 0,
    isCalculating: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  // Fetch exchange rates on mount
  useEffect(() => {
    if (!exchangeRates) {
      loadExchangeRates();
    }
  }, []);

  // Recalculate when amount or destination changes
  useEffect(() => {
    if (formData.amount && formData.destinationCountry && exchangeRates) {
      calculateTransaction();
    } else {
      setCalculatedValues({
        fee: 0,
        exchangeRate: 0,
        finalAmount: 0,
        isCalculating: false,
      });
      setShowCalculation(false);
    }
  }, [formData.amount, formData.destinationCountry, exchangeRates]);

  const loadExchangeRates = async () => {
    const response = await apiService.getExchangeRates();
    if (response.success && response.data) {
      setExchangeRates(response.data);
    }
  };

  const calculateTransaction = () => {
    const amountParsed = parseAmount(formData.amount);
    if (!amountParsed.isValid || !formData.destinationCountry || !exchangeRates) {
      return;
    }
    
    // Type guard to ensure destinationCountry is not empty string
    const destination = formData.destinationCountry as 'UK' | 'South Africa';
    if (!destination) return;

    setCalculatedValues(prev => ({ ...prev, isCalculating: true }));

    // Simulate calculation delay for UX
    setTimeout(() => {
      const amount = amountParsed.amount;
      const currency = COUNTRIES[destination].currency as 'GBP' | 'ZAR';
      const exchangeRate = exchangeRates[currency];
      const fee = calculateFee(amount, destination);
      const finalAmount = calculateFinalAmount(amount, exchangeRate, fee);

      setCalculatedValues({
        fee,
        exchangeRate,
        finalAmount,
        isCalculating: false,
      });
      setShowCalculation(true);
    }, 800);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate amount
    const amountValidation = parseAmount(formData.amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error!;
    } else {
      // Check limits - ensure minimum $1 and maximum based on user tier
      const userTransactions = transactions.filter(t => t.userId === auth.user?.id);
      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();
      
      const dailySpent = userTransactions
        .filter(t => new Date(t.createdAt).toDateString() === today)
        .reduce((sum, t) => sum + t.sourceAmount, 0);
      
      const monthlySpent = userTransactions
        .filter(t => new Date(t.createdAt).getMonth() === thisMonth)
        .reduce((sum, t) => sum + t.sourceAmount, 0);
      
      const limitValidation = validateTransactionAmount(
        amountValidation.amount, 
        auth.user, 
        dailySpent, 
        monthlySpent
      );
      
      if (!limitValidation.isValid) {
        newErrors.amount = limitValidation.error!;
      }
    }

    if (!formData.destinationCountry) {
      newErrors.destinationCountry = 'Please select a destination country';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (formData.recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !auth.user) return;

    setIsSubmitting(true);

    try {
      const amount = parseAmount(formData.amount).amount;
      const destination = formData.destinationCountry as 'UK' | 'South Africa';
      const currency = COUNTRIES[destination].currency;
      
      const transactionData = {
        userId: auth.user.id,
        recipientName: formData.recipientName.trim(),
        recipientEmail: formData.recipientEmail || undefined,
        recipientPhone: formData.recipientPhone || undefined,
        destinationCountry: destination,
        currency,
        sourceAmount: amount,
        exchangeRate: calculatedValues.exchangeRate,
        fee: calculatedValues.fee,
        finalAmount: calculatedValues.finalAmount,
        memo: formData.memo || undefined,
      };

      const response = await apiService.createTransaction(transactionData);

      if (response.success && response.data) {
        addTransaction(response.data);
        toast({
          title: 'Transfer initiated!',
          description: `Your transfer of ${formatCurrency(amount, 'USD')} is being processed.`,
        });
        
        // Reset form
        setFormData({
          amount: '',
          destinationCountry: '',
          recipientName: '',
          recipientEmail: '',
          recipientPhone: '',
          memo: '',
        });
        setShowCalculation(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Transfer failed',
          description: response.error?.message || 'Please try again.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network error',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Send Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount to Send (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground font-medium">$</span>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`input-financial pl-8 text-lg font-medium ${errors.amount ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Destination Country */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">
              Destination Country
            </Label>
            <Select
              value={formData.destinationCountry}
              onValueChange={(value) => handleChange('destinationCountry', value)}
            >
              <SelectTrigger className={`input-financial ${errors.destinationCountry ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UK">
                  <div className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>United Kingdom (GBP)</span>
                    <Badge variant="outline" className="ml-auto">10% fee</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="South Africa">
                  <div className="flex items-center gap-2">
                    <span>🇿🇦</span>
                    <span>South Africa (ZAR)</span>
                    <Badge variant="outline" className="ml-auto">20% fee</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.destinationCountry && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.destinationCountry}
              </p>
            )}
          </div>

          {/* Calculation Display */}
          {showCalculation && (
            <div className="animate-slide-up">
              <Card className="bg-gradient-to-r from-primary-light to-secondary-light border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">Transaction Summary</span>
                  </div>
                  
                  {calculatedValues.isCalculating ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculating best rates...
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount to send:</span>
                        <span className="font-medium">{formatCurrency(parseAmount(formData.amount).amount, 'USD')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transfer fee:</span>
                        <span className="font-medium text-destructive">
                          -{formatCurrency(calculatedValues.fee, 'USD')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exchange rate:</span>
                        <span className="font-medium">
                          1 USD = {calculatedValues.exchangeRate.toFixed(4)} {formData.destinationCountry && COUNTRIES[formData.destinationCountry as 'UK' | 'South Africa'].currency}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between items-center">
                        <span className="font-medium">Recipient gets:</span>
                        <span className="text-lg font-bold text-success">
                          {formatCurrency(calculatedValues.finalAmount, formData.destinationCountry && COUNTRIES[formData.destinationCountry as 'UK' | 'South Africa'].currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Arrives in {formData.destinationCountry && COUNTRIES[formData.destinationCountry as 'UK' | 'South Africa'].processingTime}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-sm font-medium">
                Recipient Name
              </Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Full name"
                value={formData.recipientName}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                className={`input-financial ${errors.recipientName ? 'border-destructive' : ''}`}
              />
              {errors.recipientName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.recipientName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-sm font-medium">
                Email <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@email.com"
                value={formData.recipientEmail}
                onChange={(e) => handleChange('recipientEmail', e.target.value)}
                className={`input-financial ${errors.recipientEmail ? 'border-destructive' : ''}`}
              />
              {errors.recipientEmail && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.recipientEmail}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientPhone" className="text-sm font-medium">
              Phone Number <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <PhoneInput
              id="recipientPhone"
              placeholder="Recipient's phone number"
              value={formData.recipientPhone}
              onChange={(value) => handleChange('recipientPhone', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo" className="text-sm font-medium">
              Purpose/Memo <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="memo"
              placeholder="e.g., Tuition fees, living expenses..."
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              className="input-financial resize-none"
              rows={3}
            />
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your transfer is protected by bank-level security and monitored for fraud prevention.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="btn-financial w-full py-3 text-lg"
            disabled={isSubmitting || !showCalculation}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                Send Money
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}