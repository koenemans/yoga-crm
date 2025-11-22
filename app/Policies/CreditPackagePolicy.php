<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CreditPackage;
use App\Models\User;

class CreditPackagePolicy
{
    /**
     * Determine if the user can view any credit packages.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view packages
    }

    /**
     * Determine if the user can view the credit package.
     */
    public function view(User $user, CreditPackage $package): bool
    {
        return true; // All authenticated users can view a package
    }

    /**
     * Determine if the user can create credit packages.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can update the credit package.
     */
    public function update(User $user, CreditPackage $package): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the credit package.
     */
    public function delete(User $user, CreditPackage $package): bool
    {
        return $user->isAdmin();
    }
}
