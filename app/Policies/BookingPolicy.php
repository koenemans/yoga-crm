<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Determine if the user can view any bookings.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the booking.
     */
    public function view(User $user, Booking $booking): bool
    {
        return $user->isAdmin() 
            || $user->id === $booking->user_id 
            || ($user->isTeacher() && $booking->lesson->teacher_id === $user->id);
    }

    /**
     * Determine if the user can create bookings.
     */
    public function create(User $user): bool
    {
        return $user->isPupil() || $user->isAdmin();
    }

    /**
     * Determine if the user can update the booking.
     */
    public function update(User $user, Booking $booking): bool
    {
        return $user->isAdmin() || ($user->isTeacher() && $booking->lesson->teacher_id === $user->id);
    }

    /**
     * Determine if the user can cancel the booking.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        return $user->isAdmin() 
            || $user->id === $booking->user_id 
            || ($user->isTeacher() && $booking->lesson->teacher_id === $user->id);
    }

    /**
     * Determine if the user can delete the booking.
     */
    public function delete(User $user, Booking $booking): bool
    {
        return $user->isAdmin();
    }
}
