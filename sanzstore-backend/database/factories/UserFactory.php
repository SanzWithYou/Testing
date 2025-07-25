<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\UserRole; // Import UserRole Enum
use App\Models\ApplicationStatus; // Import ApplicationStatus Enum
use App\Models\UserStatus; // Import UserStatus Enum

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'), // default password: password
            'remember_token' => Str::random(10),
            'roles' => [UserRole::User->value], // Default role: user
            'store_name' => null, // Default
            'application_status' => ApplicationStatus::None->value, // Default
            'status' => UserStatus::Active->value, // Default
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Define seller state for the user.
     */
    public function seller(): static
    {
        return $this->state(fn (array $attributes) => [
            'roles' => array_unique(array_merge($attributes['roles'] ?? [UserRole::User->value], [UserRole::Seller->value])),
            'store_name' => fake()->company() . ' Store',
            'application_status' => ApplicationStatus::Approved->value, // Asumsi seller yang dibuat factory sudah approved
        ]);
    }

    /**
     * Define admin state for the user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'roles' => array_unique(array_merge($attributes['roles'] ?? [UserRole::User->value], [UserRole::Admin->value, UserRole::Seller->value])), // Admin juga bisa jadi seller
            'store_name' => fake()->company() . ' Admin Store', // Optional, admin juga bisa punya toko
            'application_status' => ApplicationStatus::Approved->value,
        ]);
    }

    /**
     * Define blocked state for the user.
     */
    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => UserStatus::Blocked->value,
        ]);
    }
}