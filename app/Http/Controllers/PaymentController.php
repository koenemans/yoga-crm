<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use App\Models\CreditPurchase;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Show the payment page for a credit package.
     */
    public function create(CreditPackage $package): Response
    {
        return Inertia::render('Payment/Create', [
            'package' => $package,
        ]);
    }

    /**
     * Create a new payment.
     */
    public function store(Request $request, CreditPackage $package): RedirectResponse
    {
        $validated = $request->validate([
            'payment_method' => 'nullable|string|in:ideal,creditcard,bancontact,paypal',
        ]);

        // Create the purchase record
        $purchase = CreditPurchase::create([
            'user_id' => $request->user()->id,
            'credit_package_id' => $package->id,
            'credits' => $package->credits,
            'price' => $package->price,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? null,
        ]);

        // Create Mollie payment
        $redirectUrl = route('payment.return', ['purchase' => $purchase->id]);
        $purchase = $this->paymentService->createPayment($purchase, $redirectUrl);

        // Redirect to Mollie checkout
        $checkoutUrl = $purchase->getMolliePaymentUrl();

        if (!$checkoutUrl) {
            return back()->with('error', 'Failed to create payment. Please try again.');
        }

        return redirect()->away($checkoutUrl);
    }

    /**
     * Handle return from Mollie payment.
     */
    public function return(Request $request, CreditPurchase $purchase): RedirectResponse
    {
        // Verify the purchase belongs to the authenticated user
        if ($purchase->user_id !== $request->user()->id) {
            abort(403);
        }

        // Refresh payment status from Mollie
        if ($purchase->hasMolliePayment()) {
            $status = $this->paymentService->getPaymentStatus($purchase->mollie_payment_id);
            $purchase->update(['mollie_payment_status' => $status]);
        }

        // Redirect based on payment status
        if ($purchase->isPaid()) {
            return redirect()->route('dashboard')
                ->with('success', 'Payment successful! Your credits have been added.');
        }

        if ($purchase->mollie_payment_status === 'pending') {
            return redirect()->route('dashboard')
                ->with('info', 'Payment is being processed. You will receive your credits shortly.');
        }

        return redirect()->route('dashboard')
            ->with('error', 'Payment was not completed. Please try again.');
    }

    /**
     * Show payment status page.
     */
    public function show(Request $request, CreditPurchase $purchase): Response
    {
        // Verify the purchase belongs to the authenticated user
        if ($purchase->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Payment/Show', [
            'purchase' => $purchase->load('creditPackage'),
        ]);
    }
}
