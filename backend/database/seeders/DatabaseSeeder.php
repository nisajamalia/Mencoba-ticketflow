<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed if database is empty
        if (User::count() === 0) {
            $this->call([
                UserSeeder::class,
                CategorySeeder::class,
                TicketSeeder::class,
            ]);
            
            $this->command->info('Database seeded successfully!');
        } else {
            $this->command->info('Database already contains data. Skipping seeding.');
        }
    }
}