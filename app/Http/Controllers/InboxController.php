<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use App\Enums\WorkspaceStatus;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspace_members;

class InboxController extends Controller
{
    public function index() 
    {
        $user = Auth::user();
    
        $activeMembership = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();

        $space_data = new SpaceController();

        $spaces =  $space_data->getSpaces($activeMembership->workspace_id);
        
        // Mendapatkan member workspace yang sedang active
        $activeMembers = Workspace_members::where('workspace_id', $activeMembership->workspace_id)->count();
        $activeMembersStatus = Workspace_members::where('workspace_id', $activeMembership->workspace_id)->get();
    
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
        
        return Inertia::render('Inbox/Index', [
            'workspace' => $workspace,
            'activeMembers' => $activeMembers,
            'activeMembersStatus' => $activeMembersStatus,
            'activeWorkspace' => $activeWorkspace,
            'spaces' => $spaces
        ]);
    }
}
