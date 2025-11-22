<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use App\Models\CreditPurchase;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditController extends Controller
{
    public function __construct(
        protected CreditService $creditService
    ) {}

    /**
     * Display credit packages and user's balance.
     */
    public function index(Request $request)
    {
        $packages = CreditPackage::active()->ordered()->get();
        
        $balance = $this->creditService->getBalance($request->user());
        
        $transactions = $request->user()
            ->creditTransactions()
            ->with('transactionable')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $expiringCredits = $this->creditService->getExpiringCredits($request->user());

        return Inertia::render('credits/index', [
            'packages' => $packages,
            'balance' => $balance,
            'transactions' => $transactions,
            'expiring_credits' => $expiringCredits,
        ]);
    }

    /**
     * Purchase credits.
     */
    public function purchase(Request $request)
    {
        $validated = $request->validate([
            'credit_package_id' => 'required|exists:credit_packages,id',
        ]);

        $package = CreditPackage::findOrFail($validated['credit_package_id']);

        if (!$package->is_active) {
            return back()->with('error', 'This package is not available.');
        }

        $purchase = CreditPurchase::create([
            'user_id' => $request->user()->id,
            'credit_package_id' => $package->id,
            'credits' => $package->credits,
            'price' => $package->price,
            'status' => 'pending',
        ]);

        return redirect()->route('credits.purchase.show', $purchase)
            ->with('success', 'Purchase created. Please complete payment.');
    }

    /**
     * Show purchase details.
     */
    public function showPurchase(CreditPurchase $purchase)
    {
        $this->authorize('view', $purchase);

        return Inertia::render('credits/purchase', [
            'purchase' => [
                'id' => $purchase->id,
                'credits' => $purchase->credits,
                'price' => $purchase->price,
                'status' => $purchase->status,
                'payment_reference' => $purchase->payment_reference,
                'payment_method' => $purchase->payment_method,
                'created_at' => $purchase->created_at,
            ],
        ]);
    }
}
