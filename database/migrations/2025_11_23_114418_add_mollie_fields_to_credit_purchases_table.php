<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('credit_purchases', function (Blueprint $table) {
            $table->string('mollie_payment_id')->nullable()->after('payment_reference');
            $table->string('mollie_payment_status')->nullable()->after('mollie_payment_id');
            $table->text('mollie_payment_data')->nullable()->after('mollie_payment_status');
            $table->timestamp('mollie_webhook_received_at')->nullable()->after('mollie_payment_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_purchases', function (Blueprint $table) {
            $table->dropColumn([
                'mollie_payment_id',
                'mollie_payment_status',
                'mollie_payment_data',
                'mollie_webhook_received_at',
            ]);
        });
    }
};
