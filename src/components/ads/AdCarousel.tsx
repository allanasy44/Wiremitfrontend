import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, ChevronRight, ExternalLink, Star, 
  Gift, Zap, Shield, TrendingUp, Users, Clock 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ad {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  badgeText?: string;
  badgeColor?: string;
  backgroundColor: string;
  textColor: string;
  icon?: React.ReactNode;
  priority: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  clickCount: number;
  impressionCount: number;
}

export default function AdCarousel() {
  const { toast } = useToast();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [displayedAds, setDisplayedAds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize with real-world style ads
    const realWorldAds: Ad[] = [
      {
        id: 'ad_001',
        title: 'Send Money to SA - Zero Fees!',
        description: 'Limited time offer: Send money to South Africa with 0% transfer fees for new customers. Save up to $50 per transfer!',
        ctaText: 'Claim Free Transfer',
        ctaUrl: '/promotion/zero-fees-sa',
        badgeText: 'LIMITED TIME',
        badgeColor: 'bg-destructive text-white',
        backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
        textColor: 'text-white',
        icon: <Gift className="h-6 w-6" />,
        priority: 1,
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-01'),
        clickCount: 0,
        impressionCount: 0,
      },
      {
        id: 'ad_002',
        title: 'Refer Friends, Earn $25!',
        description: 'Get $25 for every friend you refer who makes their first transfer. No limit on referrals - earn unlimited rewards!',
        ctaText: 'Start Referring',
        ctaUrl: '/referrals',
        badgeText: 'UNLIMITED REWARDS',
        badgeColor: 'bg-secondary text-white',
        backgroundColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        textColor: 'text-white',
        icon: <Users className="h-6 w-6" />,
        priority: 2,
        isActive: true,
        clickCount: 0,
        impressionCount: 0,
      },
      {
        id: 'ad_003',
        title: 'Instant Transfers to UK',
        description: 'Send money to the UK in under 30 minutes with our express service. Perfect for urgent payments and emergencies.',
        ctaText: 'Send Now',
        ctaUrl: '/transfer?destination=uk&express=true',
        badgeText: '30 MIN DELIVERY',
        badgeColor: 'bg-warning text-black',
        backgroundColor: 'bg-gradient-to-r from-purple-500 to-pink-600',
        textColor: 'text-white',
        icon: <Zap className="h-6 w-6" />,
        priority: 3,
        isActive: true,
        clickCount: 0,
        impressionCount: 0,
      },
      {
        id: 'ad_004',
        title: 'Premium Account Benefits',
        description: 'Upgrade to Premium and enjoy 50% lower fees, priority support, and advanced features. First month free!',
        ctaText: 'Upgrade Now',
        ctaUrl: '/upgrade',
        badgeText: '1ST MONTH FREE',
        badgeColor: 'bg-primary text-white',
        backgroundColor: 'bg-gradient-to-r from-yellow-500 to-orange-600',
        textColor: 'text-white',
        icon: <Star className="h-6 w-6" />,
        priority: 4,
        isActive: true,
        clickCount: 0,
        impressionCount: 0,
      },
      {
        id: 'ad_005',
        title: 'Bank-Level Security',
        description: 'Your money is protected with 256-bit encryption, fraud monitoring, and $250,000 insurance coverage.',
        ctaText: 'Learn More',
        ctaUrl: '/security',
        badgeText: 'INSURED',
        badgeColor: 'bg-success text-white',
        backgroundColor: 'bg-gradient-to-r from-teal-500 to-cyan-600',
        textColor: 'text-white',
        icon: <Shield className="h-6 w-6" />,
        priority: 5,
        isActive: true,
        clickCount: 0,
        impressionCount: 0,
      },
      {
        id: 'ad_006',
        title: 'Exchange Rate Alerts',
        description: 'Get notified when exchange rates are favorable. Set custom alerts and never miss the best rates again!',
        ctaText: 'Set Alert',
        ctaUrl: '/rate-alerts',
        badgeText: 'FREE FEATURE',
        badgeColor: 'bg-info text-white',
        backgroundColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        textColor: 'text-white',
        icon: <TrendingUp className="h-6 w-6" />,
        priority: 6,
        isActive: true,
        clickCount: 0,
        impressionCount: 0,
      },
    ];

    setAds(realWorldAds);
  }, []);

  useEffect(() => {
    // Track impressions
    if (ads.length > 0) {
      const currentAd = ads[currentAdIndex];
      if (currentAd && !displayedAds.has(currentAd.id)) {
        setDisplayedAds(prev => new Set([...prev, currentAd.id]));
        setAds(prev => prev.map(ad => 
          ad.id === currentAd.id 
            ? { ...ad, impressionCount: ad.impressionCount + 1 }
            : ad
        ));
      }
    }
  }, [currentAdIndex, ads, displayedAds]);

  useEffect(() => {
    if (!isPlaying || ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, ads.length]);

  const nextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + ads.length) % ads.length);
  };

  const handleAdClick = (ad: Ad) => {
    // Track click
    setAds(prev => prev.map(a => 
      a.id === ad.id 
        ? { ...a, clickCount: a.clickCount + 1 }
        : a
    ));

    // Simulate ad interaction
    toast({
      title: 'Opening Offer',
      description: `Redirecting to ${ad.title}...`,
    });

    // In a real app, you would navigate to the URL
    console.log(`Navigating to: ${ad.ctaUrl}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (ads.length === 0) {
    return (
      <Card className="h-48 bg-muted/50">
        <CardContent className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading advertisements...</p>
        </CardContent>
      </Card>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="relative group">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div 
          className={`${currentAd.backgroundColor} relative`}
          style={{ minHeight: '200px' }}
        >
          <CardContent className="p-6 h-full">
            <div className={`space-y-4 ${currentAd.textColor}`}>
              {/* Badge and Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentAd.icon}
                  {currentAd.badgeText && (
                    <Badge className={`${currentAd.badgeColor} text-xs font-bold px-2 py-1`}>
                      {currentAd.badgeText}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span className="text-xs opacity-60">
                    {isPlaying ? 'Auto' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold mb-2 leading-tight">
                  {currentAd.title}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {currentAd.description}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Button 
                  onClick={() => handleAdClick(currentAd)}
                  className="bg-white/90 hover:bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {currentAd.ctaText}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevAd}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={nextAd}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Play/Pause Control */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="h-6 w-6 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentAdIndex(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === currentAdIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Analytics Info (Dev Mode) */}
      <div className="mt-2 text-xs text-muted-foreground text-center opacity-50">
        Ad {currentAdIndex + 1}/{ads.length} • 
        Views: {currentAd.impressionCount} • 
        Clicks: {currentAd.clickCount} • 
        CTR: {currentAd.impressionCount > 0 ? ((currentAd.clickCount / currentAd.impressionCount) * 100).toFixed(1) : 0}%
      </div>
    </div>
  );
}