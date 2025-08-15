import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Shield, Star, Upload, User, Lock, Bell, Globe } from 'lucide-react';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface ProfileManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileManagement({ isOpen, onClose }: ProfileManagementProps) {
  const { auth, setUser } = useAppStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phoneNumber: auth.user?.phoneNumber || '',
    address: '',
    city: '',
    country: 'Zimbabwe',
    dateOfBirth: '',
    occupation: '',
    emergencyContact: '',
    bio: '',
    profilePicture: '',
  });

  const [availableCountries] = useState([
    'Zimbabwe', 'South Africa', 'United Kingdom', 'United States', 'Canada', 'Australia'
  ]);

  const [availableLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'pt', name: 'Portuguese' }
  ]);

  const [availableCurrencies] = useState([
    'USD', 'GBP', 'ZAR', 'EUR', 'CAD', 'AUD'
  ]);

  const [availableTimezones] = useState([
    'Africa/Harare', 'Africa/Johannesburg', 'Europe/London', 'America/New_York', 'America/Toronto', 'Australia/Sydney'
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: auth.user?.mfaEnabled || false,
    emailNotifications: true,
    smsNotifications: true,
    loginAlerts: true,
    transactionAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'Africa/Harare',
    theme: 'light',
  });

  useEffect(() => {
    if (auth.user) {
      setProfileData(prev => ({
        ...prev,
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        phoneNumber: auth.user?.phoneNumber || '',
      }));
    }
  }, [auth.user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...auth.user!,
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
      };
      
      setUser(updatedUser);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profilePicture: imageUrl }));
      
      toast({
        title: 'Image uploaded successfully',
        description: 'Your profile picture has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = (field: string, value: string) => {
    if (field === 'country' || field === 'language' || field === 'currency' || field === 'timezone') {
      if (field === 'language' || field === 'currency' || field === 'timezone') {
        setPreferences(prev => ({ ...prev, [field]: value }));
      } else {
        setProfileData(prev => ({ ...prev, [field]: value }));
      }
      
      toast({
        title: 'Setting updated',
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated.`,
      });
    }
  };

  const handleSecurityUpdate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Security Settings Updated',
        description: 'Your security preferences have been saved.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update security settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Preferences Updated',
        description: 'Your preferences have been saved.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!isOpen || !auth.user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Profile Management</h2>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="profile" className="h-full flex">
              <TabsList className="flex-col h-full w-48 justify-start p-2 bg-muted/50">
                <TabsTrigger value="profile" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Profile Info
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start gap-2">
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="w-full justify-start gap-2">
                  <Globe className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="profile" className="p-6 m-0">
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={profileData.profilePicture} />
                            <AvatarFallback className="bg-gradient-primary text-white text-lg">
                              {getInitials(auth.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Button variant="outline" className="gap-2" onClick={() => document.getElementById('picture-upload')?.click()}>
                              <Upload className="h-4 w-4" />
                              Upload New Picture
                            </Button>
                            <input
                              id="picture-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              JPG, PNG up to 5MB
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Badge className={`${getTierBadgeColor(auth.user.tier)}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {auth.user.tier.charAt(0).toUpperCase() + auth.user.tier.slice(1)}
                          </Badge>
                          {auth.user.isVerified && (
                            <Badge variant="outline" className="border-success text-success">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <PhoneInput
                              id="phone"
                              value={profileData.phoneNumber}
                              onChange={(value) => setProfileData(prev => ({ ...prev, phoneNumber: value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                              id="dob"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={profileData.city}
                              onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Select value={profileData.country} onValueChange={(value) => handleDropdownChange('country', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableCountries.map(country => (
                                  <SelectItem key={country} value={country}>{country}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          />
                        </div>

                        <Button onClick={handleProfileUpdate} disabled={isLoading} className="w-full">
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="p-6 m-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.mfaEnabled}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, mfaEnabled: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Login Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified of login attempts from new devices
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.loginAlerts}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Transaction Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications for all transactions
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.transactionAlerts}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, transactionAlerts: checked }))}
                          />
                        </div>

                        <Button onClick={handleSecurityUpdate} disabled={isLoading} className="w-full">
                          {isLoading ? 'Updating...' : 'Update Security Settings'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="p-6 m-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Language</Label>
                          <Select value={preferences.language} onValueChange={(value) => handleDropdownChange('language', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLanguages.map(lang => (
                                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Default Currency</Label>
                          <Select value={preferences.currency} onValueChange={(value) => handleDropdownChange('currency', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCurrencies.map(currency => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Timezone</Label>
                          <Select value={preferences.timezone} onValueChange={(value) => handleDropdownChange('timezone', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTimezones.map(timezone => (
                                <SelectItem key={timezone} value={timezone}>{timezone}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={handlePreferencesUpdate} disabled={isLoading} className="w-full">
                          {isLoading ? 'Updating...' : 'Update Preferences'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="p-6 m-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates via email
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.emailNotifications}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, emailNotifications: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates via SMS
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.smsNotifications}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, smsNotifications: checked }))}
                          />
                        </div>

                        <Button onClick={handleSecurityUpdate} disabled={isLoading} className="w-full">
                          {isLoading ? 'Updating...' : 'Update Notification Settings'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}