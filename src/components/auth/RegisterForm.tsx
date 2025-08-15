import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, EyeOff, Mail, Lock, User, 
  AlertCircle, CheckCircle, Loader2 
} from 'lucide-react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { validateEmail, validatePassword, validatePhone } from '@/lib/utils/security';
import { toast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { setLoading, auth } = useAppStore();

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber) {
      const phoneValidation = validatePhone(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        newErrors.phoneNumber = phoneValidation.error!;
      }
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await apiService.register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
      });

      if (response.success) {
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to verify your account.',
        });
        onSwitchToLogin();
      } else {
        setErrors({ 
          general: response.error?.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength < 30) return 'bg-destructive';
    if (passwordStrength < 60) return 'bg-warning';
    if (passwordStrength < 80) return 'bg-primary';
    return 'bg-success';
  };

  const getPasswordStrengthText = (): string => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <Alert variant="destructive" className="animate-slide-down">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`input-financial pl-10 ${errors.name ? 'border-destructive' : ''}`}
            disabled={auth.isLoading}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive animate-slide-down">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`input-financial pl-10 ${errors.email ? 'border-destructive' : ''}`}
            disabled={auth.isLoading}
          />
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive animate-slide-down">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Phone Number <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <PhoneInput
          id="phoneNumber"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={(value) => handleChange('phoneNumber', value)}
          className={errors.phoneNumber ? 'border-destructive' : ''}
          disabled={auth.isLoading}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive animate-slide-down">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`input-financial pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
            disabled={auth.isLoading}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={auth.isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {formData.password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength >= 80 ? 'text-success' : 
                passwordStrength >= 60 ? 'text-primary' :
                passwordStrength >= 30 ? 'text-warning' : 'text-destructive'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <Progress 
              value={passwordStrength} 
              className={`h-2 ${getPasswordStrengthColor()}`}
            />
          </div>
        )}
        
        {errors.password && (
          <p className="text-sm text-destructive animate-slide-down">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`input-financial pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
            disabled={auth.isLoading}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={auth.isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-success" />
          )}
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive animate-slide-down">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleChange('agreeToTerms', !!checked)}
            disabled={auth.isLoading}
            className="mt-0.5"
          />
          <Label htmlFor="agreeToTerms" className="text-sm leading-5">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:text-primary-hover">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:text-primary-hover">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-destructive animate-slide-down">{errors.agreeToTerms}</p>
        )}

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToMarketing"
            checked={formData.agreeToMarketing}
            onCheckedChange={(checked) => handleChange('agreeToMarketing', !!checked)}
            disabled={auth.isLoading}
            className="mt-0.5"
          />
          <Label htmlFor="agreeToMarketing" className="text-sm leading-5 text-muted-foreground">
            I'd like to receive updates about new features and promotions
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="btn-financial w-full py-3 text-lg"
        disabled={auth.isLoading}
      >
        {auth.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary-hover font-medium transition-colors"
            disabled={auth.isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}