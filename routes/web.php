<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\CreditPackageController;
use App\Http\Controllers\Admin\CreditPurchaseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\Finance\DashboardController as FinanceDashboardController;
use App\Http\Controllers\Admin\Finance\ReportController as FinanceReportController;
use App\Http\Controllers\Admin\Finance\TransactionController as FinanceTransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Attendee\DashboardController as AttendeeDashboardController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MollieWebhookController;
use App\Http\Controllers\PaymentController;
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

// Mollie webhook (no auth required)
Route::post('mollie/webhook', MollieWebhookController::class)->name('mollie.webhook');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Redirect admins to finance dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.finance.dashboard');
        }
        
        // Redirect teachers to their dashboard
        if ($user->isTeacher()) {
            return redirect()->route('teacher.dashboard');
        }
        
        // Redirect attendees to their dashboard
        if ($user->isAttendee()) {
            return redirect()->route('attendee.dashboard');
        }
        
        // Fallback for unknown roles
        abort(403, 'Invalid user role');
    })->name('dashboard');

    // User Profile routes (for pupil profile management)
    Route::get('my-profile', [ProfileController::class, 'show'])->name('my-profile.show');
    Route::get('my-profile/edit', function () {
        return Inertia::render('my-profile/edit');
    })->name('my-profile.edit');
    Route::put('my-profile', [ProfileController::class, 'update'])->name('my-profile.update');
    Route::put('my-profile/password', [ProfileController::class, 'updatePassword'])->name('my-profile.password');

    // Lesson routes
    Route::get('lessons/all', [LessonController::class, 'all'])->name('lessons.all');
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

    // Payment routes
    Route::get('payment/{package}', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('payment/{package}', [PaymentController::class, 'store'])->name('payment.store');
    Route::get('payment/{purchase}/return', [PaymentController::class, 'return'])->name('payment.return');
    Route::get('payment/{purchase}/status', [PaymentController::class, 'show'])->name('payment.show');

    // Attendee dashboard
    Route::get('attendee/dashboard', [AttendeeDashboardController::class, 'index'])->name('attendee.dashboard');

    // Teacher dashboard
    Route::get('teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacher.dashboard');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('lessons', [AdminDashboardController::class, 'index'])->name('lessons.index');
        
        // User management
        Route::resource('users', AdminUserController::class);
        Route::post('users/{user}/credits', [AdminUserController::class, 'adjustCredits'])->name('users.credits');
        
        // Credit management
        Route::resource('credits', CreditPackageController::class);
        
        // Finance dashboard
        Route::get('finance', [FinanceDashboardController::class, 'index'])->name('finance.dashboard');
        
        // Purchase management (consolidated under finance)
        Route::get('finance/purchases', [CreditPurchaseController::class, 'index'])->name('finance.purchases.index');
        Route::get('finance/purchases/{purchase}', [CreditPurchaseController::class, 'show'])->name('finance.purchases.show');
        Route::post('finance/purchases/{purchase}/confirm', [CreditPurchaseController::class, 'confirmPayment'])->name('finance.purchases.confirm');
        Route::delete('finance/purchases/{purchase}', [CreditPurchaseController::class, 'destroy'])->name('finance.purchases.destroy');
        
        // Transaction reports (read-only view)
        Route::get('finance/transactions', [FinanceTransactionController::class, 'index'])->name('finance.transactions.index');
        
        // Reports and exports
        Route::get('finance/reports', [FinanceReportController::class, 'index'])->name('finance.reports.index');
        Route::get('finance/reports/revenue', [FinanceReportController::class, 'revenue'])->name('finance.reports.revenue');
        Route::get('finance/reports/export/purchases', [FinanceReportController::class, 'exportPurchases'])->name('finance.reports.export.purchases');
        Route::get('finance/reports/export/transactions', [FinanceReportController::class, 'exportTransactions'])->name('finance.reports.export.transactions');
    });
});

require __DIR__.'/settings.php';
