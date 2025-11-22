<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Booking;
use App\Models\Lesson;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\WaitlistEntry;
use App\Notifications\BookingCancelled;
use App\Notifications\BookingConfirmed;
use App\Notifications\WaitlistPromoted;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        protected CreditService $creditService
    ) {}

    /**
     * Book a lesson for a user.
     */
    public function bookLesson(User $user, Lesson $lesson, ?User $bookedBy = null): Booking
    {
        if (!$lesson->isActive()) {
            throw new \Exception('Lesson is not active');
        }

        // Check if already booked
        if ($this->hasBooking($user, $lesson)) {
            throw new \Exception('Already booked for this lesson');
        }

        // Check if lesson is full
        if ($lesson->isFull()) {
            throw new \Exception('Lesson is full');
        }

        // Check credits
        if ($this->creditService->getBalance($user) < $lesson->credits_required) {
            throw new \Exception('Insufficient credits');
        }

        return DB::transaction(function () use ($user, $lesson, $bookedBy) {
            // Deduct credits
            $this->creditService->deductCredits(
                $user,
                $lesson->credits_required,
                "Booking for lesson: {$lesson->title}",
                null,
                $bookedBy
            );

            // Create booking
            $booking = Booking::create([
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
                'status' => 'booked',
                'credits_charged' => $lesson->credits_required,
                'booked_at' => now(),
            ]);

            // Send notification
            $user->notify(new BookingConfirmed($booking));

            return $booking;
        });
    }

    /**
     * Cancel a booking.
     */
    public function cancelBooking(
        Booking $booking,
        ?User $cancelledBy = null,
        bool $byAdmin = false
    ): void {
        if ($booking->isCancelled()) {
            throw new \Exception('Booking is already cancelled');
        }

        $refundCredits = $this->shouldRefundCredits($booking, $byAdmin);

        DB::transaction(function () use ($booking, $cancelledBy, $byAdmin, $refundCredits) {
            // Update booking status
            $booking->update([
                'status' => $byAdmin ? 'cancelled_by_admin' : 'cancelled_by_pupil',
                'cancelled_at' => now(),
                'cancelled_by' => $cancelledBy?->id,
            ]);

            // Refund credits if applicable
            if ($refundCredits) {
                $this->creditService->refundCredits(
                    $booking->user,
                    $booking->credits_charged,
                    "Refund for cancelled lesson: {$booking->lesson->title}",
                    $booking,
                    $cancelledBy
                );
            }

            // Send notification
            $booking->user->notify(new BookingCancelled($booking, $refundCredits));

            // Try to promote from waitlist
            $this->promoteFromWaitlist($booking->lesson);
        });
    }

    /**
     * Add user to waitlist.
     */
    public function addToWaitlist(User $user, Lesson $lesson): WaitlistEntry
    {
        if (!$lesson->waitlist_enabled) {
            throw new \Exception('Waitlist is not enabled for this lesson');
        }

        if ($this->hasBooking($user, $lesson)) {
            throw new \Exception('Already booked for this lesson');
        }

        if ($this->isOnWaitlist($user, $lesson)) {
            throw new \Exception('Already on waitlist for this lesson');
        }

        $position = $lesson->waitlistEntries()->count() + 1;

        return WaitlistEntry::create([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'position' => $position,
            'status' => 'waiting',
        ]);
    }

    /**
     * Promote user from waitlist to booking.
     */
    protected function promoteFromWaitlist(Lesson $lesson): ?Booking
    {
        if ($lesson->isFull()) {
            return null;
        }

        $waitlistEntry = $lesson->waitlistEntries()->first();

        if (!$waitlistEntry) {
            return null;
        }

        $user = $waitlistEntry->user;

        // Check if user has enough credits
        if ($this->creditService->getBalance($user) < $lesson->credits_required) {
            // Skip this user and try next
            $waitlistEntry->update(['status' => 'expired']);
            return $this->promoteFromWaitlist($lesson);
        }

        return DB::transaction(function () use ($waitlistEntry, $user, $lesson) {
            // Update waitlist entry
            $waitlistEntry->update([
                'status' => 'promoted',
                'promoted_at' => now(),
            ]);

            // Create booking
            $booking = $this->bookLesson($user, $lesson);

            // Send notification
            $user->notify(new WaitlistPromoted($booking));

            return $booking;
        });
    }

    /**
     * Mark attendance for a booking.
     */
    public function markAttendance(
        Booking $booking,
        bool $attended,
        ?User $markedBy = null
    ): void {
        $booking->update([
            'status' => $attended ? 'attended' : 'no_show',
            'attended_at' => $attended ? now() : null,
            'marked_attended_by' => $markedBy?->id,
        ]);
    }

    /**
     * Check if user has a booking for a lesson.
     */
    public function hasBooking(User $user, Lesson $lesson): bool
    {
        return Booking::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->whereIn('status', ['booked', 'attended'])
            ->exists();
    }

    /**
     * Check if user is on waitlist for a lesson.
     */
    public function isOnWaitlist(User $user, Lesson $lesson): bool
    {
        return WaitlistEntry::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->where('status', 'waiting')
            ->exists();
    }

    /**
     * Determine if credits should be refunded for cancellation.
     */
    protected function shouldRefundCredits(Booking $booking, bool $byAdmin): bool
    {
        if ($byAdmin) {
            return true; // Always refund if cancelled by admin
        }

        $cutoffHours = SystemSetting::get('cancellation_cutoff_hours', 24);
        $cutoffTime = Carbon::parse($booking->lesson->start_datetime)
            ->subHours($cutoffHours);

        return now()->isBefore($cutoffTime);
    }
}
