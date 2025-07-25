<?php

namespace App\Http\Controllers; // <-- Pastikan namespace ini benar

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\SellerApplication;
use App\Models\User;
use App\Models\ApplicationStatus;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SellerApplicationController extends Controller
{
    // applyToBeSeller
    public function store(Request $request)
    {
        $user = auth()->user();

        // Cek apakah user sudah punya aplikasi pending/approved
        if ($user->sellerApplication()->whereIn('status', [ApplicationStatus::Pending, ApplicationStatus::Approved])->exists()) {
            return response()->json(['message' => 'Anda sudah memiliki aplikasi seller aktif atau pending.'], 400);
        }

        try {
            $request->validate([
                'store_name' => 'required|string|max:255|unique:seller_applications,store_name',
                'description' => 'nullable|string',
                'contact_email' => 'required|email|max:255',
                'contact_phone' => 'required|string|max:20',
                'game_types' => 'nullable|array',
                'game_types.*' => 'string|max:50',
                'payment_methods' => 'nullable|array',
                'payment_methods.*' => 'string|max:50',
                'social_link' => 'nullable|url|max:255',
                'id_document' => 'nullable|file|mimes:jpeg,png,pdf|max:5120', // Max 5MB, hanya image dan pdf
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $idDocumentPath = null;
        if ($request->hasFile('id_document')) {
            $idDocumentPath = $request->file('id_document')->store('id_documents', 'public');
        }

        $application = SellerApplication::create([
            'user_id' => $user->id,
            'store_name' => $request->store_name,
            'description' => $request->description,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'game_types' => $request->game_types,
            'payment_methods' => $request->payment_methods,
            'social_link' => $request->social_link,
            'id_document_url' => $idDocumentPath ? Storage::url($idDocumentPath) : null,
            'status' => ApplicationStatus::Pending->value, // Selalu pending saat baru dibuat
        ]);
        
        // Update user application_status
        $user->update(['application_status' => ApplicationStatus::Pending->value]);

        return response()->json(['message' => 'Aplikasi seller berhasil diajukan.'], 201);
    }

    // fetchSellerApplication
    public function showUserApplication(User $user)
    {
        // Otorisasi: Hanya user pemilik atau admin yang bisa melihat
        if (auth()->id() !== $user->id && (!auth()->user() || !auth()->user()->isAdmin())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application = $user->sellerApplication()->first();

        if (!$application) {
            return response()->json(null, 204); // No Content if no application
        }

        return response()->json($this->formatSellerApplicationForFrontend($application));
    }

    // Helper untuk format data aplikasi seller sesuai frontend
    public function formatSellerApplicationForFrontend(SellerApplication $application): array
    {
        $user = $application->user;
        return [
            'id' => $application->id,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'store_name' => $application->store_name,
            'description' => $application->description,
            'status' => $application->status->value,
            'rejection_reason' => $application->rejection_reason,
            'submitted_at' => $application->created_at->toISOString(),
            'contact_email' => $application->contact_email,
            'contact_phone' => $application->contact_phone,
            'game_types' => $application->game_types,
            'payment_methods' => $application->payment_methods,
            'social_link' => $application->social_link,
            'id_document_url' => $application->id_document_url,
        ];
    }
}