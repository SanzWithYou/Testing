<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

// Enum untuk status testimonial
enum TestimonialStatus: string {
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}

class Testimonial extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id', 'product_id', 'rating', 'comment', 'status'
    ];

    protected $casts = [
        'rating' => 'integer',
        'status' => TestimonialStatus::class,
    ];

    // Boot method untuk generate UUID secara otomatis
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->{$model->getKeyName()} = (string) Str::uuid();
        });
    }

    // RELATIONSHIPS
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Accessors untuk user_name dan user_avatar_url (ini akan mengambil data dari relasi user)
    public function getUserNameAttribute(): ?string
    {
        return $this->user->name ?? null;
    }

    public function getUserAvatarUrlAttribute(): ?string
    {
        // Asumsi user punya kolom avatar_url atau default gravatar
        return $this->user->avatar_url ?? 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($this->user->email ?? ''))) . '?d=identicon';
    }
}