<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ToolAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = AiTool::with(['categories', 'roles', 'tags', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
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

        return response()->json(
            $query->latest()->get()
        );
    }

    public function approve(AiTool $tool)
    {
        ActivityLog::create([
    'user_id' => auth()->id(),
    'action' => 'approve',
    'model_type' => 'tool',
    'model_id' => $tool->id,
]);
        
        $tool->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Tool approved successfully.',
            'tool' => $tool->fresh(['categories', 'roles', 'tags', 'user']),
        ]);
    }

    public function reject(AiTool $tool)
    {
        ActivityLog::create([
    'user_id' => auth()->id(),
    'action' => 'approve',
    'model_type' => 'tool',
    'model_id' => $tool->id,
]);
        $tool->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Tool rejected successfully.',
            'tool' => $tool->fresh(['categories', 'roles', 'tags', 'user']),
        ]);
    }
}