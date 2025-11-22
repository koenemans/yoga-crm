<?php

declare(strict_types=1);

namespace App\Http\Controllers\Accountant;

use App\Helpers\DatabaseHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CreditPurchase;
use App\Models\CreditTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
        $activeStudents = User::where('role', 'pupil')
            ->where('is_active', true)
            ->whereHas('creditTransactions', fn($q) => $q->where('credits', '>', 0))
            ->count();

        // Revenue by payment method (current month)
        $revenueByMethod = CreditPurchase::where('status', 'paid')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->select('payment_method', DB::raw('SUM(price) as total'))
            ->groupBy('payment_method')
            ->get()
            ->mapWithKeys(fn($item) => [$item->payment_method ?? 'unknown' => $item->total]);

        // Revenue by package (current month)
        $revenueByPackage = CreditPurchase::with('creditPackage')
            ->where('status', 'paid')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->get()
            ->groupBy(fn($purchase) => $purchase->creditPackage?->name ?? 'Manual')
            ->map(fn($group) => $group->sum('price'));

        // Recent transactions
        $recentTransactions = CreditTransaction::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'user' => [
                    'id' => $t->user->id,
                    'name' => $t->user->full_name,
                ],
                'credits' => $t->credits,
                'type' => $t->type,
                'description' => $t->description,
                'created_at' => $t->created_at->format('M j, Y H:i'),
            ]);

        // Monthly revenue trend (last 6 months)
        $monthlyRevenue = CreditPurchase::where('status', 'paid')
            ->where('paid_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw(DatabaseHelper::dateFormat('paid_at', 'month') . ' as month'),
                DB::raw('SUM(price) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(fn($item) => [$item->month => $item->total]);

        // Total bookings this month
        $monthlyBookings = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return Inertia::render('accountant/dashboard', [
            'stats' => [
                'current_month_revenue' => $currentMonthRevenue,
                'previous_month_revenue' => $previousMonthRevenue,
                'ytd_revenue' => $ytdRevenue,
                'pending_purchases' => $pendingPurchases,
                'pending_amount' => $pendingAmount,
                'active_students' => $activeStudents,
                'monthly_bookings' => $monthlyBookings,
            ],
            'revenue_by_method' => $revenueByMethod,
            'revenue_by_package' => $revenueByPackage,
            'recent_transactions' => $recentTransactions,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }
}
