<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Finance;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CreditPurchase;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the accountant dashboard.
     */
    public function index()
    {
        $this->authorize('viewAny', CreditPurchase::class);

        // Current month revenue
        $currentMonthRevenue = CreditPurchase::where('status', 'paid')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->sum('price');

        // Previous month revenue
        $previousMonthRevenue = CreditPurchase::where('status', 'paid')
            ->whereMonth('paid_at', now()->subMonth()->month)
            ->whereYear('paid_at', now()->subMonth()->year)
            ->sum('price');

        // Year to date revenue
        $ytdRevenue = CreditPurchase::where('status', 'paid')
            ->whereYear('paid_at', now()->year)
            ->sum('price');

        // Pending purchases
        $pendingPurchases = CreditPurchase::where('status', 'pending')->count();
        $pendingAmount = CreditPurchase::where('status', 'pending')->sum('price');

        // Active students with credits
        $activeStudents = User::where('role', 'attendee')
            ->where('is_active', true)
            ->whereHas('creditTransactions', fn($q) => $q->where('credits', '>', 0))
            ->count();

        // Total bookings this month
        $monthlyBookings = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return Inertia::render('admin/finance/dashboard', [
            'stats' => [
                'current_month_revenue' => $currentMonthRevenue,
                'previous_month_revenue' => $previousMonthRevenue,
                'ytd_revenue' => $ytdRevenue,
                'pending_purchases' => $pendingPurchases,
                'pending_amount' => $pendingAmount,
                'active_students' => $activeStudents,
                'monthly_bookings' => $monthlyBookings,
            ],
        ]);
    }
}
