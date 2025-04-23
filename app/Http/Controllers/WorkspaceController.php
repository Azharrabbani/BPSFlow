<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\WorkspaceRequest;
use App\Mail\WorkspaceInvitation;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class WorkspaceController extends Controller
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
    
        return Inertia::render('Dashboard', [
            'workspace' => $workspace,
            'activeWorkspace' => $activeWorkspace,
        ]);
    }
    

    public function edit (Workspace $workspace) 
    {
        return Inertia::render('Workspace/UpdateWorkspace', [
            'workspace' => $workspace
        ]);
    }

    public function members()
    {
        $user = Auth::user();

        $workspace = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();

        if (!$workspace) {
            return redirect()->back()->withErrors(['message' => 'No active workspace found.']);
        }

        $members = Workspace_members::where('workspace_id', $workspace->workspace_id)
            ->with('user')
            ->get();

        return Inertia::render('Workspace/Members', [
            'workspace' => $workspace->workspace,
            'members' => $members
        ]);
    }

    public function sendInvitation(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,member',
            'workspace' => 'required|exists:workspaces,id',
        ]);
    
        $user = $request->email;
        $workspace = Workspace::findOrFail($request->workspace);
        $inviter = Auth::user();

        Mail::to($user)->send(new WorkspaceInvitation($workspace, $inviter, $user));
        return redirect()->route('workspace.members', ['workspace' => $workspace->id]);
    }

    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,member',
            'workspace' => 'required|exists:workspaces,id',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        $user_exist = Workspace_members::where('user_id', $user->id)->first();

        if($user_exist) {
            return back()->withErrors(['user' => 'User sudah menjadi member atau sudah di undang']);
        }

        if (!$user) {
            return back()->withErrors(['email' => 'User dengan email ini tidak ditemukan.']);
        }
    
        $workspace = Workspace::find($request->workspace);
    
        Workspace_members::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
            'status' => $request->role, 
        ]);
    
        return redirect()->route('workspace.members', ['workspace' => $workspace->id]);
    }

    public function store(WorkspaceRequest $request) 
    {
        $user = Auth::user();
        $currentWorkspace = $request->validated();

        Workspace::where('status', WorkspaceStatus::ACTIVE)
            ->update(['status' => WorkspaceStatus::INACTIVE]);

        $currentWorkspace['status'] = WorkspaceStatus::ACTIVE;
        

        $workspace = Workspace::create([
            'name' => $currentWorkspace['name'],
            'status' => $currentWorkspace['status']
        ]);

        Workspace_members::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
            'status' => WorkspaceMembersStatus::OWNER
        ]);

        return redirect('/dashboard');
    }

    public function switchWorkspace(Workspace $workspace)
    {
        $user = Auth::user();

        Workspace::where('status', WorkspaceStatus::ACTIVE)
            ->whereHas('members', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
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
        return Inertia::render('Workspace/DeleteConfirmPage', [
            'workspace' => $workspace,
        ]);
    }

    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return redirect('/dashboard');
    }
}
