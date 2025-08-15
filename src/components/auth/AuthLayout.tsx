import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary font-bold text-lg">W</span>
            </div>
            <span className="text-white text-2xl font-bold">Wiremit</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-lg">{subtitle}</p>
          )}
        </div>
        
        <Card className="card-financial p-8 backdrop-blur-md bg-white/95">
          {children}
        </Card>
        
        <div className="text-center mt-6 text-white/70 text-sm">
          <p>Secure • Regulated • Trusted by 50,000+ families</p>
        </div>
      </div>
    </div>
  );
}