<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Menggunakan UUID sebagai primary key
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Foreign key ke tabel users
            $table->string('name');
            $table->string('category');
            $table->string('sub_category')->nullable(); // Opsional
            $table->decimal('price', 10, 2); // Harga dengan 2 angka di belakang koma
            $table->text('description')->nullable();
            $table->string('image_url')->nullable(); // Path ke gambar produk
            $table->enum('status', ['available', 'sold'])->default('available');
            
            // Kolom untuk akun yang dijual
            $table->string('account_username')->nullable();
            $table->string('account_password')->nullable();
            $table->boolean('is_email_verified')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};