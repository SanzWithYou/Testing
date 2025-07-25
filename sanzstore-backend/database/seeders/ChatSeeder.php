<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 conversations
        ChatConversation::factory()->count(10)->create()->each(function (ChatConversation $conversation) {
            // Get buyer and seller from the conversation
            $buyer = User::find($conversation->buyer_id);
            $seller = User::find($conversation->seller_id);

            if ($buyer && $seller) {
                // Buat 5-15 pesan untuk setiap percakapan
                for ($i = 0; $i < rand(5, 15); $i++) {
                    // Bergantian antara buyer dan seller sebagai pengirim
                    $sender = ($i % 2 == 0) ? $buyer : $seller;
                    ChatMessage::factory()->create([
                        'conversation_id' => $conversation->id,
                        'sender_id' => $sender->id,
                        // Atur created_at untuk simulasi pesan berurutan
                        'created_at' => now()->subMinutes(rand(1, 60))->subSeconds(rand(1, 59)), 
                    ]);
                }
            }
        });
    }
}