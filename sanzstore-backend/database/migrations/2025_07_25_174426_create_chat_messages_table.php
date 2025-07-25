<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID sebagai primary key
            $table->foreignUuid('conversation_id')->constrained('chat_conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // ID pengirim pesan (buyer/seller)
            $table->text('text');
            $table->timestamps(); // timestamp adalah created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};