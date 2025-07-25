<?php
namespace Database\Factories;
use App\Models\ChatConversation;
use App\Models\User;
use App\Models\Product; // Digunakan untuk mencari seller
use App\Models\ConversationStatus; // Import Enum
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatConversation>
 */
class ChatConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ChatConversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $buyer = User::factory()->create();
        // Pastikan seller yang diambil adalah seller beneran atau buat baru
        $seller = User::factory()->seller()->create();

        // Cari produk dari seller ini, atau buat baru
        // $product = $seller->products()->inRandomOrder()->first() ?? Product::factory()->for($seller, 'seller')->create();
        // Removed product dependency from here to make it simpler and avoid infinite loops for testing
        // Product can be attached to Order, and then Order can be attached to Conversation if needed.

        return [
            // ID UUID akan di-generate otomatis oleh Model boot method
            'order_id' => null, // Default null, bisa di-attach nanti
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'status' => fake()->randomElement([ConversationStatus::Open->value, ConversationStatus::Closed->value]),
        ];
    }

    // Contoh state untuk attach product dan order
    public function forOrderAndUsers(Product $product, User $buyer, User $seller): static
    {
        return $this->state(fn (array $attributes) => [
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            // 'product_id' => $product->id, // Commented out as product_id is not directly on ChatConversation
        ]);
    }
}