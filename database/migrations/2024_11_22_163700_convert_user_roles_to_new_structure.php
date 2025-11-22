<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration converts existing user roles to the new structure.
     * It must run AFTER the schema has been updated with the new role enum and is_admin column.
     */
    public function up(): void
    {
        // Only run if the is_admin column exists (schema has been updated)
        if (!Schema::hasColumn('users', 'is_admin')) {
            throw new \Exception('The is_admin column does not exist. Please run the schema migration first.');
        }

        // Get all users with old role values
        $users = DB::table('users')->get();

        foreach ($users as $user) {
            $updates = [];

            // Convert roles
            switch ($user->role) {
                case 'admin':
                    $updates['role'] = 'teacher';
                    $updates['is_admin'] = true;
                    break;
                case 'accountant':
                    $updates['role'] = 'teacher';
                    $updates['is_admin'] = true;
                    break;
                case 'pupil':
                    $updates['role'] = 'attendee';
                    break;
                case 'teacher':
                    // Keep as teacher, no changes needed
                    break;
                case 'attendee':
                    // Already converted, no changes needed
                    break;
            }

            // Apply updates if any
            if (!empty($updates)) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update($updates);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert teachers with is_admin back to admin
        DB::table('users')
            ->where('role', 'teacher')
            ->where('is_admin', true)
            ->update([
                'role' => 'admin',
                'is_admin' => false,
            ]);

        // Convert attendee back to pupil
        DB::table('users')
            ->where('role', 'attendee')
            ->update([
                'role' => 'pupil',
            ]);
    }
};
