<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_series_id',
        'title',
        'description',
        'teacher_id',
        'location',
        'start_datetime',
        'end_datetime',
        'capacity',
        'credits_required',
        'status',
        'waitlist_enabled',
    ];

    protected function casts(): array
    {
        return [
            'start_datetime' => 'datetime',
            'end_datetime' => 'datetime',
            'waitlist_enabled' => 'boolean',
        ];
    }

    /**
     * Get the teacher for this lesson.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the lesson series this lesson belongs to.
     */
    public function lessonSeries(): BelongsTo
    {
        return $this->belongsTo(LessonSeries::class);
    }

    /**
     * Get bookings for this lesson.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get confirmed bookings for this lesson.
     */
    public function confirmedBookings(): HasMany
    {
        return $this->hasMany(Booking::class)->where('status', 'booked');
    }

    /**
     * Get waitlist entries for this lesson.
     */
    public function waitlistEntries(): HasMany
    {
        return $this->hasMany(WaitlistEntry::class)->where('status', 'waiting')->orderBy('position');
    }

    /**
     * Check if lesson is full.
     */
    public function isFull(): bool
    {
        return $this->confirmedBookings()->count() >= $this->capacity;
    }

    /**
     * Get available spots.
     */
    public function getAvailableSpotsAttribute(): int
    {
        return max(0, $this->capacity - $this->confirmedBookings()->count());
    }

    /**
     * Check if lesson is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if lesson is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}
