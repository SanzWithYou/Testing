<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

// ApplicationStatus sudah didefinisikan di User.php, bisa langsung digunakan
// use App\Models\ApplicationStatus; // Tidak perlu, karena sudah di namespace App\Models

class SellerApplication extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id', 'store_name', 'description', 'status', 
        'rejection_reason', 'contact_email', 'contact_phone', 
        'game_types', 'payment_methods', 'social_link', 'id_document_url'
    ];

    protected $casts = [
        'status' => ApplicationStatus::class,
        'game_types' => 'array',
        'payment_methods' => 'array',
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
}