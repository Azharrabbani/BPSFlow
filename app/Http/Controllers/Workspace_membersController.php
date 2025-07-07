<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use App\Http\Requests\WorkspaceMemberRequest;
use App\Models\Space;
use App\Models\Space_members;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class Workspace_membersController extends Controller
{

    public function index()
    {
        try {
            $user = Auth::user();
            
            $activeWorkspaces = new ActiveWorkspaceController();
    
            $workspace = $activeWorkspaces->getActiveWorkspace($user->id);
            
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
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }


    public function invite(Request $request)
    {   
        try{
            $workspace_members = new Workspace_membersController();

            $request->validate([
                'email' => 'required|email',
                'role' => 'required|in:admin,member',
                'workspace' => 'required|exists:workspaces,id',
            ]);
        
            $user = User::where('email', $request->email)->first();
        
            if (!$user) {
                return redirect()->back()->withErrors(['email' => 'User dengan email ini tidak ditemukan']);
            }
    
            $user_exist = Workspace_members::where(['user_id' => $user->id, 'workspace_id' => $request->workspace])->first();
            
            if ($user_exist) {
                return redirect()->back()->withErrors(['email' => 'User sudah menjadi member']);
            }
    
            $workspace_members->createMember($user->id, $request->workspace, $request->role);

            $publicSpaces = Space::where([
                'workspace_id' => $request->workspace,
                'status' => 'public'
            ])->get();

            foreach ($publicSpaces as $space) {
                Space_members::create([
                    'space_id' => $space->id,
                    'user_id' => $user->id,
                ]);
            }

        
            return redirect()->route('workspace.members', ['workspace' => $request->workspace]);
        } catch(Exception $e) {
            return redirect()->back()->withErrors(['email' => $e->getMessage()]);
        }
        
    }

    public function changeRole(Request $request ,Workspace_members $member)
    {
        $user = Auth::user();

        $role = $request->validate([
            'role' => 'required|string',
        ]);

        $member->update([
            'status' => $role['role']
        ]);

        return redirect()->route('workspace.members', ['workspace' => $request->workspace]);
    }

    public function deleteMember(Workspace_members $member)
    {
        try {
            $user = Auth::user();

            $activeWorkspaces = new ActiveWorkspaceController();

            
            $spaceIds = Space::where('workspace_id', $member->workspace_id)->pluck('id');

            
            Space_members::where('user_id', $member->user_id)
                   ->whereIn('space_id', $spaceIds)
                   ->delete();
    
            $member->delete();
    
            $workspace = $activeWorkspaces->getActiveWorkspace($user->id);
    
             return redirect()->route('workspace.members', ['workspace' => $workspace->workspace_id]);
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function createMember($user_id, $workspace, $role)
    {
        try {
            Workspace_members::create([
                'user_id' => $user_id,
                'workspace_id' => $workspace,
                'status' => $role, 
            ]);

        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function getMembers($id)
    {
        return Workspace_members::where('workspace_id', $id)
        ->with('user')
        ->get();
    }

    public function getMembersStatus($id)
    {
        return Workspace_members::where('workspace_id', $id)->get();
    }
}
