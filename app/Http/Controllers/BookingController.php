<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Lesson;
use App\Services\BookingService;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected CreditService $creditService
    ) {}

    /**
     * Display user's bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['lesson.teacher'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        $bookings = $query->paginate(20)->through(function ($booking) {
            return [
                'id' => $booking->id,
                'lesson' => [
                    'id' => $booking->lesson->id,
                    'title' => $booking->lesson->title,
                    'teacher' => $booking->lesson->teacher->full_name,
                    'location' => $booking->lesson->location,
                    'start_datetime' => $booking->lesson->start_datetime,
                    'end_datetime' => $booking->lesson->end_datetime,
                ],
                'status' => $booking->status,
                'credits_charged' => $booking->credits_charged,
                'booked_at' => $booking->booked_at,
                'cancelled_at' => $booking->cancelled_at,
                'can_cancel' => $booking->isBooked() && $booking->lesson->start_datetime->isFuture(),
            ];
        });

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'credit_balance' => $this->creditService->getBalance($request->user()),
        ]);
    }

    /**
     * Book a lesson.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        $lesson = Lesson::findOrFail($validated['lesson_id']);

        try {
            $booking = $this->bookingService->bookLesson($request->user(), $lesson);

            return redirect()->route('bookings.index')
                ->with('success', 'Lesson booked successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Cancel a booking.
     */
    public function destroy(Request $request, Booking $booking)
    {
        $this->authorize('cancel', $booking);

        try {
            $this->bookingService->cancelBooking(
                $booking,
                $request->user(),
                $request->user()->isAdmin()
            );

            return back()->with('success', 'Booking cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Mark attendance for a booking.
     */
    public function markAttendance(Request $request, Booking $booking)
    {
        $lesson = $booking->lesson;
        $this->authorize('manageAttendance', $lesson);

        $validated = $request->validate([
            'attended' => 'required|boolean',
        ]);

        $this->bookingService->markAttendance(
            $booking,
            $validated['attended'],
            $request->user()
        );

        return back()->with('success', 'Attendance marked successfully.');
    }
}
