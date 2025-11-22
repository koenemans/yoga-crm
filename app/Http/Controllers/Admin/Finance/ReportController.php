<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Finance;

use App\Helpers\DatabaseHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CreditPurchase;
use App\Models\CreditTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', CreditPurchase::class);

        $dateFrom = $request->input('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfMonth()->toDateString());

        return Inertia::render('admin/finance/reports/index', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Generate revenue report.
     */
    public function revenue(Request $request)
    {
        $this->authorize('viewAny', CreditPurchase::class);

        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'group_by' => 'nullable|in:day,week,month',
        ]);

        $dateFrom = $validated['date_from'];
        $dateTo = $validated['date_to'];
        $groupBy = $validated['group_by'] ?? 'day';

        // Revenue over time - database agnostic date formatting
        $revenueOverTime = CreditPurchase::where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->select(
                DB::raw(DatabaseHelper::dateFormat('paid_at', $groupBy) . ' as period'),
                DB::raw('SUM(price) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Revenue by payment method
        $revenueByMethod = CreditPurchase::where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->select('payment_method', DB::raw('SUM(price) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->get();

        // Revenue by package
        $revenueByPackage = CreditPurchase::with('creditPackage')
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->get()
            ->groupBy(fn($p) => $p->creditPackage?->name ?? 'Manual')
            ->map(fn($group) => [
                'total' => $group->sum('price'),
                'count' => $group->count(),
                'credits' => $group->sum('credits'),
            ]);

        // Top customers
        $topCustomers = CreditPurchase::with('user')
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->select('user_id', DB::raw('SUM(price) as total'), DB::raw('COUNT(*) as purchases'))
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'user' => [
                    'id' => $p->user->id,
                    'name' => $p->user->full_name,
                    'email' => $p->user->email,
                ],
                'total' => $p->total,
                'purchases' => $p->purchases,
            ]);

        // Summary
        $totalRevenue = CreditPurchase::where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->sum('price');

        $totalPurchases = CreditPurchase::where('status', 'paid')
            ->whereBetween('paid_at', [$dateFrom, $dateTo])
            ->count();

        $averageTransaction = $totalPurchases > 0 ? $totalRevenue / $totalPurchases : 0;

        return response()->json([
            'revenue_over_time' => $revenueOverTime,
            'revenue_by_method' => $revenueByMethod,
            'revenue_by_package' => $revenueByPackage,
            'top_customers' => $topCustomers,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_purchases' => $totalPurchases,
                'average_transaction' => round($averageTransaction, 2),
            ],
        ]);
    }

    /**
     * Export purchases to CSV.
     */
    public function exportPurchases(Request $request)
    {
        $this->authorize('export', CreditPurchase::class);

        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'status' => 'nullable|in:pending,paid,cancelled',
        ]);

        $query = CreditPurchase::with(['user', 'creditPackage', 'confirmedByUser'])
            ->whereBetween('created_at', [$validated['date_from'], $validated['date_to']]);

        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $purchases = $query->orderBy('created_at')->get();

        $csv = "ID,Date,User,Email,Package,Credits,Price,Status,Payment Method,Payment Reference,Confirmed By,Paid At\n";

        foreach ($purchases as $purchase) {
            $csv .= implode(',', [
                $purchase->id,
                $purchase->created_at->format('Y-m-d H:i:s'),
                '"' . $purchase->user->full_name . '"',
                $purchase->user->email,
                '"' . ($purchase->creditPackage?->name ?? 'Manual') . '"',
                $purchase->credits,
                $purchase->price,
                $purchase->status,
                $purchase->payment_method ?? '',
                $purchase->payment_reference,
                '"' . ($purchase->confirmedByUser?->full_name ?? '') . '"',
                $purchase->paid_at?->format('Y-m-d H:i:s') ?? '',
            ]) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="purchases_' . now()->format('Y-m-d') . '.csv"');
    }

    /**
     * Export transactions to CSV.
     */
    public function exportTransactions(Request $request)
    {
        $this->authorize('export', CreditTransaction::class);

        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'type' => 'nullable|in:purchase,booking,refund,expiry,adjustment',
        ]);

        $query = CreditTransaction::with(['user', 'creator'])
            ->whereBetween('created_at', [$validated['date_from'], $validated['date_to']]);

        if (isset($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        $transactions = $query->orderBy('created_at')->get();

        $csv = "ID,Date,User,Email,Credits,Type,Description,Expires At,Created By\n";

        foreach ($transactions as $transaction) {
            $csv .= implode(',', [
                $transaction->id,
                $transaction->created_at->format('Y-m-d H:i:s'),
                '"' . $transaction->user->full_name . '"',
                $transaction->user->email,
                $transaction->credits,
                $transaction->type,
                '"' . $transaction->description . '"',
                $transaction->expires_at?->format('Y-m-d') ?? '',
                '"' . ($transaction->creator?->full_name ?? 'System') . '"',
            ]) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="transactions_' . now()->format('Y-m-d') . '.csv"');
    }
}
