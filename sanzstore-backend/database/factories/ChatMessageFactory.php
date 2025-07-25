<?php
namespace Database\Factories;
use App\Models\ChatMessage;
use App\Models\ChatConversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatMessage>
 */
class ChatMessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ChatMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pastikan ada conversation yang sudah ada atau buat baru
        $conversation = ChatConversation::inRandomOrder()->first() ?? ChatConversation::factory()->create();
        
        // Tentukan pengirim berdasarkan user ID di conversation
        $sender = fake()->randomElement([$conversation->buyer, $conversation->seller]);

        return [
            // ID UUID akan di-generate otomatis oleh Model boot method
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'text' => fake()->sentence(),
        ];
    }

    public function fromSender(User $sender): static
    {
        return $this->state(fn (array $attributes) => [
            'sender_id' => $sender->id,
        ]);
    }
}