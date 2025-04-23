<?php

namespace App\Http\Controllers;


use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\WorkspaceRequest;
use App\Mail\WorkspaceInvitation;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;

class InboxController extends Controller
{
    public function index() 
    {
        $user = Auth::user();
    
        // Cari workspace aktif dari relasi workspace_members
        $activeMembership = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();
    
        $activeWorkspace = null;
        if ($activeMembership) {
            $activeWorkspace = $activeMembership->workspace;
        } else {
            
            $firstInactive = Workspace_members::where('user_id', $user->id)
                ->whereHas('workspace', function ($query) {
                    $query->where('status', WorkspaceStatus::INACTIVE);
                })
                ->first();
    
            if ($firstInactive) {
                $firstInactive->workspace->update([
                    'status' => WorkspaceStatus::ACTIVE
                ]);
                $activeWorkspace = $firstInactive->workspace;
            }
        }
    
        $workspace = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::INACTIVE);
            })
            ->with('workspace')
            ->orderBy('id', 'DESC')
            ->get()
            ->pluck('workspace');

        return Inertia::render([
            'workspace' => $workspace,
            'workspace_active' => $activeWorkspace
        ]);
    }
}
