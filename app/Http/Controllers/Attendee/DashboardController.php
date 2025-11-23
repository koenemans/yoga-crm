<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendee;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\WaitlistEntry;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected CreditService $creditService
    ) {}

    /**
     * Display the attendee dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->isAttendee()) {
            abort(403);
        }

        // Credit balance
        $creditBalance = $this->creditService->getBalance($user);

        // Next upcoming booking
        $nextBooking = Booking::with(['lesson.teacher'])
            ->where('user_id', $user->id)
            ->where('status', 'booked')
            ->whereHas('lesson', fn($q) => $q->where('start_datetime', '>=', now()))
            ->orderBy('created_at')
            ->first();

        // Recent bookings (last 5)
        $recentBookings = Booking::with(['lesson.teacher'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($booking) => [
                'id' => $booking->id,
                'lesson' => [
                    'id' => $booking->lesson->id,
                    'title' => $booking->lesson->title,
                    'teacher' => $booking->lesson->teacher->full_name,
                    'start_datetime' => $booking->lesson->start_datetime->format('M j, Y H:i'),
                    'location' => $booking->lesson->location,
                ],
                'status' => $booking->status,
                'credits_charged' => $booking->credits_charged,
                'booked_at' => $booking->booked_at->format('M j, Y'),
            ]);

        // Waitlist entries
        $waitlistEntries = WaitlistEntry::with(['lesson.teacher'])
            ->where('user_id', $user->id)
            ->whereHas('lesson', fn($q) => $q->where('start_datetime', '>=', now()))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($entry) => [
                'id' => $entry->id,
                'lesson' => [
                    'id' => $entry->lesson->id,
                    'title' => $entry->lesson->title,
                    'teacher' => $entry->lesson->teacher->full_name,
                    'start_datetime' => $entry->lesson->start_datetime->format('M j, Y H:i'),
                    'location' => $entry->lesson->location,
                ],
                'position' => $entry->position,
                'joined_at' => $entry->created_at->format('M j, Y'),
            ]);

        // Stats
        $stats = [
            'total_bookings' => Booking::where('user_id', $user->id)->count(),
            'attended_classes' => Booking::where('user_id', $user->id)
                ->where('status', 'attended')
                ->count(),
            'upcoming_bookings' => Booking::where('user_id', $user->id)
                ->where('status', 'booked')
                ->whereHas('lesson', fn($q) => $q->where('start_datetime', '>=', now()))
                ->count(),
            'waitlist_count' => $waitlistEntries->count(),
        ];

        return Inertia::render('attendee/dashboard', [
            'credit_balance' => $creditBalance,
            'next_booking' => $nextBooking ? [
                'id' => $nextBooking->id,
                'lesson' => [
                    'id' => $nextBooking->lesson->id,
                    'title' => $nextBooking->lesson->title,
                    'teacher' => $nextBooking->lesson->teacher->full_name,
                    'start_datetime' => $nextBooking->lesson->start_datetime->format('l, M j, Y \a\t H:i'),
                    'location' => $nextBooking->lesson->location,
                ],
            ] : null,
            'recent_bookings' => $recentBookings,
            'waitlist_entries' => $waitlistEntries,
            'stats' => $stats,
        ]);
    }
}
