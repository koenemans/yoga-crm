<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\User;
use App\Notifications\LessonCancelled;
use App\Services\BookingService;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected CreditService $creditService
    ) {}

    /**
     * Display a listing of lessons.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Lesson::class);

        $query = Lesson::with(['teacher', 'bookings'])
            ->where('status', 'active')
            ->where('start_datetime', '>=', now())
            ->orderBy('start_datetime');

        if ($request->user()->isTeacher() && !$request->boolean('all')) {
            $query->where('teacher_id', $request->user()->id);
        }

        $lessons = $query->paginate(20)->through(function ($lesson) use ($request) {
            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'teacher' => [
                    'id' => $lesson->teacher->id,
                    'name' => $lesson->teacher->full_name,
                ],
                'location' => $lesson->location,
                'start_datetime' => $lesson->start_datetime,
                'end_datetime' => $lesson->end_datetime,
                'capacity' => $lesson->capacity,
                'credits_required' => $lesson->credits_required,
                'available_spots' => $lesson->available_spots,
                'is_full' => $lesson->isFull(),
                'waitlist_enabled' => $lesson->waitlist_enabled,
                'bookings_count' => $lesson->bookings()->count(),
                'user_booked' => $this->bookingService->hasBooking($request->user(), $lesson),
                'user_on_waitlist' => $this->bookingService->isOnWaitlist($request->user(), $lesson),
            ];
        });

        return Inertia::render('lessons/index', [
            'lessons' => $lessons,
            'user_credit_balance' => $this->creditService->getBalance($request->user()),
        ]);
    }

    /**
     * Show the form for creating a new lesson.
     */
    public function create()
    {
        $this->authorize('create', Lesson::class);

        $teachers = User::where('role', 'teacher')
            ->where('is_active', true)
            ->get(['id', 'first_name', 'last_name', 'name']);

        return Inertia::render('lessons/create', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Store a newly created lesson.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Lesson::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'teacher_id' => 'required|exists:users,id',
            'location' => 'required|string|max:255',
            'start_datetime' => 'required|date|after:now',
            'end_datetime' => 'required|date|after:start_datetime',
            'capacity' => 'required|integer|min:1',
            'credits_required' => 'required|integer|min:1',
            'waitlist_enabled' => 'boolean',
        ]);

        $lesson = Lesson::create($validated);

        return redirect()->route('lessons.show', $lesson)
            ->with('success', 'Lesson created successfully.');
    }

    /**
     * Display the specified lesson.
     */
    public function show(Request $request, Lesson $lesson)
    {
        $this->authorize('view', $lesson);

        $lesson->load(['teacher', 'bookings.user', 'waitlistEntries.user']);

        return Inertia::render('lessons/show', [
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'teacher' => [
                    'id' => $lesson->teacher->id,
                    'name' => $lesson->teacher->full_name,
                ],
                'location' => $lesson->location,
                'start_datetime' => $lesson->start_datetime,
                'end_datetime' => $lesson->end_datetime,
                'capacity' => $lesson->capacity,
                'credits_required' => $lesson->credits_required,
                'status' => $lesson->status,
                'waitlist_enabled' => $lesson->waitlist_enabled,
                'available_spots' => $lesson->available_spots,
                'is_full' => $lesson->isFull(),
                'bookings' => $lesson->bookings->map(fn($booking) => [
                    'id' => $booking->id,
                    'user' => [
                        'id' => $booking->user->id,
                        'name' => $booking->user->full_name,
                    ],
                    'status' => $booking->status,
                    'booked_at' => $booking->booked_at,
                ]),
                'waitlist' => $lesson->waitlistEntries->map(fn($entry) => [
                    'id' => $entry->id,
                    'user' => [
                        'id' => $entry->user->id,
                        'name' => $entry->user->full_name,
                    ],
                    'position' => $entry->position,
                ]),
            ],
            'user_credit_balance' => $this->creditService->getBalance($request->user()),
            'user_booked' => $this->bookingService->hasBooking($request->user(), $lesson),
            'user_on_waitlist' => $this->bookingService->isOnWaitlist($request->user(), $lesson),
            'can_manage' => $request->user()->can('update', $lesson),
        ]);
    }

    /**
     * Show the form for editing the lesson.
     */
    public function edit(Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $teachers = User::where('role', 'teacher')
            ->where('is_active', true)
            ->get(['id', 'first_name', 'last_name', 'name']);

        return Inertia::render('lessons/edit', [
            'lesson' => $lesson,
            'teachers' => $teachers,
        ]);
    }

    /**
     * Update the specified lesson.
     */
    public function update(Request $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'teacher_id' => 'required|exists:users,id',
            'location' => 'required|string|max:255',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'capacity' => 'required|integer|min:1',
            'credits_required' => 'required|integer|min:1',
            'waitlist_enabled' => 'boolean',
        ]);

        $lesson->update($validated);

        return redirect()->route('lessons.show', $lesson)
            ->with('success', 'Lesson updated successfully.');
    }

    /**
     * Cancel the specified lesson.
     */
    public function cancel(Lesson $lesson)
    {
        $this->authorize('delete', $lesson);

        DB::transaction(function () use ($lesson) {
            $lesson->update(['status' => 'cancelled']);

            // Refund all bookings
            foreach ($lesson->bookings()->where('status', 'booked')->get() as $booking) {
                $this->creditService->refundCredits(
                    $booking->user,
                    $booking->credits_charged,
                    "Refund for cancelled lesson: {$lesson->title}",
                    $booking,
                    auth()->user()
                );

                $booking->update([
                    'status' => 'cancelled_by_admin',
                    'cancelled_at' => now(),
                    'cancelled_by' => auth()->id(),
                ]);

                // Notify user
                $booking->user->notify(new LessonCancelled($lesson));
            }
        });

        return redirect()->route('lessons.index')
            ->with('success', 'Lesson cancelled and all bookings refunded.');
    }

    /**
     * Display students who have attended teacher's lessons.
     */
    public function myStudents(Request $request)
    {
        $user = $request->user();

        // Only teachers and admins can access
        if (!$user->isTeacher() && !$user->isAdmin()) {
            abort(403);
        }

        $query = User::where('role', 'pupil')
            ->whereHas('bookings.lesson', function ($q) use ($user) {
                if ($user->isTeacher()) {
                    $q->where('teacher_id', $user->id);
                }
            });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', "%{$search}%");
            });
        }

        $students = $query->paginate(20)->through(function ($student) use ($user) {
            $bookingsQuery = $student->bookings()->whereHas('lesson', function ($q) use ($user) {
                if ($user->isTeacher()) {
                    $q->where('teacher_id', $user->id);
                }
            });

            $totalBookings = $bookingsQuery->count();
            $attendedCount = (clone $bookingsQuery)->where('status', 'attended')->count();
            $noShowCount = (clone $bookingsQuery)->where('status', 'no_show')->count();
            $lastAttended = (clone $bookingsQuery)
                ->where('status', 'attended')
                ->latest('updated_at')
                ->first();

            $attendanceRate = $totalBookings > 0 
                ? round(($attendedCount / $totalBookings) * 100) 
                : 0;

            return [
                'id' => $student->id,
                'name' => $student->full_name,
                'email' => $student->email,
                'phone' => $student->phone,
                'total_bookings' => $totalBookings,
                'attended_count' => $attendedCount,
                'no_show_count' => $noShowCount,
                'last_attended' => $lastAttended?->updated_at,
                'attendance_rate' => $attendanceRate,
            ];
        });

        return Inertia::render('my-students/index', [
            'students' => $students,
            'filters' => $request->only('search'),
        ]);
    }
}
