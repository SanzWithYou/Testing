<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID sebagai primary key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // User yang memberi testimonial
            $table->foreignUuid('product_id')->nullable()->constrained('products')->onDelete('set null'); // Produk yang diulas (opsional)
            $table->integer('rating')->unsigned()->default(5); // Rating 1-5
            $table->text('comment')->nullable(); // <-- PERBAIKAN: Tambahkan ->nullable()
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Status testimonial
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};