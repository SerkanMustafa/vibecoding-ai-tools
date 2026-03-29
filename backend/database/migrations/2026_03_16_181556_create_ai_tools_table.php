<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_tools', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('url');
    $table->string('documentation_url')->nullable();
    $table->text('description');
    $table->text('how_to_use')->nullable();
    $table->text('real_examples')->nullable();
    $table->string('image_url')->nullable();
    $table->string('difficulty_level')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->foreignId('created_by_user_id')->nullable()->constrained('users');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tools');
    }
};
