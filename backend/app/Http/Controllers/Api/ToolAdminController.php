<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AiTool;
use Illuminate\Http\Request;

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
            $query->latest()->paginate(10)
        );
    }

    public function approve(Request $request, AiTool $tool)
    {
        $tool->update([
            'status' => 'approved',
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'approve',
            'model_type' => AiTool::class,
            'model_id' => $tool->id,
        ]);

        return response()->json([
            'message' => 'Tool approved successfully.',
            'tool' => $tool->fresh(['categories', 'roles', 'tags', 'user']),
        ]);
    }

    public function reject(Request $request, AiTool $tool)
    {
        $tool->update([
            'status' => 'rejected',
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'reject',
            'model_type' => AiTool::class,
            'model_id' => $tool->id,
        ]);

        return response()->json([
            'message' => 'Tool rejected successfully.',
            'tool' => $tool->fresh(['categories', 'roles', 'tags', 'user']),
        ]);
    }
}