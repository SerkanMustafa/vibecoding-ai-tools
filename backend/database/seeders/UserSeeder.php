<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'ivan@admin.local'],
            [
                'name' => 'Иван Иванов',
                'role' => 'owner',
                'password' => 'password',
            ]
        );

        User::updateOrCreate(
            ['email' => 'elena@frontend.local'],
            [
                'name' => 'Елена Петрова',
                'role' => 'frontend',
                'password' => 'password',
            ]
        );

        User::updateOrCreate(
            ['email' => 'petar@backend.local'],
            [
                'name' => 'Петър Георгиев',
                'role' => 'backend',
                'password' => 'password',
            ]
        );
    }
}