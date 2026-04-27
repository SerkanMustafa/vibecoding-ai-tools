<?php

use App\Http\Controllers\Api\AiToolController;
use App\Http\Controllers\Api\AuthController;
use App\Models\Category;
use App\Models\Role;
use App\Models\Tag;
use Illuminate\Support\Facades\Route;

Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Laravel API is working',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/tools', [AiToolController::class, 'index']);
    Route::post('/tools', [AiToolController::class, 'store']);
    Route::get('/tools/{aiTool}', [AiToolController::class, 'show']);
    Route::put('/tools/{aiTool}', [AiToolController::class, 'update']);
    Route::delete('/tools/{aiTool}', [AiToolController::class, 'destroy']);

    Route::get('/categories', function () {
        return response()->json(Category::orderBy('name')->get());
    });

    Route::get('/roles', function () {
        return response()->json(Role::orderBy('name')->get());
    });

    Route::get('/tags', function () {
        return response()->json(Tag::orderBy('name')->get());
    });
});

use App\Http\Controllers\Api\ToolAdminController;

Route::middleware(['auth:sanctum', 'role:owner'])->prefix('admin')->group(function () {
    Route::get('/tools', [ToolAdminController::class, 'index']);
    Route::patch('/tools/{tool}/approve', [ToolAdminController::class, 'approve']);
    Route::patch('/tools/{tool}/reject', [ToolAdminController::class, 'reject']);
});
use App\Http\Controllers\Api\TwoFactorController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);
});

use App\Http\Controllers\Api\CommentController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tools/{tool}/comments', [CommentController::class, 'index']);
    Route::post('/tools/{tool}/comments', [CommentController::class, 'store']);
});