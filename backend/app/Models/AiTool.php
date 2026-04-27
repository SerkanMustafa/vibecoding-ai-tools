<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiTool extends Model
{
    protected $fillable = [
        'name',
        'url',
        'documentation_url',
        'description',
        'how_to_use',
        'real_examples',
        'image_url',
        'difficulty_level',
        'is_featured',
        'status',
        'created_by_user_id',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'tool_id');
    }
}