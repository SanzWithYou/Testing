<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI (merujuk ke App\Http\Controllers\Controller)
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserRole;
use App\Models\UserStatus;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    // fetchAllUsers
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users->map(fn($user) => $this->formatUserForAdmin($user)));
    }

    // updateUserRoles
    public function updateRoles(Request $request, User $user)
    {
        try {
            $request->validate([
                'roles' => 'required|array',
                'roles.*' => ['string', Rule::in(array_column(UserRole::cases(), 'value'))],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        // Pastikan admin tidak bisa mengubah role-nya sendiri
        if (auth()->id() === $user->id && !in_array(UserRole::Admin->value, $request->roles)) {
            return response()->json(['message' => 'Anda tidak dapat menghapus role admin dari akun Anda sendiri!'], 403);
        }

        $user->update(['roles' => $request->roles]);
        return response()->json($this->formatUserForAdmin($user));
    }

    // updateUserStatus
    public function updateStatus(Request $request, User $user)
    {
        try {
            $request->validate([
                'status' => ['required', Rule::in(array_column(UserStatus::cases(), 'value'))],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        // Admin tidak bisa memblokir/mengubah status dirinya sendiri
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Anda tidak dapat mengubah status akun Anda sendiri!'], 403);
        }

        $user->update(['status' => $request->status]);
        return response()->json($this->formatUserForAdmin($user));
    }

    protected function formatUserForAdmin(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles,
            'store_name' => $user->store_name,
            'application_status' => $user->application_status->value,
            'status' => $user->status->value,
            // 'created_at' => $user->created_at->toISOString(), // Opsional
        ];
    }
}