<?php
namespace Database\Factories;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create(); // Buyer
        $product = Product::factory()->create(); // Produk yang dijual
        $seller = $product->seller; // Ambil seller dari produk

        return [
            // ID custom akan di-generate oleh Model boot method
            'product_id' => $product->id,
            'user_id' => $user->id,
            'seller_id' => $seller->id,
            'total_amount' => $product->price, // Total amount = harga produk
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'status' => OrderStatus::Pending->value,
            'payment_method' => fake()->randomElement(['COD', 'Transfer', 'Wallet', 'Midtrans']), // Tambah Midtrans
            'payment_status' => PaymentStatus::Pending->value,
            'account_delivered_at' => null,
            'buyer_confirmed_receipt_at' => null,
            'activity_log' => [], // Default empty array for activity log
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Completed->value,
            'payment_status' => PaymentStatus::Paid->value,
            'account_delivered_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'buyer_confirmed_receipt_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'activity_log' => [
                ['timestamp' => now()->subDays(5)->toISOString(), 'activity' => 'Order created'],
                ['timestamp' => now()->subDays(4)->toISOString(), 'activity' => 'Payment received'],
                ['timestamp' => now()->subDays(3)->toISOString(), 'activity' => 'Account delivered to buyer'],
                ['timestamp' => now()->subDays(2)->toISOString(), 'activity' => 'Buyer confirmed receipt'],
                ['timestamp' => now()->toISOString(), 'activity' => 'Order completed'],
            ],
        ]);
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => PaymentStatus::Paid->value,
            'activity_log' => [
                ['timestamp' => now()->subDays(2)->toISOString(), 'activity' => 'Order created'],
                ['timestamp' => now()->subDays(1)->toISOString(), 'activity' => 'Payment received'],
            ],
        ]);
    }
}