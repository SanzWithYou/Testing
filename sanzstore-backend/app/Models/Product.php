<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

// Enum untuk status produk
enum ProductStatus: string {
    case Available = 'available';
    case Sold = 'sold';
}

class Product extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name', 'category', 'sub_category', 'price', 'description', 
        'image_url', 'seller_id', 'status', 'account_username', 
        'account_password', 'is_email_verified'
    ];

    protected $casts = [
        'price' => 'float',
        'is_email_verified' => 'boolean',
        'status' => ProductStatus::class,
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
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }
}