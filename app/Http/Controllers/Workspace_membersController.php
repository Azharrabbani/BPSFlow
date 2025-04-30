<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class Workspace_membersController extends Controller
{

    public function index()
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
    
            Workspace::where('status', WorkspaceStatus::ACTIVE)
                ->where('id', '!=', $request->workspace)
                ->update(['status' => WorkspaceStatus::INACTIVE]);
            
        
            return redirect()->route('workspace.members', ['workspace' => $request->workspace]);
        } catch(Exception $e) {
            dd($e->getMessage());
        }
        
    }

    public function changeRole(Workspace_members $member)
    {
        $user = Auth::user();


        $member->update([
            'status' => WorkspaceMembersStatus::ADMIN,
        ]);

        $workspace = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();

        return redirect()->route('workspace.members', ['workspace' => $workspace]);
    }

    public function deleteMember(Workspace_members $member)
    {
        $user = Auth::user();

        dd($member);

        $member->delete();

        $workspace = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();

         return redirect()->route('workspace.members', ['workspace' => $workspace]);
    }

    public function createMember($user_id, $workspace, $role)
    {
        Workspace_members::create([
            'user_id' => $user_id,
            'workspace_id' => $workspace,
            'status' => $role, 
        ]);
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
