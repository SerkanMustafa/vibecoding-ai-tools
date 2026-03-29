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
        'created_by_user_id'
    ];

    // Tool → Categories (many-to-many)
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    // Tool → Roles (many-to-many)
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // Tool → Tags (many-to-many)
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    // Tool → User (who added it)
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}