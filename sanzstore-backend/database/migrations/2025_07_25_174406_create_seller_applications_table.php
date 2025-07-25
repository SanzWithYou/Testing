<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_applications', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID sebagai primary key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // User yang mengajukan
            $table->string('store_name')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            
            // Field detail baru
            $table->string('contact_email'); 
            $table->string('contact_phone');
            $table->json('game_types')->nullable(); // Array of strings e.g., ['MOBA', 'FPS']
            $table->json('payment_methods')->nullable(); // Array of strings e.g., ['Dana', 'OVO', 'Bank Transfer']
            $table->string('social_link')->nullable();
            $table->string('id_document_url')->nullable(); // URL ke dokumen ID yang diupload

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_applications');
    }
};