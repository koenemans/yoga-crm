<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the teacher dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->isTeacher()) {
            abort(403);
        }

        // Teacher stats
        $stats = [
            'total_lessons' => Lesson::where('teacher_id', $user->id)->count(),
            'upcoming_lessons' => Lesson::where('teacher_id', $user->id)
                ->where('status', 'active')
                ->where('start_datetime', '>=', now())
                ->count(),
            'total_students' => Booking::whereHas('lesson', fn($q) => $q->where('teacher_id', $user->id))
                ->distinct('user_id')
                ->count('user_id'),
            'total_bookings' => Booking::whereHas('lesson', fn($q) => $q->where('teacher_id', $user->id))
                ->count(),
            'attendance_rate' => $this->calculateAttendanceRate($user->id),
        ];

        // Next 3 upcoming lessons
        $upcomingLessons = Lesson::with('bookings')
            ->where('teacher_id', $user->id)
            ->where('status', 'active')
            ->where('start_datetime', '>=', now())
            ->orderBy('start_datetime')
            ->limit(3)
            ->get()
            ->map(fn($lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'start_datetime' => $lesson->start_datetime->format('l, M j, Y \a\t H:i'),
                'location' => $lesson->location,
                'bookings_count' => $lesson->bookings()->count(),
                'capacity' => $lesson->capacity,
                'available_spots' => $lesson->available_spots,
            ]);

        // Recent bookings across all teacher's lessons
        $recentBookings = Booking::with(['user', 'lesson'])
            ->whereHas('lesson', fn($q) => $q->where('teacher_id', $user->id))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($booking) => [
                'id' => $booking->id,
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->full_name,
                ],
                'lesson' => [
                    'id' => $booking->lesson->id,
                    'title' => $booking->lesson->title,
                    'start_datetime' => $booking->lesson->start_datetime->format('M j, Y H:i'),
                ],
                'status' => $booking->status,
                'booked_at' => $booking->booked_at->format('M j, Y'),
            ]);

        return Inertia::render('teacher/dashboard', [
            'stats' => $stats,
            'upcoming_lessons' => $upcomingLessons,
            'recent_bookings' => $recentBookings,
        ]);
    }

    /**
     * Calculate attendance rate for teacher's lessons.
     */
    private function calculateAttendanceRate(int $teacherId): float
    {
        $totalBookings = Booking::whereHas('lesson', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId)
                ->where('start_datetime', '<', now());
        })->count();

        if ($totalBookings === 0) {
            return 0;
        }

        $attendedBookings = Booking::whereHas('lesson', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId)
                ->where('start_datetime', '<', now());
        })->where('status', 'attended')->count();

        return round(($attendedBookings / $totalBookings) * 100, 1);
    }
}
