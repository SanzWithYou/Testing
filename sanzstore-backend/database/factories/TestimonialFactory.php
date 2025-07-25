<?php
namespace Database\Factories;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\Product;
use App\Models\TestimonialStatus; // Import Enum
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Testimonial::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pastikan user adalah user biasa/buyer
        $user = User::factory()->create();
        // Product bisa dari seller manapun atau di skip
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        
        return [
            'user_id' => $user->id,
            'product_id' => fake()->boolean(70) ? $product->id : null, // 70% kemungkinan ada produk terkait
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->paragraph(rand(1, 3)), // <-- PERBAIKAN: Hapus ->optional() atau pastikan nullablenya di migrasi
            'status' => TestimonialStatus::Approved->value, // Default approved untuk dummy
        ];
    }

    /**
     * Indicate that the testimonial is pending review.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TestimonialStatus::Pending->value,
        ]);
    }

    /**
     * Indicate that the testimonial is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TestimonialStatus::Approved->value,
        ]);
    }

    /**
     * Indicate that the testimonial is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TestimonialStatus::Rejected->value,
        ]);
    }
}