<?php

declare(strict_types=1);

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\CreditPurchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display a listing of credit purchases.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', CreditPurchase::class);

        $query = CreditPurchase::with(['user', 'creditPackage', 'confirmedByUser']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $purchases = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'user' => [
                        'id' => $purchase->user->id,
                        'name' => $purchase->user->full_name,
                        'email' => $purchase->user->email,
                    ],
                    'package' => $purchase->creditPackage?->name,
                    'credits' => $purchase->credits,
                    'price' => $purchase->price,
                    'status' => $purchase->status,
                    'payment_reference' => $purchase->payment_reference,
                    'payment_method' => $purchase->payment_method,
                    'confirmed_by' => $purchase->confirmedByUser?->full_name,
                    'created_at' => $purchase->created_at->format('M j, Y H:i'),
                    'paid_at' => $purchase->paid_at?->format('M j, Y H:i'),
                ];
            });

        // Summary statistics
        $totalRevenue = CreditPurchase::where('status', 'paid')
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('paid_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('paid_at', '<=', $request->date_to))
            ->sum('price');

        $totalPending = CreditPurchase::where('status', 'pending')
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->sum('price');

        return Inertia::render('accountant/purchases/index', [
            'purchases' => $purchases,
            'filters' => $request->only(['status', 'payment_method', 'date_from', 'date_to', 'search']),
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_pending' => $totalPending,
            ],
        ]);
    }

    /**
     * Display the specified purchase.
     */
    public function show(CreditPurchase $purchase)
    {
        $this->authorize('view', $purchase);

        $purchase->load(['user', 'creditPackage', 'confirmedByUser', 'transactions']);

        return Inertia::render('accountant/purchases/show', [
            'purchase' => [
                'id' => $purchase->id,
                'user' => [
                    'id' => $purchase->user->id,
                    'name' => $purchase->user->full_name,
                    'email' => $purchase->user->email,
                ],
                'package' => $purchase->creditPackage ? [
                    'id' => $purchase->creditPackage->id,
                    'name' => $purchase->creditPackage->name,
                    'description' => $purchase->creditPackage->description,
                ] : null,
                'credits' => $purchase->credits,
                'price' => $purchase->price,
                'status' => $purchase->status,
                'payment_reference' => $purchase->payment_reference,
                'payment_method' => $purchase->payment_method,
                'confirmed_by' => $purchase->confirmedByUser?->full_name,
                'created_at' => $purchase->created_at->format('M j, Y H:i'),
                'paid_at' => $purchase->paid_at?->format('M j, Y H:i'),
                'transactions' => $purchase->transactions->map(fn($t) => [
                    'id' => $t->id,
                    'credits' => $t->credits,
                    'type' => $t->type,
                    'description' => $t->description,
                    'created_at' => $t->created_at->format('M j, Y H:i'),
                ]),
            ],
        ]);
    }
}
