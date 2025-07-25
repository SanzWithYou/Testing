<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use App\Models\ProductStatus;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    // createOrder
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|uuid|exists:products,id',
                // 'payment_method' field not sent by frontend's createOrder, so hardcode or use default
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $user = auth()->user(); // Buyer (user yang sedang login)
        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }

        if ($product->status === ProductStatus::Sold) {
            return response()->json(['message' => 'Produk ini sudah terjual.'], 400);
        }

        $seller = $product->seller;

        // Buat order
        $order = Order::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'seller_id' => $seller->id,
            'total_amount' => $product->price,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'status' => OrderStatus::Pending->value, // Default pending
            'payment_method' => 'Wallet', // <-- Contoh hardcode, sesuaikan dengan UI Anda
            'payment_status' => PaymentStatus::Pending->value, // Default pending
            'activity_log' => [['timestamp' => now()->toISOString(), 'activity' => 'Order created']],
        ]);

        // Opsional: Tandai produk sebagai 'sold' setelah order dibuat
        $product->update(['status' => ProductStatus::Sold->value]);

        return response()->json($this->formatOrderForFrontend($order), 201);
    }

    // fetchUserOrders
    public function indexUserOrders(User $user)
    {
        // Otorisasi: Hanya user pemilik atau admin yang bisa melihat order ini
        if (auth()->id() !== $user->id && (!auth()->user() || !auth()->user()->isAdmin())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['product', 'seller', 'buyer']) // Load relasi yang diperlukan
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders->map(function ($order) {
            return $this->formatOrderForFrontend($order, true); // True karena ini untuk user pemilik
        }));
    }

    // Helper untuk format data order sesuai frontend
    public function formatOrderForFrontend(Order $order, bool $includeSensitiveData = false): array
    {
        $product = $order->product;
        $buyer = $order->buyer;
        $seller = $order->seller;

        $formattedOrder = [
            'id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'user_id' => $buyer->id,
            'user_name' => $buyer->name,
            'seller_id' => $seller->id,
            'seller_name' => $seller->name,
            'date' => $order->created_at->toISOString(),
            'status' => $order->status->value,
            'price' => (float) $order->total_amount, // Menggunakan total_amount sebagai price di frontend
            'payment_method' => $order->payment_method,
            'activity_log' => $order->activity_log,
        ];

        // Include sensitive data (account username/password) only if order completed AND explicitly requested
        if ($order->status === OrderStatus::Completed && $includeSensitiveData) {
            $formattedOrder['account_username'] = $product->account_username;
            $formattedOrder['account_password'] = $product->account_password;
            $formattedOrder['is_email_verified'] = $product->is_email_verified;
        } else {
            $formattedOrder['account_username'] = null;
            $formattedOrder['account_password'] = null;
            $formattedOrder['is_email_verified'] = false;
        }

        return $formattedOrder;
    }
}