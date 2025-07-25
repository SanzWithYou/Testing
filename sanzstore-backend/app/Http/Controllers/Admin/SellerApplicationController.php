<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SellerApplication;
use App\Models\User;
use App\Models\UserRole;
use App\Models\ApplicationStatus;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SellerApplicationController extends Controller
{
    // fetchAllSellerApplications
    public function index()
    {
        $applications = SellerApplication::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Re-use formatSellerApplicationForFrontend dari SellerApplicationController utama
        return response()->json($applications->map(function ($app) {
            return (new \App\Http\Controllers\SellerApplicationController())->formatSellerApplicationForFrontend($app);
        }));
    }

    // manageSellerApplication
    public function manage(Request $request, SellerApplication $sellerApplication)
    {
        try {
            $request->validate([
                'action' => ['required', Rule::in(['approved', 'rejected'])],
                'reason' => 'nullable|string|max:500', // Hanya jika action rejected
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $user = $sellerApplication->user;

        if ($request->action === 'approved') {
            $sellerApplication->update([
                'status' => ApplicationStatus::Approved->value,
                'rejection_reason' => null,
            ]);
            // Beri user role 'seller' dan update status user
            $user->assignRole(UserRole::Seller->value);
            $user->update(['application_status' => ApplicationStatus::Approved->value]);

        } elseif ($request->action === 'rejected') {
            $sellerApplication->update([
                'status' => ApplicationStatus::Rejected->value,
                'rejection_reason' => $request->reason,
            ]);
            // Hapus role seller jika sudah ada
            $user->removeRole(UserRole::Seller->value);
            $user->update(['application_status' => ApplicationStatus::Rejected->value]);
        }

        return response()->json(['message' => 'Seller application successfully managed.']);
    }
}