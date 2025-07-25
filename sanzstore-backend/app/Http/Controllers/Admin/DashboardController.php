<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // fetchAdminStats
    public function getStats()
    {
        $usersCount = User::count();
        $productsCount = Product::count();
        $ordersCount = Order::count();

        return response()->json([
            'users' => $usersCount,
            'products' => $productsCount,
            'orders' => $ordersCount,
        ]);
    }
}