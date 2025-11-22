# Yoga CRM

A comprehensive Customer Relationship Management system for yoga schools, built with Laravel 11 and React.

## Features

### Core Functionality
- **User Management** - 4 roles (Admin, Teacher, Pupil, Accountant) with role-based permissions
- **Lesson Management** - Create, update, cancel lessons with teacher assignment
- **Booking System** - Book lessons, cancel with refund policy, attendance tracking
- **Waitlist System** - Automatic promotion when spots become available
- **Credit System** - Packages, purchases, transactions, expiry tracking
- **Financial Reporting** - Accountant dashboard with revenue analytics and CSV exports
- **Notifications** - Email notifications for bookings, cancellations, promotions

### Tech Stack
- **Backend:** Laravel 11, PHP 8.1+
- **Frontend:** React 18, TypeScript, Inertia.js
- **Styling:** TailwindCSS, shadcn/ui components
- **Database:** MySQL/PostgreSQL (SQLite for development)
- **Build:** Vite

## Installation

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL/PostgreSQL (or SQLite for development)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd yoga-crm
```

2. **Install dependencies**
```bash
composer install
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database**
Edit `.env` and set your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yoga_crm
DB_USERNAME=root
DB_PASSWORD=
```

Or use SQLite for development:
```env
DB_CONNECTION=sqlite
```

5. **Run migrations and seed database**
```bash
php artisan migrate
php artisan db:seed --class=YogaCrmSeeder
```

6. **Build assets**
```bash
npm run build
```

7. **Start development server**
```bash
composer run dev
```

This will start:
- PHP development server (http://localhost:8000)
- Queue worker
- Vite dev server

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@yoga.test | password |
| Teacher | teacher@yoga.test | password |
| Pupil | pupil@yoga.test | password |
| Accountant | accountant@yoga.test | password |

## User Roles

### Pupil
- Browse and book lessons
- View booking history
- Purchase credit packages
- Manage profile
- Cancel bookings (with refund if within cutoff time)

### Teacher
- All pupil features
- Create and manage lessons
- View student list
- Mark attendance
- Cancel own lessons

### Admin
- All features
- User management (CRUD)
- Credit package management
- Confirm pending purchases
- Adjust user credits manually
- Cancel any lesson
- View admin dashboard

### Accountant
- View financial dashboard with revenue metrics
- View all purchases (read-only)
- View all transactions (read-only)
- Generate financial reports
- Export data to CSV
- Month-over-month revenue comparison

## Key Business Logic

### Booking Flow
1. User selects lesson → checks credits & capacity
2. Deducts credits → creates booking → sends confirmation
3. If full → can join waitlist

### Cancellation Flow
1. User cancels → checks cutoff time (default 24h)
2. Before cutoff → refunds credits
3. After cutoff → no refund
4. Promotes first waitlist entry if available

### Credit System
- Credits purchased via packages or manual adjustment
- Credits have expiry dates
- Expired credits cannot be used
- Transaction history tracks all credit movements

### Waitlist System
- Automatic promotion when booking cancelled
- Email notification sent to promoted user
- FIFO (First In, First Out) order

## Database Schema

### Core Tables
- `users` - User accounts with roles and profiles
- `lessons` - Lesson schedule
- `lesson_series` - Recurring lesson templates
- `bookings` - Lesson bookings
- `waitlist_entries` - Waitlist for full lessons
- `credit_packages` - Available credit packages
- `credit_purchases` - Purchase history
- `credit_transactions` - Credit movement audit trail
- `settings` - System configuration

## API Routes

### Public Routes
- `POST /login` - User login
- `POST /register` - User registration
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset

### Authenticated Routes

#### Lessons
- `GET /lessons` - List lessons
- `GET /lessons/{id}` - View lesson details
- `POST /lessons` - Create lesson (Teacher/Admin)
- `PUT /lessons/{id}` - Update lesson (Teacher/Admin)
- `DELETE /lessons/{id}` - Delete lesson (Teacher/Admin)
- `POST /lessons/{id}/cancel` - Cancel lesson (Admin)

#### Bookings
- `GET /bookings` - List my bookings
- `POST /bookings` - Book a lesson
- `DELETE /bookings/{id}` - Cancel booking
- `POST /bookings/{id}/attendance` - Mark attendance (Teacher/Admin)

#### Credits
- `GET /credits` - View credit balance
- `POST /credits/purchase` - Purchase credits
- `GET /credits/purchase/{id}` - View purchase details

#### Admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - List users
- `POST /admin/users` - Create user
- `GET /admin/users/{id}` - View user
- `PUT /admin/users/{id}` - Update user
- `DELETE /admin/users/{id}` - Delete user
- `POST /admin/users/{id}/credits` - Adjust credits
- `GET /admin/credit-packages` - List packages
- `POST /admin/credit-packages` - Create package
- `PUT /admin/credit-packages/{id}` - Update package
- `DELETE /admin/credit-packages/{id}` - Delete package
- `GET /admin/purchases` - List purchases
- `POST /admin/purchases/{id}/confirm` - Confirm payment

#### Accountant
- `GET /accountant/dashboard` - Financial dashboard
- `GET /accountant/purchases` - List purchases (read-only)
- `GET /accountant/purchases/{id}` - View purchase details
- `GET /accountant/transactions` - List transactions (read-only)
- `GET /accountant/reports` - Reports page
- `GET /accountant/reports/revenue` - Revenue analytics
- `GET /accountant/reports/export/purchases` - Export purchases CSV
- `GET /accountant/reports/export/transactions` - Export transactions CSV

## Development

### Running Tests
```bash
php artisan test
```

### Code Style
```bash
# PHP
./vendor/bin/pint

# JavaScript/TypeScript
npm run lint
```

### Building for Production
```bash
npm run build
php artisan optimize
```

## Configuration

### Email Notifications
Configure email settings in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Queue Configuration
For production, use a proper queue driver:
```env
QUEUE_CONNECTION=redis
```

Then run the queue worker:
```bash
php artisan queue:work
```

### Scheduled Tasks
Add to crontab for credit expiry checks:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## Database Compatibility

The application supports multiple database drivers:
- **MySQL/MariaDB** (recommended for production)
- **PostgreSQL**
- **SQLite** (for development)

Date formatting queries automatically adapt to the configured database driver via the `DatabaseHelper` class.

## Security

- CSRF protection enabled
- Password hashing with bcrypt
- Role-based authorization via policies
- Email verification available
- Two-factor authentication available
- SQL injection protection via Eloquent ORM

## License

[Your License Here]

## Support

For issues or questions, please open an issue on GitHub.
