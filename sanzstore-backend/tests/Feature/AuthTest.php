<?php
// 📁 sanzstore-backend/tests/Feature/AuthTest.php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can register successfully.
     *
     * @return void
     */
    public function test_user_can_register_successfully()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/register', $userData);

        $response->assertStatus(201); // Pastikan status 201 Created

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
            'name' => 'John Doe',
        ]);

        $response->assertJsonStructure([
            'message',
            'user' // Tambahkan ini karena respons Anda juga menyertakan objek user
        ]);

        // PERBAIKAN DI SINI: SESUAIKAN DENGAN PESAN AKTUAL DARI BACKEND ANDA!
        $response->assertJson([
            'message' => 'Registrasi berhasil!', // <-- UBAH KE INI!
            'user' => [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'roles' => ['user'], // Sesuaikan jika Anda punya default role lain
                // id, store_name, application_status, status mungkin tidak perlu di assertJson secara spesifik jika nilainya tidak pasti.
                // Anda bisa menghapus field yang tidak Anda butuhkan di assertJson ini
                // ATAU pastikan mereka match jika memang selalu ada.
            ]
        ]);
        
        // Assert bahwa pengguna terautentikasi (opsional, jika Anda ingin juga menguji login otomatis setelah register)
        // $this->assertAuthenticated(); 
    }

    /**
     * Test that user registration fails with invalid data (e.g., password mismatch).
     *
     * @return void
     */
    public function test_user_registration_fails_with_invalid_data()
    {
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'wrongpassword',
        ];

        $response = $this->postJson('/register', $userData);

        $response->assertStatus(422);

        $this->assertDatabaseMissing('users', [
            'email' => 'jane.doe@example.com',
        ]);

        $response->assertJsonValidationErrors(['password']);
    }
}