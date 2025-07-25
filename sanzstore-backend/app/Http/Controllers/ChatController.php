<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    // fetchUserConversations
    public function indexUserConversations(User $user)
    {
        // Otorisasi: Hanya user pemilik atau admin yang bisa melihat
        if (auth()->id() !== $user->id && (!auth()->user() || !auth()->user()->isAdmin())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversations = ChatConversation::where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->with(['buyer', 'seller', 'order.product']) // Load relasi yang diperlukan (messages akan di-load via accessor)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($conversations->map(function ($conversation) {
            return $this->formatConversationForFrontend($conversation);
        }));
    }

    // fetchMessagesForConversation
    public function fetchMessages(ChatConversation $conversation)
    {
        // Otorisasi: Hanya buyer atau seller yang terlibat dalam percakapan yang bisa melihat
        $user = auth()->user();
        if ($user->id !== $conversation->buyer_id && $user->id !== $conversation->seller_id && (!auth()->user() || !auth()->user()->isAdmin())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()->with('sender')->get();

        return response()->json($messages->map(function ($message) {
            return $this->formatMessageForFrontend($message);
        }));
    }

    // sendMessage
    public function sendMessage(Request $request, ChatConversation $conversation)
    {
        // Otorisasi: Hanya buyer atau seller yang terlibat dalam percakapan yang bisa mengirim pesan
        $user = auth()->user();
        if ($user->id !== $conversation->buyer_id && $user->id !== $conversation->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $request->validate([
                'text' => 'required|string|max:5000',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $message = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'text' => $request->text,
        ]);

        // Update conversation's updated_at to bring it to top
        $conversation->touch();

        return response()->json($this->formatMessageForFrontend($message), 201);
    }

    public function formatConversationForFrontend(ChatConversation $conversation): array
    {
        // Pastikan product ada sebelum mencoba mengaksesnya
        $productName = $conversation->order && $conversation->order->product ? $conversation->order->product->name : null;
        $productId = $conversation->order && $conversation->order->product ? $conversation->order->product->id : null;
        
        return [
            'id' => $conversation->id,
            'buyer_id' => $conversation->buyer->id,
            'buyer_name' => $conversation->buyer->name,
            'seller_id' => $conversation->seller->id,
            'seller_name' => $conversation->seller->name,
            'product_id' => $productId,
            'product_name' => $productName,
            'last_message' => $conversation->last_message, // Dari accessor
            'last_message_timestamp' => $conversation->last_message_timestamp, // Dari accessor
        ];
    }

    public function formatMessageForFrontend(ChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'text' => $message->text,
            'timestamp' => $message->created_at->toISOString(),
        ];
    }
}