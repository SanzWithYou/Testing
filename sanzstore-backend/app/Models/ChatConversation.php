<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

// Enum untuk status conversation
enum ConversationStatus: string {
    case Open = 'open';
    case Closed = 'closed';
}

class ChatConversation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'order_id', 'buyer_id', 'seller_id', 'status'
    ];

    protected $casts = [
        'status' => ConversationStatus::class,
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
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'conversation_id')->orderBy('created_at', 'asc');
    }

    // Accessor untuk last_message dan last_message_timestamp
    public function getLastMessageAttribute(): ?string
    {
        return $this->messages->last()?->text;
    }

    public function getLastMessageTimestampAttribute(): ?string
    {
        return $this->messages->last()?->created_at?->toISOString(); // Format ISO string
    }
}