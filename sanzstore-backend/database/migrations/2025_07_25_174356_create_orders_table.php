<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary(); // Order ID sebagai string custom (e.g., ORD-20240725-XXXXXX)
            $table->foreignUuid('product_id')->constrained('products')->onDelete('cascade'); // Foreign key ke tabel products
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Buyer ID
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Seller ID
            
            $table->decimal('total_amount', 10, 2); // Total harga order (bukan harga produk saja)
            
            // Informasi tambahan buyer, bisa diambil dari user terkait, tapi ditaruh di sini untuk snapshot.
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();

            $table->enum('status', ['pending', 'processing', 'delivered', 'completed', 'cancelled'])->default('pending');
            $table->string('payment_method'); // e.g., COD, Transfer, Wallet
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');

            // Waktu pengiriman dan konfirmasi, sesuai frontend Order
            $table->timestamp('account_delivered_at')->nullable();
            $table->timestamp('buyer_confirmed_receipt_at')->nullable();
            
            $table->json('activity_log')->nullable(); // Log aktivitas order dalam JSON array

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};