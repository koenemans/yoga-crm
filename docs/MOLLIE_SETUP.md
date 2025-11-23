# Mollie Payment Integration - Quick Setup Guide

## 🚀 What's Been Implemented

Your Yoga CRM now has full Mollie payment integration with support for iDEAL and other payment methods!

### ✅ Completed Features

1. **Mollie SDK Integration** - Laravel Mollie package installed and configured
2. **Database Schema** - New fields added to track Mollie payments
3. **Payment Service** - Handles payment creation and webhook processing
4. **Controllers** - Payment flow and webhook handler
5. **Routes** - All payment endpoints configured
6. **React UI** - Beautiful payment pages with modern design
7. **Automatic Credit Allocation** - Credits added immediately after successful payment

---

## 📋 Setup Instructions

### 1. Get Your Mollie API Key

1. Sign up at https://www.mollie.com (free account)
2. Go to **Developers** → **API Keys** in the Mollie dashboard
3. Copy your **Test API Key** (starts with `test_`)

### 2. Configure Your Environment

Add to your `.env` file:

```env
MOLLIE_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** 
- Use `test_` keys for development
- Use `live_` keys for production (after account verification)

### 3. Test the Integration

1. Start your development server:
   ```bash
   composer run dev
   ```

2. Log in as a student (attendee@yoga.test / password)

3. Navigate to **Credits** page

4. Click **Buy Now** on any credit package

5. Complete the payment flow

---

## 🔄 Payment Flow

### User Journey

```
Credits Page → Payment Review → Mollie Checkout → Payment Status → Credits Added
```

1. **Student clicks "Buy Now"** on a credit package
2. **Reviews order details** on `/payment/{package}` page
3. **Redirected to Mollie** for secure payment
4. **Completes payment** using iDEAL, credit card, etc.
5. **Redirected back** to your app
6. **Webhook processes payment** in background
7. **Credits automatically added** to account
8. **Success message** shown to user

### Backend Flow

```
PaymentController::store()
    ↓
PaymentService::createPayment()
    ↓
Mollie API (create payment)
    ↓
User redirected to Mollie
    ↓
User completes payment
    ↓
Mollie sends webhook
    ↓
MollieWebhookController
    ↓
PaymentService::handleWebhook()
    ↓
Credits added + Transaction created
```

---

## 🧪 Testing Payments

### Test Mode

Mollie provides test payment methods that don't charge real money:

**iDEAL Test:**
- Select any test bank
- Payment will be marked as "paid" automatically

**Credit Card Test:**
- Card number: `5555 5555 5555 4444`
- Expiry: Any future date
- CVC: Any 3 digits

**More test methods:** https://docs.mollie.com/overview/testing

### Testing Webhooks Locally

Mollie webhooks need a public URL. For local testing:

**Option 1: Use ngrok**
```bash
ngrok http 8000
```
Then update webhook URL in Mollie dashboard to: `https://your-ngrok-url.ngrok.io/mollie/webhook`

**Option 2: Test webhook manually**
```bash
php artisan tinker
$service = app(\App\Services\PaymentService::class);
$service->handleWebhook('tr_xxxxx'); // Use actual payment ID
```

---

## 📁 Files Created/Modified

### Backend

- `app/Services/PaymentService.php` - Payment processing logic
- `app/Http/Controllers/PaymentController.php` - Payment pages
- `app/Http/Controllers/MollieWebhookController.php` - Webhook handler
- `app/Models/CreditPurchase.php` - Updated with Mollie fields
- `database/migrations/2025_11_23_114418_add_mollie_fields_to_credit_purchases_table.php`
- `routes/web.php` - Payment routes added
- `config/mollie.php` - Mollie configuration
- `.env.example` - Added MOLLIE_KEY

### Frontend

- `resources/js/pages/payment/create.tsx` - Payment review page
- `resources/js/pages/payment/show.tsx` - Payment status page
- `resources/js/pages/credits/index.tsx` - Updated to use payment flow

---

## 🔐 Security Notes

### ✅ What's Secure

- **No card data stored** - All payment data handled by Mollie
- **PCI-DSS compliant** - Mollie is certified
- **Webhook verification** - Payment ID verified with Mollie API
- **CSRF protection** - Laravel's built-in protection
- **User authorization** - Users can only see their own purchases

### ⚠️ Production Checklist

Before going live:

- [ ] Switch to live Mollie API key
- [ ] Enable HTTPS on your domain
- [ ] Verify webhook URL is publicly accessible
- [ ] Test with small real payment
- [ ] Set up email notifications
- [ ] Monitor Mollie dashboard for first few days
- [ ] Check Laravel logs for any errors

---

## 🎨 Supported Payment Methods

Mollie automatically shows available payment methods based on:
- Currency (EUR)
- Amount
- Customer location

**Common methods:**
- iDEAL (Netherlands)
- Credit/Debit Cards
- PayPal
- Bancontact (Belgium)
- SOFORT Banking
- Apple Pay
- Google Pay

---

## 🐛 Troubleshooting

### Payment not completing?

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check Mollie dashboard for payment status
3. Verify webhook URL is accessible
4. Check `credit_purchases` table for payment status

### Webhook not firing?

1. Verify webhook URL in Mollie dashboard
2. Check if URL is publicly accessible (not localhost)
3. Look for webhook logs in Laravel log
4. Test webhook manually with payment ID

### Credits not added?

1. Check `mollie_payment_status` in `credit_purchases` table
2. Look for errors in Laravel log
3. Check `credit_transactions` table
4. Verify user's credit balance in `users` table

### Common Errors

**"Invalid API key"**
- Check `.env` file has correct `MOLLIE_KEY`
- Run `php artisan config:clear`

**"Webhook URL not accessible"**
- Use ngrok for local testing
- Ensure production URL uses HTTPS

**"Payment not found"**
- Check payment ID in database matches Mollie
- Verify API key matches environment (test vs live)

---

## 📊 Database Schema

New fields in `credit_purchases` table:

```php
mollie_payment_id          // Mollie's payment ID (tr_xxxxx)
mollie_payment_status      // Current status (paid, pending, failed, etc.)
mollie_payment_data        // Full payment object from Mollie (JSON)
mollie_webhook_received_at // When webhook was last received
```

---

## 🔗 Useful Links

- **Mollie Dashboard:** https://www.mollie.com/dashboard
- **Mollie API Docs:** https://docs.mollie.com
- **Test Payment Methods:** https://docs.mollie.com/overview/testing
- **Webhook Guide:** https://docs.mollie.com/overview/webhooks
- **Laravel Mollie Package:** https://github.com/mollie/laravel-mollie

---

## 💡 Next Steps

### Optional Enhancements

1. **Email Notifications**
   - Send receipt after successful payment
   - Notify admin of new purchases

2. **Payment Method Selection**
   - Allow users to pre-select iDEAL bank
   - Show only specific payment methods

3. **Refunds**
   - Implement refund functionality via Mollie API
   - Add admin interface for refunds

4. **Recurring Payments**
   - Set up subscriptions for monthly packages
   - Use Mollie's subscription API

5. **Payment Analytics**
   - Track conversion rates
   - Monitor payment method preferences
   - Generate payment reports

---

## 🎉 You're All Set!

Your Yoga CRM now has professional payment processing with iDEAL and other methods. Students can purchase credits securely, and payments are processed automatically.

**Need help?** Check the troubleshooting section or review the code comments in the service classes.
