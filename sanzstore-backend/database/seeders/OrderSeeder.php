<?php
namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 30 order dengan status default (pending)
        Order::factory()->count(30)->create();

        // Buat 15 order yang sudah dibayar
        Order::factory()->count(15)->paid()->create();

        // Buat 10 order yang sudah completed
        Order::factory()->count(10)->completed()->create();
    }
}