import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  const getAuthContent = () => {
    switch (mode) {
      case 'login':
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in to your account to continue sending money',
          component: (
            <LoginForm
              onSwitchToRegister={() => setMode('register')}
              onForgotPassword={() => setMode('forgot-password')}
            />
          ),
        };
      case 'register':
        return {
          title: 'Create Account',
          subtitle: 'Join thousands of families sending money globally',
          component: (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          ),
        };
      case 'forgot-password':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your email to receive reset instructions',
          component: (
            <div className="text-center p-8">
              <p>Forgot password form coming soon...</p>
              <button
                onClick={() => setMode('login')}
                className="text-primary hover:text-primary-hover mt-4"
              >
                Back to login
              </button>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const content = getAuthContent();
  if (!content) return null;

  return (
    <AuthLayout title={content.title} subtitle={content.subtitle}>
      {content.component}
    </AuthLayout>
  );
}