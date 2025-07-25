<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // fetchAllAdminProducts
    public function index()
    {
        $products = Product::with('seller')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Re-use formatProductForFrontend dari ProductController utama
        return response()->json($products->map(function ($product) {
            return (new \App\Http\Controllers\ProductController())->formatProductForFrontend($product, true); // true karena admin melihat semua detail
        }));
    }

    // Admin juga bisa modify/delete product via ProductController metode store/update/destroy (sudah ada otorisasi admin di sana)
}