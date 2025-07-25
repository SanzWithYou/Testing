<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatConversation;

class ChatConversationController extends Controller
{
    // fetchAllConversations
    public function index()
    {
        $conversations = ChatConversation::with(['buyer', 'seller', 'order.product', 'messages'])
            ->orderBy('updated_at', 'desc')
            ->get();

        // Re-use formatConversationForFrontend dari ChatController utama
        return response()->json($conversations->map(function ($conversation) {
            return (new \App\Http\Controllers\ChatController())->formatConversationForFrontend($conversation);
        }));
    }
}