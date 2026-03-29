<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name' => 'Beginner Friendly', 'slug' => 'beginner-friendly'],
            ['name' => 'Popular', 'slug' => 'popular'],
            ['name' => 'Free', 'slug' => 'free'],
            ['name' => 'Paid', 'slug' => 'paid'],
            ['name' => 'Automation', 'slug' => 'automation'],
            ['name' => 'Team Use', 'slug' => 'team-use'],
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(
                ['slug' => $tag['slug']],
                $tag
            );
        }
    }
}