<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class CreditPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'credit_package_id',
        'credits',
        'price',
        'status',
        'payment_reference',
        'payment_method',
        'paid_at',
        'confirmed_by',
        'mollie_payment_id',
        'mollie_payment_status',
        'mollie_payment_data',
        'mollie_webhook_received_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'paid_at' => 'datetime',
            'mollie_payment_data' => 'array',
            'mollie_webhook_received_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($purchase) {
            if (empty($purchase->payment_reference)) {
                $purchase->payment_reference = 'PAY-' . strtoupper(Str::random(12));
            }
        });
    }

    /**
     * Get the user who made this purchase.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the credit package purchased.
     */
    public function creditPackage(): BelongsTo
    {
        return $this->belongsTo(CreditPackage::class);
    }

    /**
     * Get the user who confirmed this purchase.
     */
    public function confirmedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /**
     * Get credit transactions for this purchase.
     */
    public function transactions(): MorphMany
    {
        return $this->morphMany(CreditTransaction::class, 'transactionable');
    }

    /**
     * Check if purchase is paid.
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Check if purchase is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if purchase has a Mollie payment.
     */
    public function hasMolliePayment(): bool
    {
        return !empty($this->mollie_payment_id);
    }

    /**
     * Get the Mollie payment URL if available.
     */
    public function getMolliePaymentUrl(): ?string
    {
        return $this->mollie_payment_data['_links']['checkout']['href'] ?? null;
    }
}
