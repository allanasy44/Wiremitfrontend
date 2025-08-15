import { ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, LogOut, Settings, User, CreditCard, 
  Menu, X, Shield, HelpCircle 
} from 'lucide-react';
import { useAppStore } from '@/store';
import { useState } from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import ProfileManagement from '@/components/profile/ProfileManagement';
import BillingManagement from '@/components/billing/BillingManagement';
import SettingsSupport from '@/components/settings/SettingsSupport';
import LogoutConfirmation from '@/components/common/LogoutConfirmation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { auth, logout, transactions } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = auth.user;
  const unreadNotifications = transactions.filter(t => t.status === 'completed').length;

  useEffect(() => {
    // Close mobile menu when switching to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-gradient-to-r from-secondary to-secondary-hover';
      case 'enterprise': return 'bg-gradient-to-r from-african to-african-light';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold text-foreground">Wiremit</span>
              </div>
              <Badge className={`hidden sm:inline-flex text-xs ${getTierBadgeColor(user.tier)}`}>
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{unreadNotifications}</span>
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge className={`text-xs ${getTierBadgeColor(user.tier)}`}>
                          {user.tier}
                        </Badge>
                        {user.isVerified && (
                          <Badge variant="outline" className="text-xs text-success border-success">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowBilling(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSupport(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSupport(true)}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-md animate-slide-down">
              <div className="px-4 py-4 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowProfile(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowBilling(true)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowSupport(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setShowSupport(true)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Modals */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <ProfileManagement 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      <BillingManagement 
        isOpen={showBilling} 
        onClose={() => setShowBilling(false)} 
      />
      <SettingsSupport 
        isOpen={showSupport} 
        onClose={() => setShowSupport(false)} 
      />
      <LogoutConfirmation 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </div>
  );
}