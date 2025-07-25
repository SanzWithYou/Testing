<?php
// 📁 sanzstore-backend/routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Import AuthController

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth Sanctum routes for SPA (these must be in web.php for session/cookie handling)
// Route::post('/register', [AuthController::class, 'register'])->name('register');
// Route::post('/login', [AuthController::class, 'login'])->name('login');
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');


Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Jika Anda memiliki frontend dalam folder public Laravel, Anda mungkin perlu rute fallback.
// Untuk API-only backend seperti ini, biarkan seperti ini.
Route::get('/', function () {
    return "Sanz Store Backend API is running!";
});