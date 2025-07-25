<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SellerApplication;

class SellerApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Aplikasi pending
        SellerApplication::factory()->count(5)->create();

        // Aplikasi yang ditolak
        SellerApplication::factory()->count(2)->rejected()->create();
    }
}