<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CreditPackage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class YogaCrmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@yoga.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'preferred_language' => 'nl',
            'is_active' => true,
        ]);

        // Create teacher
        User::create([
            'name' => 'Jane Teacher',
            'first_name' => 'Jane',
            'last_name' => 'Teacher',
            'email' => 'teacher@yoga.test',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'preferred_language' => 'nl',
            'is_active' => true,
        ]);

        // Create pupil
        User::create([
            'name' => 'John Pupil',
            'first_name' => 'John',
            'last_name' => 'Pupil',
            'email' => 'pupil@yoga.test',
            'password' => Hash::make('password'),
            'role' => 'pupil',
            'preferred_language' => 'nl',
            'is_active' => true,
            'phone' => '+31612345678',
            'date_of_birth' => '1990-01-01',
        ]);

        // Create accountant
        User::create([
            'name' => 'Sarah Accountant',
            'first_name' => 'Sarah',
            'last_name' => 'Accountant',
            'email' => 'accountant@yoga.test',
            'password' => Hash::make('password'),
            'role' => 'accountant',
            'preferred_language' => 'nl',
            'is_active' => true,
        ]);

        // Create credit packages
        CreditPackage::create([
            'name' => 'Single Class',
            'description' => 'One class credit',
            'credits' => 1,
            'price' => 15.00,
            'expiry_days' => 30,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        CreditPackage::create([
            'name' => '5 Class Package',
            'description' => 'Five class credits',
            'credits' => 5,
            'price' => 65.00,
            'expiry_days' => 90,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        CreditPackage::create([
            'name' => '10 Class Package',
            'description' => 'Ten class credits - Best value!',
            'credits' => 10,
            'price' => 120.00,
            'expiry_days' => 120,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        CreditPackage::create([
            'name' => '20 Class Package',
            'description' => 'Twenty class credits - Ultimate package',
            'credits' => 20,
            'price' => 220.00,
            'expiry_days' => 180,
            'is_active' => true,
            'sort_order' => 4,
        ]);

        $this->command->info('Yoga CRM seeded successfully!');
        $this->command->info('Admin: admin@yoga.test / password');
        $this->command->info('Teacher: teacher@yoga.test / password');
        $this->command->info('Pupil: pupil@yoga.test / password');
        $this->command->info('Accountant: accountant@yoga.test / password');
    }
}
