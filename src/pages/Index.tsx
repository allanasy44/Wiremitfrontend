import { useEffect } from 'react';
import { useAppStore } from '@/store';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import { initializeMockData } from '@/lib/mockData';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '@/lib/constants';

const Index = () => {
  const { auth, setAuthenticated, setUser, setLoading } = useAppStore();

  useEffect(() => {
    // Initialize mock data for demo
    initializeMockData();
    
    // Check for existing session on app load
    const token = Cookies.get(STORAGE_KEYS.authToken);
    const storedUser = localStorage.getItem('wiremit_current_user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
        setAuthenticated(true);
      } catch (error) {
        console.error('Error restoring session:', error);
        Cookies.remove(STORAGE_KEYS.authToken);
        localStorage.removeItem('wiremit_current_user');
      }
    }
    
    setLoading(false);
  }, []);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md mx-auto mb-4">
            <span className="text-primary font-bold text-lg">W</span>
          </div>
          <h1 className="text-2xl font-bold">Loading Wiremit...</h1>
        </div>
      </div>
    );
  }

  return auth.isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export default Index;
