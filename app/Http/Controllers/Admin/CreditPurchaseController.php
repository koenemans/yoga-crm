<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPurchase;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditPurchaseController extends Controller
{
    public function __construct(
        protected CreditService $creditService
    ) {}

    /**
     * Display a listing of credit purchases.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', CreditPurchase::class);
        
        $query = CreditPurchase::with(['user', 'creditPackage']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $purchases = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'user' => [
                        'id' => $purchase->user->id,
                        'name' => $purchase->user->full_name,
                    ],
                    'package' => $purchase->creditPackage?->name,
                    'credits' => $purchase->credits,
                    'price' => $purchase->price,
                    'status' => $purchase->status,
                    'payment_reference' => $purchase->payment_reference,
                    'payment_method' => $purchase->payment_method,
                    'created_at' => $purchase->created_at,
                    'paid_at' => $purchase->paid_at,
                ];
            });

        return Inertia::render('admin/purchases/index', [
            'purchases' => $purchases,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Confirm payment for a purchase.
     */
    public function confirmPayment(Request $request, CreditPurchase $purchase)
    {
        $this->authorize('confirmPayment', $purchase);
        
        if ($purchase->isPaid()) {
            return back()->with('error', 'Purchase is already paid.');
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:ideal,bank_transfer,manual,other',
        ]);

        $purchase->update(['payment_method' => $validated['payment_method']]);

        $this->creditService->processPurchasePayment($purchase, $request->user());

        return back()->with('success', 'Payment confirmed and credits added.');
    }
}
