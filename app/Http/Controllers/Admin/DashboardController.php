<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Lesson;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard.
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $stats = [
            'total_pupils' => User::where('role', 'pupil')->where('is_active', true)->count(),
            'total_teachers' => User::where('role', 'teacher')->where('is_active', true)->count(),
            'upcoming_lessons' => Lesson::where('status', 'active')
                ->where('start_datetime', '>=', now())
                ->where('start_datetime', '<=', now()->addDays(7))
                ->count(),
            'total_bookings_this_month' => Booking::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        $upcomingLessons = Lesson::with(['teacher', 'bookings'])
            ->where('status', 'active')
            ->where('start_datetime', '>=', now())
            ->orderBy('start_datetime')
            ->limit(10)
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'teacher' => $lesson->teacher->full_name,
                    'start_datetime' => $lesson->start_datetime,
                    'location' => $lesson->location,
                    'bookings_count' => $lesson->bookings()->count(),
                    'capacity' => $lesson->capacity,
                    'available_spots' => $lesson->available_spots,
                ];
            });

        $recentBookings = Booking::with(['user', 'lesson'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user' => $booking->user->full_name,
                    'lesson' => $booking->lesson->title,
                    'status' => $booking->status,
                    'created_at' => $booking->created_at,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'upcoming_lessons' => $upcomingLessons,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
