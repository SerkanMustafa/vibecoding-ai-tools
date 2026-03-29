<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'tool_id',
        'user_id',
        'content',
        'rating',
    ];

    public function tool()
    {
        return $this->belongsTo(AiTool::class, 'tool_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}