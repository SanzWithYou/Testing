<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    // fetchAllOrders
    public function index()
    {
        $orders = Order::with(['product', 'buyer', 'seller'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Re-use formatOrderForFrontend dari OrderController utama
        return response()->json($orders->map(function ($order) {
            // Instansiasi OrderController untuk memanggil method protected
            return (new \App\Http\Controllers\OrderController())->formatOrderForFrontend($order, true); // true karena admin melihat semua detail
        }));
    }

    // updateOrderStatus
    public function updateStatus(Request $request, Order $order)
    {
        try {
            $request->validate([
                'status' => ['required', Rule::in(array_column(OrderStatus::cases(), 'value'))],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $oldStatus = $order->status->value;
        $newStatus = $request->status;
        
        $order->update(['status' => $newStatus]);

        // Tambahkan log aktivitas
        $log = $order->activity_log ?? [];
        $log[] = ['timestamp' => now()->toISOString(), 'activity' => "Status changed from '{$oldStatus}' to '{$newStatus}' by Admin."];
        $order->update(['activity_log' => $log]);

        return response()->json((new \App\Http\Controllers\OrderController())->formatOrderForFrontend($order, true));
    }
}