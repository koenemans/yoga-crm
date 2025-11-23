# Yoga CRM

A complete management system designed specifically for yoga schools and studios. This application helps you manage your classes, students, teachers, bookings, and finances all in one place.

## What Does This System Do?

### For Yoga School Owners (Admins)
- **Manage Everything** - Complete control over your yoga school operations
- **Track Finances** - See revenue, pending payments, and export financial reports
- **Manage Staff & Students** - Add teachers and students, adjust their credits
- **Oversee All Classes** - View and manage all lessons across all teachers
- **Monitor Performance** - Dashboard with key metrics and month-over-month comparisons

### For Yoga Teachers
- **Personal Dashboard** - See your teaching statistics and upcoming classes
- **Schedule Classes** - Create and manage your own yoga lessons
- **Track Students** - View who's attending your classes and mark attendance
- **Monitor Bookings** - See how many students have booked each class
- **View All Schedules** - See what other teachers are teaching (read-only)

### For Students (Attendees)
- **Personal Dashboard** - See your credit balance, upcoming classes, and stats
- **Browse Classes** - Find and book yoga lessons that fit your schedule
- **Manage Bookings** - View your booking history and cancel if needed
- **Buy Credits** - Purchase credit packages to book classes
- **Join Waitlists** - Get notified when a full class has an opening
- **Track Progress** - See how many classes you've attended

## Key Features

### Smart Booking System
- Students book classes using credits
- Automatic waitlist when classes are full
- Cancellation with refund policy (within 24 hours)
- Email notifications for bookings and cancellations
- Automatic promotion from waitlist when spots open

### Flexible Credit System
- Pre-purchase credits in packages
- **Secure online payments via Mollie** (iDEAL, credit card, PayPal, etc.)
- Credits have expiry dates to encourage regular attendance
- Manual credit adjustments by admin when needed
- Complete transaction history for transparency
- Automatic credit allocation after successful payment

### Financial Management
- Track all purchases and payments
- Confirm pending payments manually
- Generate revenue reports
- Export data to spreadsheets (CSV)
- Month-over-month revenue comparison

### User-Friendly Design
- Clean, modern interface
- Mobile-responsive design
- Intuitive navigation for each role
- Real-time updates and notifications

## How It Works

### Three User Types

**1. Students (Attendees)**
- Create an account and purchase credits
- Browse available yoga classes
- Book classes using credits
- Receive email confirmations
- Cancel bookings (get refund if within 24 hours)
- Join waitlist if class is full
- Track attendance history

**2. Teachers**
- Create and schedule yoga classes
- Set class capacity and credit requirements
- View student bookings
- Mark attendance after class
- See teaching statistics
- Cancel classes if needed (students get automatic refunds)

**3. Administrators**
- Manage all users (teachers and students)
- Create credit packages with pricing
- Confirm pending payments
- View financial reports and analytics
- Manage all classes across all teachers
- Export data for accounting

### Booking Process

1. **Student browses classes** - See all upcoming yoga lessons with details (teacher, time, location, capacity)
2. **Student books a class** - System checks if they have enough credits and if space is available
3. **Credits are deducted** - Booking is confirmed and email notification is sent
4. **If class is full** - Student can join the waitlist
5. **When someone cancels** - First person on waitlist is automatically promoted and notified

### Credit System

- Students purchase credits in packages (e.g., 10 credits for €100)
- Each class requires a certain number of credits (set by teacher/admin)
- Credits have expiry dates to encourage regular attendance
- All credit transactions are tracked for transparency
- Admins can manually adjust credits when needed

### Cancellation Policy

- Students can cancel bookings
- **Within 24 hours of class:** Full credit refund
- **Less than 24 hours:** No refund
- When a booking is cancelled, the first person on the waitlist is automatically promoted

---

## Quick Start for Developers

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL/PostgreSQL (or SQLite for testing)

### Installation

1. Clone and install dependencies:
```bash
git clone <repository-url>
cd yoga-crm
composer install
npm install
```

2. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

3. Set up database (edit .env file with your database credentials)

4. Configure Mollie payment integration:
   - Sign up for a Mollie account at https://www.mollie.com
   - Get your API key from the Mollie dashboard
   - Add to your `.env` file:
   ```
   MOLLIE_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - For production, use your live API key instead of test key

5. Run migrations and seed test data:
```bash
php artisan migrate
php artisan db:seed --class=YogaCrmSeeder
```

6. Start development server:
```bash
composer run dev
```

Visit http://localhost:8000

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@yoga.test | password |
| Teacher | teacher@yoga.test | password |
| Student | attendee@yoga.test | password |

### Technology Stack

- **Backend:** Laravel 11 (PHP framework)
- **Frontend:** React 18 with TypeScript
- **Styling:** TailwindCSS with shadcn/ui components
- **Database:** MySQL, PostgreSQL, or SQLite
- **Email:** Configurable SMTP
- **Payments:** Mollie API (iDEAL, credit cards, and more)

---

## Payment Integration

### Mollie Setup

This system uses **Mollie** as the payment provider, which is perfect for European businesses and supports:
- **iDEAL** (most popular in Netherlands)
- Credit cards (Visa, Mastercard, American Express)
- PayPal
- Bancontact
- And many more payment methods

### How It Works

1. **Student selects a credit package** on the Credits page
2. **Clicks "Buy Now"** to proceed to payment
3. **Reviews order** on the payment page
4. **Redirected to Mollie** for secure payment processing
5. **Completes payment** using their preferred method (iDEAL, credit card, etc.)
6. **Webhook notification** automatically updates the purchase status
7. **Credits are added** to the student's account immediately
8. **Confirmation email** is sent (if configured)

### Testing Payments

Mollie provides test mode for development:
- Use test API keys (starting with `test_`)
- Test payments don't charge real money
- Use Mollie's test payment methods to simulate successful/failed payments
- See https://docs.mollie.com/overview/testing for test card numbers

### Production Setup

1. **Verify your Mollie account** (provide business details)
2. **Switch to live API key** in your `.env` file
3. **Configure webhook URL** in Mollie dashboard (if not auto-configured):
   ```
   https://yourdomain.com/mollie/webhook
   ```
4. **Test with real payment** (small amount first)
5. **Monitor payments** in Mollie dashboard

### Webhook Configuration

The webhook endpoint (`/mollie/webhook`) handles automatic payment status updates:
- No authentication required (Mollie verifies via payment ID)
- Processes payment confirmations in the background
- Updates purchase status and adds credits automatically
- Logs all webhook events for debugging

**Important:** Make sure your webhook URL is publicly accessible (not localhost) in production.

---

## Security & Privacy

- All passwords are securely encrypted
- Role-based access control (users only see what they're allowed to)
- Protection against common web vulnerabilities
- Optional two-factor authentication
- Email verification for new accounts
- **PCI-compliant payment processing** (via Mollie - no card data stored locally)
- Secure webhook verification for payment updates
- HTTPS required for production payment processing

## Support & Customization

This system is designed to be flexible and can be customized for your specific yoga school needs:
- Adjust credit packages and pricing
- Modify cancellation policies
- Customize email notifications
- Add custom fields to user profiles
- Configure class types and categories

For technical support or questions, please contact your system administrator.
