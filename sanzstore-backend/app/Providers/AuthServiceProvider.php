<?php

namespace App\Providers;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate; // Import Gate
use App\Models\User; // Import User Model
use App\Models\UserRole; // Import UserRole Enum

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define Gates for roles
        Gate::define('admin', function (User $user) {
            return $user->hasRole(UserRole::Admin->value);
        });

        Gate::define('seller', function (User $user) {
            return $user->hasRole(UserRole::Seller->value);
        });

        // Implicitly grant "admin" role all permissions
        Gate::before(function (User $user, string $ability) {
            if ($user->hasRole(UserRole::Admin->value)) {
                return true;
            }
        });
    }
}