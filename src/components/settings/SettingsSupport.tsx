import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  HelpCircle, MessageSquare, Phone, Mail, Clock, 
  Search, BookOpen, Video, FileText, CheckCircle,
  AlertCircle, Star, ThumbsUp, ThumbsDown, Trash2,
  Edit, Settings, LifeBuoy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created: string;
  lastUpdate: string;
  description?: string;
}

export default function SettingsSupport({ isOpen, onClose }: SettingsSupportProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How long does a money transfer take?',
      answer: 'Most transfers are completed within 1-3 business days. Express transfers can be completed within hours for an additional fee.',
      category: 'transfers',
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: '2',
      question: 'What are the transfer fees?',
      answer: 'Transfer fees vary by destination and amount. GBP transfers have a 10% fee, ZAR transfers have a 20% fee. Premium users enjoy reduced rates.',
      category: 'fees',
      helpful: 38,
      notHelpful: 5,
    },
    {
      id: '3',
      question: 'How do I verify my account?',
      answer: 'To verify your account, upload a government-issued ID and proof of address. Verification typically takes 1-2 business days.',
      category: 'account',
      helpful: 52,
      notHelpful: 1,
    },
    {
      id: '4',
      question: 'Can I cancel a transfer?',
      answer: 'Transfers can be cancelled within 30 minutes of initiation if they haven\'t been processed yet. Contact support for assistance.',
      category: 'transfers',
      helpful: 28,
      notHelpful: 8,
    },
    {
      id: '5',
      question: 'What currencies do you support?',
      answer: 'We currently support USD, GBP, ZAR, and USDT. We\'re constantly adding new currencies based on user demand.',
      category: 'currencies',
      helpful: 33,
      notHelpful: 3,
    },
  ];

  useEffect(() => {
    // Load initial ticket data
    const initialTickets: Ticket[] = [
      {
        id: 'TK-001',
        subject: 'Transfer delayed - urgent',
        status: 'in-progress',
        priority: 'high',
        created: '2024-01-15',
        lastUpdate: '2024-01-16',
        description: 'My transfer has been stuck in processing for over 24 hours.'
      },
      {
        id: 'TK-002',
        subject: 'Account verification issue',
        status: 'resolved',
        priority: 'medium',
        created: '2024-01-12',
        lastUpdate: '2024-01-14',
        description: 'Having trouble uploading documents for verification.'
      },
      {
        id: 'TK-003',
        subject: 'Exchange rate question',
        status: 'open',
        priority: 'low',
        created: '2024-01-10',
        lastUpdate: '2024-01-10',
        description: 'Need clarification on current exchange rates.'
      },
    ];
    setTickets(initialTickets);
  }, []);

  const submitTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both subject and description.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTicket: Ticket = {
        id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: ticketForm.subject,
        status: 'open',
        priority: ticketForm.priority as 'low' | 'medium' | 'high',
        created: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        description: ticketForm.description,
      };

      setTickets(prev => [newTicket, ...prev]);
      
      toast({
        title: 'Ticket Submitted',
        description: `Your support ticket ${newTicket.id} has been created successfully.`,
        variant: 'default',
      });
      
      // Reset form
      setTicketForm({
        subject: '',
        category: '',
        priority: 'medium',
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit your ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
        : ticket
    ));
    
    toast({
      title: 'Ticket Updated',
      description: `Ticket ${ticketId} status changed to ${newStatus}.`,
    });
  };

  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    
    toast({
      title: 'Ticket Deleted',
      description: `Ticket ${ticketId} has been removed.`,
    });
  };

  const markHelpful = (faqId: string, helpful: boolean) => {
    toast({
      title: helpful ? 'Marked as Helpful' : 'Marked as Not Helpful',
      description: 'Thank you for your feedback!',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <LifeBuoy className="h-6 w-6" />
                Settings & Support
              </h2>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="faq" className="h-full flex">
              <TabsList className="flex-col h-full w-48 justify-start p-2 bg-muted/50">
                <TabsTrigger value="faq" className="w-full justify-start gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="contact" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </TabsTrigger>
                <TabsTrigger value="tickets" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  My Tickets
                </TabsTrigger>
                <TabsTrigger value="resources" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="faq" className="p-6 m-0">
                  <div className="space-y-6">
                    {/* Quick Contact Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Live Chat</h3>
                          <p className="text-sm text-muted-foreground">Available 24/7</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Phone Support</h3>
                          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Email Support</h3>
                          <p className="text-sm text-muted-foreground">support@wiremit.com</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* FAQ Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search frequently asked questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* FAQ List */}
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <p className="text-muted-foreground">{faq.answer}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Was this helpful?</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markHelpful(faq.id, true)}
                                    className="h-8 gap-1"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    {faq.helpful}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markHelpful(faq.id, false)}
                                    className="h-8 gap-1"
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                    {faq.notHelpful}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="p-6 m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit a Support Ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={ticketForm.subject}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Brief description of your issue"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="transfer">Transfer Issues</SelectItem>
                              <SelectItem value="account">Account & Verification</SelectItem>
                              <SelectItem value="fees">Fees & Pricing</SelectItem>
                              <SelectItem value="technical">Technical Issues</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Please provide detailed information about your issue..."
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <Button onClick={submitTicket} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tickets" className="p-6 m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Support Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell className="font-medium">{ticket.id}</TableCell>
                              <TableCell>{ticket.subject}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(ticket.created).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteTicket(ticket.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="p-6 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <BookOpen className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">User Guide</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete guide on how to use Wiremit for money transfers
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Video className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">Video Tutorials</h3>
                        <p className="text-sm text-muted-foreground">
                          Step-by-step video tutorials for common tasks
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <FileText className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">API Documentation</h3>
                        <p className="text-sm text-muted-foreground">
                          Technical documentation for developers
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Star className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">Feature Requests</h3>
                        <p className="text-sm text-muted-foreground">
                          Submit ideas for new features and improvements
                        </p>
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