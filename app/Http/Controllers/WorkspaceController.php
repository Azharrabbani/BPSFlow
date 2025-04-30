<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\WorkspaceMemberRequest;
use App\Http\Requests\WorkspaceRequest;
use App\Mail\WorkspaceInvitation;
use App\Models\Space;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index() 
    {
        $user = Auth::user();

        $workspaces = new WorkspaceController();

        $spaces = new SpaceController();

        $workspace_members = new Workspace_membersController();
    
        $activeMembership = $workspaces->getActiveWorkspace($user->id);

        $spaces = $spaces->getSpaces($activeMembership->workspace_id);

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
    
        return Inertia::render('Dashboard', [
            'workspace' => $workspace,
            'members' => $members,
            'activeMembers' => $activeMembers,
            'activeMembersStatus' => $activeMembersStatus,
            'activeWorkspace' => $activeWorkspace,
            'spaces' => $spaces
        ]);
    }
    

    public function edit (Workspace $workspace) 
    {
        $activeMembersStatus = Workspace_members::where('workspace_id', $workspace->id)->get();

        // dd($activeMembersStatus);

        return Inertia::render('Workspace/UpdateWorkspace', [
            'workspace' => $workspace,
            'activeMembersStatus' => $activeMembersStatus
        ]);
    }
    

    // public function sendInvitation(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'role' => 'required|in:admin,member',
    //         'workspace' => 'required|exists:workspaces,id',
    //     ]);
    
    //     $user = $request->email;
    //     $workspace = Workspace::findOrFail($request->workspace);
    //     $inviter = Auth::user();

    //     Mail::to($user)->send(new WorkspaceInvitation($workspace, $inviter, $user));
    //     return redirect()->route('workspace.members', ['workspace' => $workspace->id]);
    // }

    // public function invite(Request $request)
    // {
    //     try{
    //         $request->validate([
    //             'email' => 'required|email',
    //             'role' => 'required|in:admin,member',
    //             'workspace' => 'required|exists:workspaces,id',
    //         ]);
        
    //         $user = User::where('email', $request->email)->first();
        
    //         if (!$user) {
    //             throw ValidationException::withMessages([
    //                 'email' => 'User dengan email ini tidak ditemukan.',
    //             ]);
    //         }
    
    //         $user_exist = Workspace_members::where(['user_id' => $user->id, 'workspace_id' => $request->workspace])->first();
            
    //         if ($user_exist) {
    //             throw ValidationException::withMessages([
    //                 'user' => 'User sudah menjadi member atau sudah di undang.',
    //             ]);
    //         }
    
    //         Workspace_members::create([
    //             'user_id' => $user->id,
    //             'workspace_id' => $request->workspace,
    //             'status' => $request->role, 
    //         ]);
    
            
    //         Workspace::where('status', WorkspaceStatus::ACTIVE)
    //             ->where('id', '!=', $request->workspace)
    //             ->update(['status' => WorkspaceStatus::INACTIVE]);
            
        
    //         return redirect()->route('workspace.members', ['workspace' => $request->workspace]);
    //     } catch(Exception $e) {
    //         dd($e->getMessage());
    //     }
        
    // }

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

    public function getActiveWorkspace($id)
    {
        return Workspace_members::where('user_id', $id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();
    }

    public function getInactiveWorkspace($id)
    {
        return Workspace_members::where('user_id', $id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::INACTIVE);
            })
            ->with('workspace')
            ->orderBy('id', 'DESC')
            ->get()
            ->pluck('workspace');
    }
}
