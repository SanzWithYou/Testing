<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 20 testimonial yang sudah disetujui
        Testimonial::factory()->count(20)->approved()->create();

        // Buat 5 testimonial pending
        Testimonial::factory()->count(5)->pending()->create();
    }
}