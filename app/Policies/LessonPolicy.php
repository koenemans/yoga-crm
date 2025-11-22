<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    /**
     * Determine if the user can view any lessons.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view lessons
    }

    /**
     * Determine if the user can view the lesson.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        return true; // All authenticated users can view a lesson
    }

    /**
     * Determine if the user can create lessons.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isTeacher();
    }

    /**
     * Determine if the user can update the lesson.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin() || ($user->isTeacher() && $lesson->teacher_id === $user->id);
    }

    /**
     * Determine if the user can delete the lesson.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can manage attendance for the lesson.
     */
    public function manageAttendance(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin() || ($user->isTeacher() && $lesson->teacher_id === $user->id);
    }
}
