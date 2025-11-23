<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditPackageController extends Controller
{
    /**
     * Display a listing of credit packages.
     */
    public function index()
    {
        $packages = CreditPackage::ordered()->get();

        return Inertia::render('admin/credits/index', [
            'packages' => $packages,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        return Inertia::render('admin/credits/create');
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'expiry_days' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        CreditPackage::create($validated);

        return redirect()->route('admin.credits.index')
            ->with('success', 'Credit package created successfully.');
    }

    /**
     * Show the form for editing the package.
     */
    public function edit(CreditPackage $creditPackage)
    {
        return Inertia::render('admin/credits/edit', [
            'package' => $creditPackage,
        ]);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, CreditPackage $creditPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'expiry_days' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $creditPackage->update($validated);

        return redirect()->route('admin.credits.index')
            ->with('success', 'Credit package updated successfully.');
    }

    /**
     * Remove the specified package.
     */
    public function destroy(CreditPackage $creditPackage)
    {
        $creditPackage->delete();

        return redirect()->route('admin.credits.index')
            ->with('success', 'Credit package deleted successfully.');
    }
}
