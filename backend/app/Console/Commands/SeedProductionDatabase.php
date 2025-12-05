<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SeedProductionDatabase extends Command
{
    protected $signature = 'db:seed-production';
    protected $description = 'Seed the production database with sample data';

    public function handle()
    {
        $this->info('Starting database seeding...');
        
        try {
            Artisan::call('db:seed', ['--force' => true]);
            $this->info('Database seeded successfully!');
            $this->info(Artisan::output());
        } catch (\Exception $e) {
            $this->error('Seeding failed: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
