<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CreditPurchase;
use App\Models\CreditTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mollie\Laravel\Facades\Mollie;

class PaymentService
{
    /**
     * Create a Mollie payment for a credit purchase.
     */
    public function createPayment(CreditPurchase $purchase, string $redirectUrl): CreditPurchase
    {
        $payment = Mollie::api()->payments->create([
            'amount' => [
                'currency' => 'EUR',
                'value' => number_format((float) $purchase->price, 2, '.', ''),
            ],
            'description' => "Credit Package: {$purchase->creditPackage->name}",
            'redirectUrl' => $redirectUrl,
            'webhookUrl' => route('mollie.webhook'),
            'metadata' => [
                'purchase_id' => $purchase->id,
                'user_id' => $purchase->user_id,
            ],
            'method' => null, // Allow all payment methods (iDEAL, credit card, etc.)
        ]);

        $purchase->update([
            'mollie_payment_id' => $payment->id,
            'mollie_payment_status' => $payment->status,
            'mollie_payment_data' => json_decode(json_encode($payment), true),
        ]);

        Log::info('Mollie payment created', [
            'purchase_id' => $purchase->id,
            'mollie_payment_id' => $payment->id,
        ]);

        return $purchase->fresh();
    }

    /**
     * Handle Mollie webhook notification.
     */
    public function handleWebhook(string $paymentId): void
    {
        $payment = Mollie::api()->payments->get($paymentId);

        $purchase = CreditPurchase::where('mollie_payment_id', $paymentId)->firstOrFail();

        $purchase->update([
            'mollie_payment_status' => $payment->status,
            'mollie_payment_data' => json_decode(json_encode($payment), true),
            'mollie_webhook_received_at' => now(),
        ]);

        Log::info('Mollie webhook received', [
            'purchase_id' => $purchase->id,
            'mollie_payment_id' => $paymentId,
            'status' => $payment->status,
        ]);

        // Handle payment status
        match ($payment->status) {
            'paid' => $this->handlePaidPayment($purchase, $payment),
            'failed', 'canceled', 'expired' => $this->handleFailedPayment($purchase, $payment),
            default => null,
        };
    }

    /**
     * Handle a successful payment.
     */
    protected function handlePaidPayment(CreditPurchase $purchase, $payment): void
    {
        if ($purchase->isPaid()) {
            Log::info('Purchase already marked as paid', ['purchase_id' => $purchase->id]);
            return;
        }

        DB::transaction(function () use ($purchase, $payment) {
            // Update purchase status
            $purchase->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $payment->method ?? 'mollie',
            ]);

            // Create credit transaction
            CreditTransaction::create([
                'user_id' => $purchase->user_id,
                'transactionable_type' => CreditPurchase::class,
                'transactionable_id' => $purchase->id,
                'type' => 'purchase',
                'credits' => $purchase->credits,
                'balance_after' => $purchase->user->credits + $purchase->credits,
                'description' => "Purchase: {$purchase->creditPackage->name}",
            ]);

            // Update user credits
            $purchase->user->increment('credits', $purchase->credits);

            Log::info('Payment processed successfully', [
                'purchase_id' => $purchase->id,
                'credits_added' => $purchase->credits,
            ]);
        });
    }

    /**
     * Handle a failed payment.
     */
    protected function handleFailedPayment(CreditPurchase $purchase, $payment): void
    {
        $purchase->update([
            'status' => 'failed',
        ]);

        Log::warning('Payment failed', [
            'purchase_id' => $purchase->id,
            'mollie_payment_id' => $payment->id,
            'status' => $payment->status,
        ]);
    }

    /**
     * Get payment status from Mollie.
     */
    public function getPaymentStatus(string $paymentId): string
    {
        $payment = Mollie::api()->payments->get($paymentId);
        return $payment->status;
    }

    /**
     * Check if a payment is paid.
     */
    public function isPaymentPaid(string $paymentId): bool
    {
        return $this->getPaymentStatus($paymentId) === 'paid';
    }
}
