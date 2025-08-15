import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { validateEmail } from '@/lib/utils/security';
import { checkRateLimit } from '@/lib/utils/security';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, setLoading, auth } = useAppStore();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check rate limiting
    const rateLimit = checkRateLimit('login', 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      toast({
        variant: 'destructive',
        title: 'Too many attempts',
        description: `Please wait ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes before trying again.`,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(formData.email, formData.password);

      if (response.success && response.data) {
        login(response.data.user, response.data.sessionToken, response.data.refreshToken);
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
      } else {
        setErrors({ 
          general: response.error?.message || 'Login failed. Please try again.' 
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
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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
        {errors.password && (
          <p className="text-sm text-destructive animate-slide-down">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => handleChange('rememberMe', !!checked)}
            disabled={auth.isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary-hover transition-colors"
          disabled={auth.isLoading}
        >
          Forgot password?
        </button>
      </div>

      <Button 
        type="submit" 
        className="btn-financial w-full py-3 text-lg"
        disabled={auth.isLoading}
      >
        {auth.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary-hover font-medium transition-colors"
            disabled={auth.isLoading}
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
}