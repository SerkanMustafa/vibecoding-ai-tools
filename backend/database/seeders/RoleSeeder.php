<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Owner', 'slug' => 'owner'],
            ['name' => 'Backend Dev', 'slug' => 'backend'],
            ['name' => 'Frontend Dev', 'slug' => 'frontend'],
            ['name' => 'QA Engineer', 'slug' => 'qa'],
            ['name' => 'Product Manager', 'slug' => 'pm'],
            ['name' => 'Designer', 'slug' => 'designer'],
            ['name' => 'Data Scientist', 'slug' => 'data-scientist'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}