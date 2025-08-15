# Wiremit - Send Pocket Money App

A web application for Zimbabwean parents to send money to their children studying abroad (UK or South Africa).

## 🎯 Project Overview

This project was built as part of the Wiremit Frontend Developer Technical Interview. It's a comprehensive money transfer application with account creation, login, dashboard functionality, and real-time exchange rate integration.

## 🚀 Features

### 1. Account Creation & Authentication

- **Mock Account Creation**: Sign-up form with name, email, and password
- **Mock Login System**: Secure authentication with session management
- **Persistent Sessions**: Session data stored securely in cookies
- **Multi-user Support**: Handles multiple accounts with proper isolation

### 2. Dashboard Features

#### Send Money Section

- **USD Input**: Amount validation with minimum $1 and maximum limits based on user tier
- **Fee Calculation**: 10% fee for GBP (UK), 20% fee for ZAR (South Africa)
- **Real-time FX Rates**: Integration with provided API endpoint
- **Rounded Calculations**: Transaction amounts rounded UP for accuracy
- **Recipient Details**: Full recipient information capture
- **Transaction Limits**: Per-transaction, daily, and monthly limits validation

#### Mock Ads Section

- **Carousel Display**: Professional carousel with 3+ advertisements
- **Interactive**: Clickable ads with CTA buttons
- **Responsive**: Adapts to different screen sizes

#### Transaction History

- **15+ Mock Transactions**: Comprehensive transaction history
- **Pagination**: Easy navigation through transaction pages
- **Real-time Updates**: Simulated status progression
- **Filtering & Search**: Filter by status, type, and search functionality
- **Export to CSV**: Download transaction history

### 3. Real-time Features

- **Notifications**: Real-time notifications for transaction updates
- **Profile Management**: Complete profile editing with image upload
- **Settings & Support**: Comprehensive settings with health support tickets
- **Billing Management**: Subscription and billing management

## 🔧 Technical Implementation

### FX Rates API Integration

- **Endpoint**: `https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS`
- **Data Extraction**: Handles non-flat structure and extracts GBP/ZAR rates
- **Caching**: 5-minute cache for optimal performance
- **Error Handling**: Graceful fallback for API failures

### Security Considerations

- **Credential Storage**: Passwords stored in localStorage (mock only - would be hashed in production)
- **Session Management**: Secure cookie storage with httpOnly, secure, and sameSite flags
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based request validation
- **Authentication**: JWT-like token system with refresh tokens

### Mobile Responsiveness

- **Tailwind CSS**: Mobile-first responsive design
- **Breakpoints**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Touch-friendly**: Appropriate button sizes and touch targets
- **Adaptive Layout**: Grid layouts that adapt to screen size

### UI/UX Features

- **Intuitive Navigation**: Clear navigation structure
- **Loading States**: Visual feedback during API calls
- **Error Messages**: Clear error messaging and validation
- **Success Feedback**: Toast notifications for user actions
- **Accessibility**: WCAG 2.1 compliance with proper ARIA labels
- **Dark/Light Mode**: Theme support (future enhancement)

### Input Validation

- **Required Fields**: Comprehensive validation for all required inputs
- **Numeric Ranges**: Amount validation (minimum $1, maximum based on tier)
- **Email Validation**: RFC-compliant email validation
- **Phone Validation**: International phone number support
- **Real-time Validation**: Immediate feedback on input errors

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **API Calls**: Native Fetch API with error handling
- **Icons**: Lucide React
- **Animations**: Tailwind CSS animations
- **Build Tool**: Vite
- **Package Manager**: Bun

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ or Bun
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd wiremit-app
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔐 Demo Credentials

For testing purposes

create a new account through the registration form.

## 🏗️ Architecture & Design Decisions

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── auth/           # Authentication forms
│   ├── dashboard/      # Dashboard-specific components
│   ├── transactions/   # Transaction-related components
│   └── common/         # Common utility components
├── pages/              # Page-level components
├── store/              # Zustand state management
├── services/           # API service layer
├── lib/                # Utilities and constants
└── types/              # TypeScript type definitions
```

### Data Flow

1. **State Management**: Centralized with Zustand
2. **API Layer**: Abstracted service layer with caching
3. **Component Communication**: Props and global state
4. **Persistence**: LocalStorage for demo data, cookies for auth

### Scalability Considerations

#### Adding More Countries

- **Constants**: Add new country configurations to `COUNTRIES` object
- **Currency Support**: Extend `CURRENCIES` mapping
- **Fee Structure**: Configurable fee percentages per country
- **Processing Times**: Country-specific processing estimates

#### Adding More Currencies

- **API Integration**: Extend FX rates API response handling
- **Calculation Engine**: Currency-agnostic calculation functions
- **Display Logic**: Dynamic currency symbol and formatting
- **Validation**: Currency-specific validation rules

#### Future Enhancements

- **Real Backend**: Replace mock APIs with actual backend services
- **Database Integration**: Persistent data storage
- **Payment Gateways**: Integration with payment processors
- **Mobile App**: React Native or native mobile applications
- **Advanced Analytics**: Transaction analytics and reporting
- **KYC/AML**: Enhanced verification and compliance features

## 🧪 Testing

The application includes comprehensive mock data and scenarios:

- **15+ Mock Transactions**: Various statuses, amounts, and dates
- **Real-time Simulation**: Status updates and progression
- **Error Scenarios**: Network failures and validation errors
- **Edge Cases**: Limit testing and boundary conditions

## 🚦 Performance Optimizations

- **Code Splitting**: Lazy loading for route-based components
- **Caching**: API response caching with TTL
- **Debouncing**: Input validation debouncing
- **Optimistic Updates**: Immediate UI feedback
- **Bundle Optimization**: Tree-shaking and dead code elimination

## 📊 Monitoring & Analytics

- **Error Tracking**: Console error logging
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Transaction completion tracking
- **API Monitoring**: Response time and error rate tracking

## 🔮 Future Roadmap

1. **Enhanced Security**: 2FA, biometric authentication
2. **Advanced Features**: Recurring transfers, saved recipients
3. **Integration**: Payment gateway connections
4. **Analytics**: Advanced reporting and insights
5. **Mobile**: Native mobile applications
6. **Compliance**: Full KYC/AML integration

## 📄 License

This project is built for interview purposes and follows standard web development practices.
