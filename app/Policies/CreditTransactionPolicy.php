<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CreditTransaction;
use App\Models\User;

class CreditTransactionPolicy
{
    /**
     * Determine if the user can view any credit transactions.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isAccountant() || $user->isTeacher();
    }

    /**
     * Determine if the user can view the credit transaction.
     */
    public function view(User $user, CreditTransaction $transaction): bool
    {
        return $user->isAdmin() 
            || $user->isAccountant()
            || $user->isTeacher()
            || $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can create credit transactions.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can update the credit transaction.
     */
    public function update(User $user, CreditTransaction $transaction): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the credit transaction.
     */
    public function delete(User $user, CreditTransaction $transaction): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can export credit transactions.
     */
    public function export(User $user): bool
    {
        return $user->isAdmin() || $user->isAccountant();
    }
}
