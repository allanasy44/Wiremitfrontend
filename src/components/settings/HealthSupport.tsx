import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Heart, Zap, Shield, Clock, TrendingUp, 
  AlertTriangle, CheckCircle, Database, Server,
  Wifi, HardDrive, Cpu, BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SystemHealth {
  id: string;
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastChecked: string;
  responseTime: number;
  description: string;
}

interface PerformanceMetric {
  id: string;
  metric: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export default function HealthSupport({ isOpen, onClose }: HealthSupportProps) {
  const { toast } = useToast();
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, [isOpen]);

  const loadHealthData = async () => {
    setIsRefreshing(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock system health data
    const mockHealthData: SystemHealth[] = [
      {
        id: '1',
        component: 'Payment Gateway',
        status: 'healthy',
        uptime: 99.95,
        lastChecked: new Date().toISOString(),
        responseTime: 145,
        description: 'All payment processing systems operational'
      },
      {
        id: '2',
        component: 'Database Cluster',
        status: 'healthy',
        uptime: 99.98,
        lastChecked: new Date(Date.now() - 30000).toISOString(),
        responseTime: 23,
        description: 'Primary and backup databases running smoothly'
      },
      {
        id: '3',
        component: 'Authentication Service',
        status: 'warning',
        uptime: 99.82,
        lastChecked: new Date(Date.now() - 120000).toISOString(),
        responseTime: 312,
        description: 'Elevated response times detected'
      },
      {
        id: '4',
        component: 'Exchange Rate API',
        status: 'healthy',
        uptime: 99.99,
        lastChecked: new Date(Date.now() - 15000).toISOString(),
        responseTime: 87,
        description: 'Real-time currency data updating normally'
      },
      {
        id: '5',
        component: 'Notification Service',
        status: 'critical',
        uptime: 98.45,
        lastChecked: new Date(Date.now() - 300000).toISOString(),
        responseTime: 1250,
        description: 'Service degradation in SMS delivery'
      }
    ];

    // Mock performance metrics
    const mockPerformanceData: PerformanceMetric[] = [
      {
        id: '1',
        metric: 'Transaction Success Rate',
        current: 99.7,
        target: 99.5,
        unit: '%',
        trend: 'up'
      },
      {
        id: '2',
        metric: 'Average Processing Time',
        current: 2.3,
        target: 3.0,
        unit: 'seconds',
        trend: 'down'
      },
      {
        id: '3',
        metric: 'API Response Time',
        current: 156,
        target: 200,
        unit: 'ms',
        trend: 'stable'
      },
      {
        id: '4',
        metric: 'Daily Active Users',
        current: 15420,
        target: 12000,
        unit: 'users',
        trend: 'up'
      },
      {
        id: '5',
        metric: 'Error Rate',
        current: 0.3,
        target: 1.0,
        unit: '%',
        trend: 'down'
      }
    ];

    setSystemHealth(mockHealthData);
    setPerformanceMetrics(mockPerformanceData);
    setIsRefreshing(false);
  };

  const refreshHealthData = async () => {
    await loadHealthData();
    toast({
      title: 'Health data refreshed',
      description: 'System health information has been updated.',
    });
  };

  const restartService = async (componentId: string) => {
    setIsRefreshing(true);
    
    // Simulate service restart
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSystemHealth(prev => prev.map(item => 
      item.id === componentId 
        ? { ...item, status: 'healthy' as const, lastChecked: new Date().toISOString() }
        : item
    ));
    
    setIsRefreshing(false);
    toast({
      title: 'Service restarted',
      description: 'The service has been successfully restarted.',
    });
  };

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                System Health & Support
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={refreshHealthData} disabled={isRefreshing}>
                  <Activity className="h-4 w-4 mr-2" />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button variant="ghost" onClick={onClose}>×</Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full flex">
              <TabsList className="flex-col h-full w-48 justify-start p-2 bg-muted/50">
                <TabsTrigger value="overview" className="w-full justify-start gap-2">
                  <Activity className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="services" className="w-full justify-start gap-2">
                  <Server className="h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="performance" className="w-full justify-start gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Monitoring
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="p-6 m-0">
                  <div className="space-y-6">
                    {/* System Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">
                                {systemHealth.filter(s => s.status === 'healthy').length}
                              </p>
                              <p className="text-sm text-muted-foreground">Healthy Services</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                              <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">
                                {systemHealth.filter(s => s.status === 'warning').length}
                              </p>
                              <p className="text-sm text-muted-foreground">Warnings</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">
                                {systemHealth.filter(s => s.status === 'critical').length}
                              </p>
                              <p className="text-sm text-muted-foreground">Critical Issues</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Overall System Health */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Overall System Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>System Uptime</span>
                              <span>99.8%</span>
                            </div>
                            <Progress value={99.8} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>Performance Score</span>
                              <span>94.5%</span>
                            </div>
                            <Progress value={94.5} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>Security Rating</span>
                              <span>98.2%</span>
                            </div>
                            <Progress value={98.2} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="p-6 m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uptime</TableHead>
                            <TableHead>Response Time</TableHead>
                            <TableHead>Last Checked</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {systemHealth.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell className="font-medium">{service.component}</TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(service.status)} gap-1`}>
                                  {getStatusIcon(service.status)}
                                  {service.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{service.uptime}%</TableCell>
                              <TableCell>{service.responseTime}ms</TableCell>
                              <TableCell>
                                {new Date(service.lastChecked).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                {service.status !== 'healthy' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => restartService(service.id)}
                                    disabled={isRefreshing}
                                  >
                                    Restart
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="p-6 m-0">
                  <div className="space-y-6">
                    {performanceMetrics.map((metric) => (
                      <Card key={metric.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{metric.metric}</CardTitle>
                            {getTrendIcon(metric.trend)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Current</span>
                              <span className="font-bold">
                                {metric.current} {metric.unit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Target</span>
                              <span>{metric.target} {metric.unit}</span>
                            </div>
                            <Progress 
                              value={(metric.current / metric.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="monitoring" className="p-6 m-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Real-time Monitoring</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Cpu className="h-4 w-4" />
                              <span className="font-medium">CPU Usage</span>
                            </div>
                            <div className="text-2xl font-bold">23.4%</div>
                            <Progress value={23.4} className="h-2 mt-2" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <HardDrive className="h-4 w-4" />
                              <span className="font-medium">Memory Usage</span>
                            </div>
                            <div className="text-2xl font-bold">67.8%</div>
                            <Progress value={67.8} className="h-2 mt-2" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="h-4 w-4" />
                              <span className="font-medium">Database Load</span>
                            </div>
                            <div className="text-2xl font-bold">12.3%</div>
                            <Progress value={12.3} className="h-2 mt-2" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Wifi className="h-4 w-4" />
                              <span className="font-medium">Network I/O</span>
                            </div>
                            <div className="text-2xl font-bold">45.6%</div>
                            <Progress value={45.6} className="h-2 mt-2" />
                          </div>
                        </div>
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