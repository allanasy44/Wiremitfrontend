import { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LogOut, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmation({ isOpen, onClose, onConfirm }: LogoutConfirmationProps) {
  const { auth } = useAppStore();
  const { toast } = useToast();
  const [rememberChoice, setRememberChoice] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Simulate logout process with delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (rememberChoice) {
        localStorage.setItem('wiremit_skip_logout_confirmation', 'true');
      }
      
      toast({
        title: 'Logged Out Successfully',
        description: 'You have been securely logged out of your account.',
      });
      
      onConfirm();
    } catch (error) {
      toast({
        title: 'Logout Error',
        description: 'An error occurred while logging out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    setRememberChoice(false);
    onClose();
  };

  // Check if user has chosen to skip confirmation
  const skipConfirmation = localStorage.getItem('wiremit_skip_logout_confirmation') === 'true';
  
  if (skipConfirmation) {
    // Auto-logout without confirmation
    setTimeout(() => onConfirm(), 0);
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">
                Confirm Logout
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {auth.user?.name || 'User'}
              </p>
            </div>
          </div>
          
          <AlertDialogDescription className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Security Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    Logging out will clear your session and require re-authentication for security.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Session Status</h4>
                  <p className="text-xs text-muted-foreground">
                    Any ongoing transactions will remain safe and can be accessed after re-login.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Important</h4>
                  <p className="text-xs text-muted-foreground">
                    Make sure you've saved any important information before logging out.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm">
              Are you sure you want to log out of your Wiremit account?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col gap-4">
          <div className="flex items-center space-x-2 self-start">
            <Checkbox 
              id="remember-choice"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <label 
              htmlFor="remember-choice" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't ask me again on this device
            </label>
          </div>
          
          <div className="flex gap-3 w-full">
            <AlertDialogCancel 
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Stay Logged In
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="flex-1 bg-destructive hover:bg-destructive/90"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging Out...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </div>
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}