<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;

class AiToolController extends Controller
{
    public function index(Request $request)
    {
        $query = AiTool::with(['categories', 'roles', 'tags', 'user']);

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        if ($request->filled('role_id')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('roles.id', $request->role_id);
            });
        }

        if ($request->filled('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url'],
            'documentation_url' => ['nullable', 'url'],
            'description' => ['required', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'real_examples' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url'],
            'difficulty_level' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
            'role_ids' => ['nullable', 'array'],
            'role_ids.*' => ['exists:roles,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:tags,id'],
        ]);

        $tool = AiTool::create([
            'name' => $validated['name'],
            'url' => $validated['url'],
            'documentation_url' => $validated['documentation_url'] ?? null,
            'description' => $validated['description'],
            'how_to_use' => $validated['how_to_use'] ?? null,
            'real_examples' => $validated['real_examples'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'difficulty_level' => $validated['difficulty_level'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'created_by_user_id' => $request->user()?->id,
        ]);

        $tool->categories()->sync($validated['category_ids'] ?? []);
        $tool->roles()->sync($validated['role_ids'] ?? []);
        $tool->tags()->sync($validated['tag_ids'] ?? []);

        return response()->json(
            $tool->load(['categories', 'roles', 'tags', 'user']),
            201
        );
    }

    public function show(AiTool $aiTool)
    {
        return response()->json(
            $aiTool->load(['categories', 'roles', 'tags', 'user'])
        );
    }

    public function update(Request $request, AiTool $aiTool)
    {
        if (
            $request->user()->role !== 'owner' &&
            $aiTool->created_by_user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Forbidden. You can only edit your own tools.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url'],
            'documentation_url' => ['nullable', 'url'],
            'description' => ['required', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'real_examples' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url'],
            'difficulty_level' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
            'role_ids' => ['nullable', 'array'],
            'role_ids.*' => ['exists:roles,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:tags,id'],
        ]);

        $aiTool->update([
            'name' => $validated['name'],
            'url' => $validated['url'],
            'documentation_url' => $validated['documentation_url'] ?? null,
            'description' => $validated['description'],
            'how_to_use' => $validated['how_to_use'] ?? null,
            'real_examples' => $validated['real_examples'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'difficulty_level' => $validated['difficulty_level'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        $aiTool->categories()->sync($validated['category_ids'] ?? []);
        $aiTool->roles()->sync($validated['role_ids'] ?? []);
        $aiTool->tags()->sync($validated['tag_ids'] ?? []);

        return response()->json(
            $aiTool->load(['categories', 'roles', 'tags', 'user'])
        );
    }

    public function destroy(Request $request, AiTool $aiTool)
    {
        if (
            $request->user()->role !== 'owner' &&
            $aiTool->created_by_user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Forbidden. You can only delete your own tools.',
            ], 403);
        }

        $aiTool->delete();

        return response()->json([
            'message' => 'Tool deleted successfully',
        ]);
    }
}