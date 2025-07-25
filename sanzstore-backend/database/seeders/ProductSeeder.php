<?php
namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua user yang memiliki role 'seller'
        $sellers = User::whereJsonContains('roles', 'seller')->get();

        if ($sellers->isEmpty()) {
            // Jika tidak ada seller, buat beberapa
            User::factory()->count(3)->seller()->create();
            $sellers = User::whereJsonContains('roles', 'seller')->get();
        }

        // Buat produk untuk setiap seller
        foreach ($sellers as $seller) {
            Product::factory()->count(rand(5, 15))->create([
                'seller_id' => $seller->id,
            ]);
        }

        // Buat beberapa produk yang sudah SOLD
        Product::factory()->count(5)->sold()->create();
    }
}