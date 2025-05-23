<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceStatus;
use App\Models\assignments;
use App\Models\Workspace_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssignmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $workspaces = new WorkspaceController();

        $spaces = new SpaceController();

        $workspace_members = new Workspace_membersController();
    
        $activeMembership = $workspaces->getActiveWorkspace($user->id);

        $publicSpaces = $spaces->getPublicSpaces($activeMembership->workspace_id);

        $privateSpaces = $spaces->getPrivateSpaces($activeMembership->workspace_id, $user->id);

        $getSpaces = array();
        array_push($getSpaces, $publicSpaces, $privateSpaces);
        
        $members = $workspace_members->getMembers($activeMembership->workspace_id);

        if (!$activeMembership) {
            $firstInactive = Workspace_members::where('user_id', $user->id)
                ->whereHas('workspace', function ($query) {
                    $query->where('status', WorkspaceStatus::INACTIVE);
                })
                ->first();
    
            if ($firstInactive) {
                $firstInactive->workspace->update([
                    'status' => WorkspaceStatus::ACTIVE
                ]);
    
                $activeMembership = Workspace_members::where('user_id', $user->id)
                    ->whereHas('workspace', function ($query) {
                        $query->where('status', WorkspaceStatus::ACTIVE);
                    })
                    ->first();
            }
        }
    
        if (!$activeMembership) {
            return Inertia::render('Dashboard', [
                'workspace' => [],
                'activeMembers' => 0,
                'activeMembersStatus' => [],
                'activeWorkspace' => null,
            ]);
        }
    
        $activeWorkspace = $activeMembership->workspace;

        $activeMembers = Workspace_members::where('workspace_id', $activeMembership->workspace_id)->count();

        $activeMembersStatus = $workspace_members->getMembersStatus($activeMembership->workspace_id);
    
        $workspace = $workspaces->getInactiveWorkspace($user->id);
    
        return Inertia::render('Assignment/Index', [
            'workspace' => $workspace,
            'members' => $members,
            'activeMembers' => $activeMembers,
            'activeMembersStatus' => $activeMembersStatus,
            'activeWorkspace' => $activeWorkspace,
            'getSpaces' => $getSpaces,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(assignments $assignments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(assignments $assignments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, assignments $assignments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(assignments $assignments)
    {
        //
    }
}
