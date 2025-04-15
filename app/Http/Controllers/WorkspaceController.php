<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\WorkspaceRequest;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index() 
    {
        $user = Auth::user();
        
        $activeWorkspace = Workspace::where('user_id', $user->id)
        ->where('status', WorkspaceStatus::ACTIVE)
        ->first();

        if (!$activeWorkspace) {
            $firstInactive = Workspace::where('user_id', $user->id)
                ->where('status', WorkspaceStatus::INACTIVE)
                ->first();
        
            if ($firstInactive) {
                $firstInactive->update(['status' => WorkspaceStatus::ACTIVE]);
                $activeWorkspace = $firstInactive;
            }
        }
        

        $workspace = Workspace::find($user->id)
            ->where(['user_id' => $user->id, 'status' => WorkspaceStatus::INACTIVE])
            ->orderBy('id', 'DESC')->get();

        return Inertia::render('Dashboard', [
            'workspace' => $workspace,
            'activeWorkspace' => $activeWorkspace,
        ]);
    }

    public function edit (Workspace $workspace) 
    {
        return Inertia::render('UpdateWorkspace', [
            'workspace' => $workspace
        ]);
    }

    public function store(WorkspaceRequest $request) 
    {
        $user = $request->validated();

        Workspace::where('status', WorkspaceStatus::ACTIVE)
            ->update(['status' => WorkspaceStatus::INACTIVE]);

        $user['status'] = WorkspaceStatus::ACTIVE;
        
        $workspace = Workspace::create($user);

        Workspace_members::create([
            'user_id' => $user['user_id'],
            'workspace_id' => $workspace->id,
            'status' => WorkspaceMembersStatus::OWNER
        ]);

        return redirect('/dashboard');
    }

    public function switchWorkspace(Workspace $workspace)
    {
        $user = Auth::user();

        Workspace::where('user_id', $user->id)
            ->where('status', WorkspaceStatus::ACTIVE)
            ->update(['status' => WorkspaceStatus::INACTIVE]);

        $workspace->update([
            'status' => WorkspaceStatus::ACTIVE,
        ]);

        return redirect('/dashboard');
    }

    public function update(WorkspaceRequest $request, Workspace $workspace) 
    {
        $data = $request->validated();
    
        $workspace->update([
            'name' => $data['name'],
        ]);

        return redirect()->route('workspace.edit', $workspace);
    }

    public function deleteConfirmation(Workspace $workspace)
    {
        return Inertia::render('DeleteConfirmPage', [
            'workspace' => $workspace,
        ]);
    }

    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return redirect('/dashboard');
    }
}
