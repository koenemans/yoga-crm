<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected CreditService $creditService
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'is_active' => $user->is_active,
                    'credit_balance' => $user->isPupil() ? $this->creditService->getBalance($user) : null,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:teacher,attendee',
            'is_admin' => 'boolean',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'preferred_language' => 'required|in:nl,en',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['name'] = "{$validated['first_name']} {$validated['last_name']}";

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user->load(['bookings.lesson', 'creditTransactions', 'creditPurchases']);

        $creditBalance = $user->isPupil() ? $this->creditService->getBalance($user) : null;
        $expiringCredits = $user->isPupil() ? $this->creditService->getExpiringCredits($user) : [];

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'credit_balance' => $creditBalance,
            'expiring_credits' => $expiringCredits,
            'can_view_notes' => auth()->user()->can('viewInternalNotes', $user),
        ]);
    }

    /**
     * Show the form for editing the user.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:teacher,attendee',
            'is_admin' => 'boolean',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'preferred_language' => 'required|in:nl,en',
            'is_active' => 'boolean',
            'internal_notes' => 'nullable|string',
        ]);

        $validated['name'] = "{$validated['first_name']} {$validated['last_name']}";

        $user->update($validated);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Adjust user credits manually.
     */
    public function adjustCredits(Request $request, User $user)
    {
        $this->authorize('update', $user);

        if (!$user->isAttendee()) {
            return back()->with('error', 'Can only adjust credits for attendees.');
        }

        $validated = $request->validate([
            'credits' => 'required|integer',
            'description' => 'required|string',
        ]);

        if ($validated['credits'] > 0) {
            $this->creditService->addCredits(
                $user,
                $validated['credits'],
                $validated['description'],
                null,
                null,
                $request->user()
            );
        } else {
            $this->creditService->deductCredits(
                $user,
                abs($validated['credits']),
                $validated['description'],
                null,
                $request->user()
            );
        }

        return back()->with('success', 'Credits adjusted successfully.');
    }
}
