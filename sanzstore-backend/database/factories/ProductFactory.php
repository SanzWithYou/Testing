<?php

namespace Database\Factories;
use App\Models\Product;
use App\Models\User;
use App\Models\ProductStatus; // Import Enum
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pastikan ada seller yang dibuat atau diambil
        $seller = User::factory()->seller()->create();

        return [
            // ID UUID akan di-generate otomatis oleh Model boot method
            'seller_id' => $seller->id,
            'name' => fake()->words(rand(2,4), true) . ' Account',
            'category' => fake()->randomElement(['Game Account', 'Software License', 'Voucher']),
            'sub_category' => fake()->randomElement(['Mobile Legends', 'Valorant', 'Steam', 'Windows', 'Microsoft Office', 'Google Play']),
            'price' => fake()->randomFloat(2, 10000, 1000000),
            'description' => fake()->paragraphs(rand(2, 5), true),
            'image_url' => fake()->imageUrl(640, 480, 'gaming', true), // Placeholder image
            'status' => ProductStatus::Available->value,
            'account_username' => fake()->userName(),
            'account_password' => fake()->password(8, 16),
            'is_email_verified' => fake()->boolean(80), // 80% kemungkinan email verified
        ];
    }

    /**
     * Define sold state for the product.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProductStatus::Sold->value,
        ]);
    }
}