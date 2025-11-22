<?php

declare(strict_types=1);

use App\Http\Controllers\Accountant\DashboardController as AccountantDashboardController;
use App\Http\Controllers\Accountant\PurchaseController as AccountantPurchaseController;
use App\Http\Controllers\Accountant\ReportController as AccountantReportController;
use App\Http\Controllers\Accountant\TransactionController as AccountantTransactionController;
use App\Http\Controllers\Admin\CreditPackageController;
use App\Http\Controllers\Admin\CreditPurchaseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WaitlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Redirect admin to admin dashboard
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        
        // Redirect accountant to accountant dashboard
        if ($user->role === 'accountant') {
            return redirect()->route('accountant.dashboard');
        }
        
        $data = ['role' => $user->role];
        
        // Pupil-specific data
        if ($user->role === 'pupil') {
            $creditService = app(\App\Services\CreditService::class);
            $data['creditBalance'] = $creditService->getBalance($user);
            $data['upcomingBookings'] = $user->bookings()
                ->with('lesson')
                ->whereHas('lesson', fn($q) => $q->where('start_datetime', '>=', now()))
                ->where('status', 'booked')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            $data['expiringCredits'] = $creditService->getExpiringCredits($user);
        }
        
        // Teacher-specific data
        if ($user->role === 'teacher') {
            $data['upcomingLessons'] = $user->taughtLessons()
                ->with('bookings')
                ->where('status', 'active')
                ->where('start_datetime', '>=', now())
                ->orderBy('start_datetime')
                ->limit(10)
                ->get()
                ->map(fn($lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'start_datetime' => $lesson->start_datetime->format('D, M j, Y H:i'),
                    'location' => $lesson->location,
                    'capacity' => $lesson->capacity,
                    'bookings_count' => $lesson->bookings()->count(),
                ]);
            $data['todayClasses'] = $user->taughtLessons()
                ->whereDate('start_datetime', today())
                ->count();
            $data['totalStudents'] = \App\Models\Booking::whereHas('lesson', fn($q) => 
                $q->where('teacher_id', $user->id)
            )->distinct('user_id')->count('user_id');
        }
        
        // Accountant-specific data
        if ($user->role === 'accountant') {
            $data['totalRevenue'] = \App\Models\CreditPurchase::where('status', 'paid')
                ->whereMonth('paid_at', now()->month)
                ->sum('price');
            $data['pendingPurchases'] = \App\Models\CreditPurchase::where('status', 'pending')->count();
            $data['activeStudents'] = \App\Models\User::where('role', 'pupil')
                ->where('is_active', true)
                ->whereHas('creditTransactions', fn($q) => $q->where('credits', '>', 0))
                ->count();
            $data['recentTransactions'] = \App\Models\CreditTransaction::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($t) => [
                    'id' => $t->id,
                    'user' => ['name' => $t->user->full_name],
                    'credits' => $t->credits,
                    'description' => $t->description,
                    'created_at' => $t->created_at->format('M j, Y H:i'),
                ]);
        }
        
        return Inertia::render('dashboard', $data);
    })->name('dashboard');

    // User Profile routes (for pupil profile management)
    Route::get('my-profile', [ProfileController::class, 'show'])->name('my-profile.show');
    Route::get('my-profile/edit', function () {
        return Inertia::render('my-profile/edit');
    })->name('my-profile.edit');
    Route::put('my-profile', [ProfileController::class, 'update'])->name('my-profile.update');
    Route::put('my-profile/password', [ProfileController::class, 'updatePassword'])->name('my-profile.password');

    // Lesson routes
    Route::resource('lessons', LessonController::class);
    Route::post('lessons/{lesson}/cancel', [LessonController::class, 'cancel'])->name('lessons.cancel');

    // Teacher: My Students
    Route::get('my-students', [LessonController::class, 'myStudents'])->name('my-students.index');

    // Booking routes
    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
    Route::post('bookings/{booking}/attendance', [BookingController::class, 'markAttendance'])->name('bookings.attendance');

    // Waitlist routes
    Route::post('waitlist', [WaitlistController::class, 'store'])->name('waitlist.store');
    Route::delete('waitlist/{waitlistEntry}', [WaitlistController::class, 'destroy'])->name('waitlist.destroy');

    // Credit routes
    Route::get('credits', [CreditController::class, 'index'])->name('credits.index');
    Route::post('credits/purchase', [CreditController::class, 'purchase'])->name('credits.purchase');
    Route::get('credits/purchase/{purchase}', [CreditController::class, 'showPurchase'])->name('credits.purchase.show');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // User management
        Route::resource('users', AdminUserController::class);
        Route::post('users/{user}/credits', [AdminUserController::class, 'adjustCredits'])->name('users.credits');
        
        // Credit package management
        Route::resource('credit-packages', CreditPackageController::class);
        
        // Purchase management
        Route::get('purchases', [CreditPurchaseController::class, 'index'])->name('purchases.index');
        Route::post('purchases/{purchase}/confirm', [CreditPurchaseController::class, 'confirmPayment'])->name('purchases.confirm');
    });

    // Accountant routes
    Route::middleware(['role:accountant,admin'])->prefix('accountant')->name('accountant.')->group(function () {
        Route::get('dashboard', [AccountantDashboardController::class, 'index'])->name('dashboard');
        
        // Purchase management (read-only)
        Route::get('purchases', [AccountantPurchaseController::class, 'index'])->name('purchases.index');
        Route::get('purchases/{purchase}', [AccountantPurchaseController::class, 'show'])->name('purchases.show');
        
        // Transaction management (read-only)
        Route::get('transactions', [AccountantTransactionController::class, 'index'])->name('transactions.index');
        
        // Reports and exports
        Route::get('reports', [AccountantReportController::class, 'index'])->name('reports.index');
        Route::get('reports/revenue', [AccountantReportController::class, 'revenue'])->name('reports.revenue');
        Route::get('reports/export/purchases', [AccountantReportController::class, 'exportPurchases'])->name('reports.export.purchases');
        Route::get('reports/export/transactions', [AccountantReportController::class, 'exportTransactions'])->name('reports.export.transactions');
    });
});

require __DIR__.'/settings.php';
