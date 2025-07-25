<?php

namespace Database\Factories;
use App\Models\SellerApplication;
use App\Models\User;
use App\Models\ApplicationStatus; // Import Enum
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SellerApplication>
 */
class SellerApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SellerApplication::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create(); // User yang mengajukan
        
        return [
            // ID UUID akan di-generate otomatis oleh Model boot method
            'user_id' => $user->id,
            'store_name' => fake()->unique()->company() . ' Gaming Store', // Pastikan nama toko unik
            'description' => fake()->paragraph(),
            'status' => ApplicationStatus::Pending->value, // Default pending
            'rejection_reason' => null,
            'contact_email' => $user->email, // Default email user
            'contact_phone' => fake()->phoneNumber(),
            'game_types' => fake()->randomElements(['MOBA', 'FPS', 'RPG', 'Strategy', 'Simulation'], rand(1, 3)),
            'payment_methods' => fake()->randomElements(['Dana', 'OVO', 'Gopay', 'Bank Transfer', 'Virtual Account'], rand(1, 3)),
            'social_link' => fake()->boolean(70) ? fake()->url() : null, // 70% kemungkinan punya social link
            'id_document_url' => fake()->boolean(90) ? fake()->imageUrl(640, 480, 'id-card', true) : null,
        ];
    }

    /**
     * Indicate that the application is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ApplicationStatus::Approved->value,
        ]);
    }

    /**
     * Indicate that the application is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ApplicationStatus::Rejected->value,
            'rejection_reason' => fake()->paragraphs(1, true),
        ]);
    }
}