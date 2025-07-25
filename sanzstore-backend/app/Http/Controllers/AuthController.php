<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\UserRole; // Import UserRole Enum

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'roles' => [UserRole::User->value], // Setiap user baru defaultnya 'user'
        ]);

        // Opsional: Langsung login user setelah registrasi
        Auth::login($user);

        return response()->json([
            'message' => 'Registrasi berhasil!',
            'user' => $user->only(['id', 'name', 'email', 'roles', 'store_name', 'application_status', 'status']), // Data yang dikembalikan
        ], 201);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'], // Pesan error generik
            ]);
        }

        $user = Auth::user();

        // Sanctum akan otomatis menangani cookie sesi. Tidak perlu token di response body.
        return response()->json([
            'message' => 'Login successful!',
            'user' => $user->only(['id', 'name', 'email', 'roles', 'store_name', 'application_status', 'status']),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // Pastikan guard 'web' digunakan untuk sesi cookie
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful.']);
    }

    public function user(Request $request)
    {
        // Mengembalikan data user yang sedang login
        return response()->json($request->user()->only(['id', 'name', 'email', 'roles', 'store_name', 'application_status', 'status']));
    }
}