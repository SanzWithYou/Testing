<?php
// 📁 sanzstore-backend/routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import AuthController dan controller lainnya yang sudah Anda buat
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\SellerApplicationController;
use App\Http\Controllers\ChatController;

// Import Admin controllers (dengan alias untuk menghindari konflik nama)
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SellerApplicationController as AdminSellerApplicationController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ChatConversationController as AdminChatConversationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --------- Rute untuk Laravel Sanctum (di web.php, ini yang dipindahkan) ---------
// Ini adalah endpoint yang dibutuhkan oleh frontend SPA untuk inisiasi CSRF.
// Laravel Sanctum menggunakan rute ini untuk menyetel _sanctum_session dan XSRF-TOKEN cookie.
// Rute ini harus memiliki URL yang sama dengan SANCTUM_STATEFUL_DOMAINS di .env.
// Endpoint ini tidak memerlukan middleware otentikasi.
// Route::get('/sanctum/csrf-cookie', function (Request $request) {
//     return response('OK', 204); // Status 204 No Content adalah respons umum untuk ini
// });

// Autentikasi Umum (Registrasi, Login, Logout)
// Rute ini juga harus berada di api.php agar melewati middleware Sanctum
// yang menangani X-XSRF-TOKEN dari cookie.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Ruta Publik (Tidak memerlukan autentikasi)
Route::get('/products', [ProductController::class, 'index']); // fetchProducts
Route::get('/products/{product}', [ProductController::class, 'show']); // fetchProductById
Route::get('/testimonials', [TestimonialController::class, 'index']); // fetchTestimonials

// Rute yang Membutuhkan Autentikasi Pengguna (Middleware 'auth:sanctum')
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']); // getProfileForUser (Untuk mendapatkan data user yang sedang login)

    // User/Checkout API
    Route::post('/orders', [OrderController::class, 'store']); // createOrder
    Route::get('/users/{user}/orders', [OrderController::class, 'indexUserOrders']); // fetchUserOrders

    // Seller API (Perlu otentikasi & mungkin cek role 'seller' lebih spesifik di controller atau middleware 'can:seller')
    Route::post('/seller-applications', [SellerApplicationController::class, 'store']); // applyToBeSeller
    Route::get('/users/{user}/seller-application', [SellerApplicationController::class, 'showUserApplication']); // fetchSellerApplication
    Route::get('/sellers/{user}/products', [ProductController::class, 'indexSellerProducts'])->middleware('can:seller'); // fetchSellerProducts
    Route::post('/products', [ProductController::class, 'store'])->middleware('can:seller'); // addProduct
    // Catatan: Untuk update dengan file upload, biasanya menggunakan form-data dengan method POST dan _method PUT/PATCH
    Route::post('/products/{product}', [ProductController::class, 'update'])->middleware('can:seller'); // updateProduct
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('can:seller'); // deleteProduct

    // Chat API
    Route::get('/users/{user}/conversations', [ChatController::class, 'indexUserConversations']); // fetchUserConversations
    Route::get('/conversations/{conversation}/messages', [ChatController::class, 'fetchMessages']); // fetchMessagesForConversation
    Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage']); // sendMessage
});

// Rute Admin (Membutuhkan autentikasi & role 'admin')
Route::middleware(['auth:sanctum', 'can:admin'])->prefix('admin')->group(function () {
    // User Management
    Route::get('/users', [AdminUserController::class, 'index']); // fetchAllUsers
    Route::put('/users/{user}/roles', [AdminUserController::class, 'updateRoles']); // updateUserRoles
    Route::put('/users/{user}/status', [AdminUserController::class, 'updateStatus']); // updateUserStatus

    // Order Management
    Route::get('/orders', [AdminOrderController::class, 'index']); // fetchAllOrders
    Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']); // updateOrderStatus

    // Seller Application Management
    Route::get('/seller-applications', [AdminSellerApplicationController::class, 'index']); // fetchAllSellerApplications
    Route::post('/seller-applications/{sellerApplication}/manage', [AdminSellerApplicationController::class, 'manage']); // manageSellerApplication

    // Product Management (Admin view)
    Route::get('/products', [AdminProductController::class, 'index']); // fetchAllAdminProducts

    // Admin Dashboard Stats
    Route::get('/stats', [AdminDashboardController::class, 'getStats']); // fetchAdminStats

    // Admin Chat Management
    Route::get('/conversations', [AdminChatConversationController::class, 'index']); // fetchAllConversations
});