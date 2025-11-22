<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CreditPurchase;
use App\Models\User;

class CreditPurchasePolicy
{
    /**
     * Determine if the user can view any credit purchases.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isAccountant();
    }

    /**
     * Determine if the user can view the credit purchase.
     */
    public function view(User $user, CreditPurchase $purchase): bool
    {
        return $user->isAdmin() 
            || $user->isAccountant()
            || $user->id === $purchase->user_id;
    }

    /**
     * Determine if the user can create credit purchases.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can purchase credits
    }

    /**
     * Determine if the user can update the credit purchase.
     */
    public function update(User $user, CreditPurchase $purchase): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can confirm payment for the credit purchase.
     */
    public function confirmPayment(User $user, CreditPurchase $purchase): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the credit purchase.
     */
    public function delete(User $user, CreditPurchase $purchase): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can export credit purchases.
     */
    public function export(User $user): bool
    {
        return $user->isAdmin() || $user->isAccountant();
    }
}
