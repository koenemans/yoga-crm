<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CreditPurchase;
use App\Models\CreditTransaction;
use App\Models\SystemSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreditService
{
    /**
     * Get user's current credit balance.
     */
    public function getBalance(User $user): int
    {
        return $user->creditTransactions()
            ->notExpired()
            ->sum('credits');
    }

    /**
     * Add credits to user's account.
     */
    public function addCredits(
        User $user,
        int $credits,
        string $description,
        $transactionable = null,
        ?int $expiryDays = null,
        ?User $createdBy = null
    ): CreditTransaction {
        $expiresAt = null;
        
        if ($expiryDays !== null) {
            $expiresAt = Carbon::now()->addDays($expiryDays);
        }

        return CreditTransaction::create([
            'user_id' => $user->id,
            'credits' => $credits,
            'type' => 'purchase',
            'description' => $description,
            'transactionable_type' => $transactionable ? get_class($transactionable) : null,
            'transactionable_id' => $transactionable?->id,
            'expires_at' => $expiresAt,
            'created_by' => $createdBy?->id,
        ]);
    }

    /**
     * Deduct credits from user's account.
     */
    public function deductCredits(
        User $user,
        int $credits,
        string $description,
        $transactionable = null,
        ?User $createdBy = null
    ): CreditTransaction {
        if ($this->getBalance($user) < $credits) {
            throw new \Exception('Insufficient credits');
        }

        return CreditTransaction::create([
            'user_id' => $user->id,
            'credits' => -$credits,
            'type' => 'booking',
            'description' => $description,
            'transactionable_type' => $transactionable ? get_class($transactionable) : null,
            'transactionable_id' => $transactionable?->id,
            'created_by' => $createdBy?->id,
        ]);
    }

    /**
     * Refund credits to user's account.
     */
    public function refundCredits(
        User $user,
        int $credits,
        string $description,
        $transactionable = null,
        ?User $createdBy = null
    ): CreditTransaction {
        return CreditTransaction::create([
            'user_id' => $user->id,
            'credits' => $credits,
            'type' => 'refund',
            'description' => $description,
            'transactionable_type' => $transactionable ? get_class($transactionable) : null,
            'transactionable_id' => $transactionable?->id,
            'created_by' => $createdBy?->id,
        ]);
    }

    /**
     * Process credit purchase payment.
     */
    public function processPurchasePayment(
        CreditPurchase $purchase,
        ?User $confirmedBy = null
    ): void {
        DB::transaction(function () use ($purchase, $confirmedBy) {
            $purchase->update([
                'status' => 'paid',
                'paid_at' => now(),
                'confirmed_by' => $confirmedBy?->id,
            ]);

            $expiryDays = $purchase->creditPackage?->expiry_days 
                ?? SystemSetting::get('default_credit_expiry_days', 90);

            $this->addCredits(
                $purchase->user,
                $purchase->credits,
                "Credit purchase: {$purchase->payment_reference}",
                $purchase,
                $expiryDays,
                $confirmedBy
            );
        });
    }

    /**
     * Expire old credits.
     */
    public function expireCredits(): int
    {
        $expiredTransactions = CreditTransaction::expired()
            ->where('credits', '>', 0)
            ->get();

        $count = 0;

        foreach ($expiredTransactions as $transaction) {
            // Create expiry transaction
            CreditTransaction::create([
                'user_id' => $transaction->user_id,
                'credits' => -$transaction->credits,
                'type' => 'expiry',
                'description' => "Credits expired from transaction #{$transaction->id}",
                'transactionable_type' => get_class($transaction),
                'transactionable_id' => $transaction->id,
            ]);

            $count++;
        }

        return $count;
    }

    /**
     * Get credits expiring soon for a user.
     */
    public function getExpiringCredits(User $user, int $days = 30): array
    {
        $expiringDate = Carbon::now()->addDays($days);

        return $user->creditTransactions()
            ->where('credits', '>', 0)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $expiringDate)
            ->where('expires_at', '>', now())
            ->orderBy('expires_at')
            ->get()
            ->groupBy(function ($transaction) {
                return $transaction->expires_at->format('Y-m-d');
            })
            ->map(function ($transactions) {
                return [
                    'date' => $transactions->first()->expires_at,
                    'credits' => $transactions->sum('credits'),
                ];
            })
            ->values()
            ->toArray();
    }
}
