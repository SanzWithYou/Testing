<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\Testimonial;
use App\Models\TestimonialStatus;


class TestimonialController extends Controller
{
    // fetchTestimonials (Public)
    public function index()
    {
        $testimonials = Testimonial::where('status', TestimonialStatus::Approved->value)
            ->with(['user', 'product']) // Load user dan product data (untuk 'game')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($testimonials->map(function ($testimonial) {
            return [
                'id' => $testimonial->id,
                'user_name' => $testimonial->user->name ?? 'Anonim',
                'user_avatar_url' => $testimonial->user_avatar_url, // Ambil dari accessor di Model
                'comment' => $testimonial->comment,
                'game' => $testimonial->product->category ?? 'General', // Asumsi 'game' di frontend adalah category produk
            ];
        }));
    }

    // Anda bisa menambahkan method 'store' di sini jika user bisa menambahkan testimonial
    // public function store(Request $request) { ... }
}