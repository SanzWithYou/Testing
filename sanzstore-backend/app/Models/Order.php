<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

// Enum untuk status order
enum OrderStatus: string {
    case Pending = 'pending';
    case Processing = 'processing';
    case Delivered = 'delivered';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}

// Enum untuk status pembayaran
enum PaymentStatus: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Failed = 'failed';
}

class Order extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'product_id', 'user_id', 'seller_id', 'total_amount', 
        'customer_name', 'customer_email', 'status', 'payment_method', 
        'payment_status', 'account_delivered_at', 'buyer_confirmed_receipt_at',
        'activity_log'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'account_delivered_at' => 'datetime',
        'buyer_confirmed_receipt_at' => 'datetime',
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
        'activity_log' => 'array',
    ];

    // Boot method untuk generate Order ID custom
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = 'ORD-' . date('Ymd') . '-' . Str::upper(Str::random(6));
            }
        });
    }

    // RELATIONSHIPS
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function chatConversation()
    {
        return $this->hasOne(ChatConversation::class);
    }
}