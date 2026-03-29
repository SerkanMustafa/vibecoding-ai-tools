<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index($toolId)
    {
        return Comment::with('user')
            ->where('tool_id', $toolId)
            ->latest()
            ->get();
    }

    public function store(Request $request, $toolId)
    {
        $request->validate([
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $comment = Comment::create([
            'tool_id' => $toolId,
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
            'rating' => $request->input('rating'),
        ]);

        return response()->json($comment, 201);
    }
}