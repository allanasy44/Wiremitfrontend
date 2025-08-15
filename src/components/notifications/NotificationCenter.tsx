import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAppStore } from '@/store';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system' | 'promotion';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { transactions } = useAppStore();

  useEffect(() => {
    // Create notifications only for completed transactions
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const transactionNotifications = completedTransactions.slice(0, 10).map(transaction => ({
      id: `tx-${transaction.id}`,
      title: 'Transaction Completed',
      message: `Your transfer of $${transaction.sourceAmount} to ${transaction.recipientName} has been completed successfully.`,
      type: 'transaction' as const,
      timestamp: new Date(transaction.createdAt),
      read: false,
    }));

    setNotifications(transactionNotifications);
    setUnreadCount(transactionNotifications.filter(n => !n.read).length);
  }, [transactions]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const addTestNotification = () => {
    const testNotification: Notification = {
      id: `test-${Date.now()}`,
      title: 'Test Notification',
      message: 'This is a test notification to verify the system.',
      type: 'system',
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [testNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction': return <CreditCard className="h-4 w-4" />;
      case 'security': return <AlertCircle className="h-4 w-4" />;
      case 'promotion': return <Users className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'transaction': return 'text-green-600';
      case 'security': return 'text-red-600';
      case 'promotion': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed right-4 top-16 w-96 max-w-[90vw] animate-slide-in-right">
        <Card className="shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={addTestNotification}>
                  Add Test
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={addTestNotification}>
                    Add Test Notification
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id} className="group">
                      <div
                        className={`p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                          !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={getNotificationColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Button variant="outline" size="sm" onClick={clearAllNotifications} className="w-full">
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}