<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\WaitlistEntry;
use App\Services\BookingService;
use Illuminate\Http\Request;

class WaitlistController extends Controller
{
    public function __construct(
        protected BookingService $bookingService
    ) {}

    /**
     * Add user to waitlist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        $lesson = Lesson::findOrFail($validated['lesson_id']);

        try {
            $this->bookingService->addToWaitlist($request->user(), $lesson);

            return back()->with('success', 'Added to waitlist successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove user from waitlist.
     */
    public function destroy(WaitlistEntry $waitlistEntry)
    {
        if ($waitlistEntry->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $waitlistEntry->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return back()->with('success', 'Removed from waitlist.');
    }
}
