<?php

declare(strict_types=1);

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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('system_settings')->insert([
            [
                'key' => 'school_name',
                'value' => 'Yoga School',
                'type' => 'string',
                'description' => 'Name of the yoga school',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'timezone',
                'value' => 'Europe/Amsterdam',
                'type' => 'string',
                'description' => 'System timezone',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'currency',
                'value' => 'EUR',
                'type' => 'string',
                'description' => 'Currency code',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'cancellation_cutoff_hours',
                'value' => '24',
                'type' => 'integer',
                'description' => 'Hours before lesson start when cancellation is allowed with refund',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'default_credit_expiry_days',
                'value' => '90',
                'type' => 'integer',
                'description' => 'Default number of days before credits expire',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'default_language',
                'value' => 'nl',
                'type' => 'string',
                'description' => 'Default system language',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
