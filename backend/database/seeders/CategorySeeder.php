<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Coding', 'slug' => 'coding'],
            ['name' => 'Research', 'slug' => 'research'],
            ['name' => 'Documentation', 'slug' => 'documentation'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Productivity', 'slug' => 'productivity'],
            ['name' => 'Testing', 'slug' => 'testing'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}