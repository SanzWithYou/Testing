<?php

namespace App\Models;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// Enum untuk role
enum UserRole: string {
    case User = 'user';
    case Seller = 'seller';
    case Admin = 'admin';
}

// Enum untuk status aplikasi seller
enum ApplicationStatus: string {
    case None = 'none';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}

// Enum untuk status akun user
enum UserStatus: string {
    case Active = 'active';
    case Blocked = 'blocked';
}

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'roles',
        'store_name',
        'application_status',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'roles' => 'array', // Cast roles ke array
        'application_status' => ApplicationStatus::class, // Cast ke enum
        'status' => UserStatus::class, // Cast ke enum
    ];

    // RELATIONSHIPS
    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id'); // Orders sebagai buyer
    }

    public function sales()
    {
        return $this->hasMany(Order::class, 'seller_id'); // Orders sebagai seller
    }

    public function sellerApplication()
    {
        return $this->hasOne(SellerApplication::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(ChatMessage::class, 'sender_id');
    }

    public function conversationsAsBuyer()
    {
        return $this->hasMany(ChatConversation::class, 'buyer_id');
    }

    public function conversationsAsSeller()
    {
        return $this->hasMany(ChatConversation::class, 'seller_id');
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    // HELPER METHODS UNTUK ROLES
    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles);
    }

    public function assignRole(string $role): void
    {
        if (!$this->hasRole($role)) {
            $roles = $this->roles;
            $roles[] = $role;
            $this->roles = array_unique($roles);
            $this->save();
        }
    }

    public function removeRole(string $role): void
    {
        if ($this->hasRole($role)) {
            $this->roles = array_values(array_diff($this->roles, [$role]));
            $this->save();
        }
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin->value);
    }

    public function isSeller(): bool
    {
        return $this->hasRole(UserRole::Seller->value);
    }
}