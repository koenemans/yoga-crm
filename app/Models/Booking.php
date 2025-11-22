<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'status',
        'credits_charged',
        'booked_at',
        'cancelled_at',
        'attended_at',
        'cancelled_by',
        'marked_attended_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'booked_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'attended_at' => 'datetime',
        ];
    }

    /**
     * Get the user who made this booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lesson for this booking.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the user who cancelled this booking.
     */
    public function cancelledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    /**
     * Get the user who marked attendance.
     */
    public function markedAttendedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_attended_by');
    }

    /**
     * Get credit transactions for this booking.
     */
    public function transactions(): MorphMany
    {
        return $this->morphMany(CreditTransaction::class, 'transactionable');
    }

    /**
     * Check if booking is confirmed.
     */
    public function isBooked(): bool
    {
        return $this->status === 'booked';
    }

    /**
     * Check if booking is cancelled.
     */
    public function isCancelled(): bool
    {
        return in_array($this->status, ['cancelled_by_pupil', 'cancelled_by_admin']);
    }

    /**
     * Check if user attended.
     */
    public function isAttended(): bool
    {
        return $this->status === 'attended';
    }

    /**
     * Check if user was a no-show.
     */
    public function isNoShow(): bool
    {
        return $this->status === 'no_show';
    }
}
