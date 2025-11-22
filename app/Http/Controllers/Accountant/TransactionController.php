<?php

declare(strict_types=1);

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\CreditTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of credit transactions.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', CreditTransaction::class);

        $query = CreditTransaction::with(['user', 'creator', 'transactionable']);

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by user name or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter expired/active
        if ($request->filled('status')) {
            if ($request->status === 'expired') {
                $query->expired();
            } elseif ($request->status === 'active') {
                $query->notExpired();
            }
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'user' => [
                        'id' => $transaction->user->id,
                        'name' => $transaction->user->full_name,
                        'email' => $transaction->user->email,
                    ],
                    'credits' => $transaction->credits,
                    'type' => $transaction->type,
                    'description' => $transaction->description,
                    'transactionable_type' => class_basename($transaction->transactionable_type),
                    'expires_at' => $transaction->expires_at?->format('M j, Y'),
                    'is_expired' => $transaction->expires_at && $transaction->expires_at->isPast(),
                    'created_by' => $transaction->creator?->full_name,
                    'created_at' => $transaction->created_at->format('M j, Y H:i'),
                ];
            });

        // Summary statistics
        $totalCreditsIssued = CreditTransaction::where('credits', '>', 0)
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->sum('credits');

        $totalCreditsUsed = CreditTransaction::where('credits', '<', 0)
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->sum('credits');

        $expiredCredits = CreditTransaction::expired()
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->where('credits', '>', 0)
            ->sum('credits');

        return Inertia::render('accountant/transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'user_id', 'date_from', 'date_to', 'search', 'status']),
            'summary' => [
                'total_credits_issued' => $totalCreditsIssued,
                'total_credits_used' => abs($totalCreditsUsed),
                'expired_credits' => $expiredCredits,
            ],
        ]);
    }
}
