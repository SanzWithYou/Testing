<?php
namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRole;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'name' => 'Admin Sanz',
            'email' => 'admin@sanz.com',
            'roles' => [UserRole::Admin->value, UserRole::Seller->value],
            'store_name' => 'Sanz Admin Store',
        ]);

        // Seller users
        User::factory()->count(5)->seller()->create();

        // Regular users (buyers)
        User::factory()->count(20)->create();
    }
}