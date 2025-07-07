<?php

namespace App\Http\Controllers;

use App\Enums\SpaceStatus;
use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\WorkspaceMemberRequest;
use App\Http\Requests\WorkspaceRequest;
use App\Mail\WorkspaceInvitation;
use App\Models\ActiveWorkspace;
use App\Models\Project;
use App\Models\Space;
use App\Models\Tasks;
use App\Models\Space_members;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index() 
    {
        try{
            $user = Auth::user();

            $userId = $user->id;

            $spaces = new SpaceController();

            $workspace_members = new Workspace_membersController();

            $activeWorkspaces = new ActiveWorkspaceController();
        
            $activeMembership = $activeWorkspaces->getActiveWorkspace($userId);

            $publicSpaces = $spaces->getPublicSpaces($activeMembership->workspace_id);

            $privateSpaces = $spaces->getPrivateSpaces($activeMembership->workspace_id, $userId);

            $getWorkspaceSpaces = array();
            array_push($getWorkspaceSpaces, $publicSpaces, $privateSpaces);
            
            $members = $workspace_members->getMembers($activeMembership->workspace_id);

            if (!$activeMembership) {
                return Inertia::render('Workspace/CreateWorkspace');
            }
        
            if (!$activeMembership) {
                return Inertia::render('Dashboard', [
                    'workspace' => [],
                    'activeMembers' => 0,
                    'activeMembersStatus' => [],
                    'activeWorkspace' => null,
                ]);
            }
        
            $activeWorkspace = $activeWorkspaces->getActiveWorkspace($userId);

            $getSpaces = Space::with(['project.tasks.assignments'])
                ->where('workspace_id', $activeWorkspace->workspace_id)
                ->whereHas('space_member', function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                })
                ->whereHas('project', function ($query) {
                    $query->whereHas('tasks', function ($query) {
                        $query->whereHas('assignments');
                    });
                })
                ->get();
        
            $activeMembersStatus = $workspace_members->getMembersStatus($activeMembership->workspace_id);
        
            $workspace = Workspace_members::whereNot('workspace_id', $activeWorkspace->workspace_id)->where('user_id', $userId)->with('workspace')->get();
        
            return Inertia::render('Dashboard', [
                'workspace' => $workspace,
                'members' => $members,
                'activeMembersStatus' => $activeMembersStatus,
                'activeWorkspace' => $activeWorkspace,
                'getWorkspaceSpaces' => $getWorkspaceSpaces,
                'getSpaces' => $getSpaces
            ]);
        } catch (ModelNotFoundException $e) {
            return Inertia::render('Workspace/CreateWorkspace');
        }
        catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
        
    }
    

    public function edit (Workspace $workspace) 
    {
        $activeMembersStatus = Workspace_members::where('workspace_id', $workspace->id)->get();

        return Inertia::render('Workspace/UpdateWorkspace', [
            'workspace' => $workspace,
            'activeMembersStatus' => $activeMembersStatus
        ]);
    }

    public function workspace (Workspace $workspace) 
    {
        $user = Auth::user();

        $activeMembersStatus = Workspace_members::where('workspace_id', $workspace->id)->get();

        $activeWorkspaces = new ActiveWorkspaceController();

        $activeWorkspace = $activeWorkspaces->getActiveWorkspace($user->id);

        $workspaceList = Workspace_members::whereNot('workspace_id', $activeWorkspace->workspace_id)->where('user_id', $user->id)->with('workspace')->get();

        return Inertia::render('Workspace/Index', [
            'workspaceDetail' => $workspace,
            'activeMembersStatus' => $activeMembersStatus,
            'workspaceList' => $workspaceList
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
        try{
            $user = Auth::user();
            
            $currentWorkspace = $request->validated();
            
            $workspace = Workspace::create([
                'name' => $currentWorkspace['name'],
            ]);
    
            Workspace_members::create([
                'user_id' => $user->id,
                'workspace_id' => $workspace->id,
                'status' => WorkspaceMembersStatus::OWNER
            ]);

            $activeWorkspace = new ActiveWorkspaceController();

            $iscreated = ActiveWorkspace::where('user_id', $user->id)->get();

            if (empty($iscreated[0])) {
                $activeWorkspace->store($user->id, $workspace->id);
            } else {
                $activeWorkspace->update($user->id, $workspace->id);
            }

            return Redirect::route('dashboard')->with('force_reload', true);

        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function switchWorkspace(Workspace $workspace)
    {
        $user = Auth::user();

        $activeWorkspace = new ActiveWorkspaceController();
        
        $activeWorkspace->update($user->id, $workspace->id);

        return Redirect::route('dashboard')->with('force_reload', true);
    }

    public function update(WorkspaceRequest $request, Workspace $workspace) 
    {
        try {
            $data = $request->validated();
        
            $workspace->update([
                'name' => $data['name'],
            ]);
            return redirect()->route('workspace.edit', $workspace);
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function deleteConfirmation(Workspace $workspace)
    {
        return Inertia::render('Workspace/DeleteConfirmPage', [
            'workspace' => $workspace,
        ]);
    }

    public function destroy(Workspace $workspace)
    {
        try {
            $user = Auth::user();

            $activeWorkspaces = new ActiveWorkspaceController();
            
            $activeWorkspace = Workspace_members::where('user_id', $user->id)
                ->whereHas('workspace')->first();

            $activeWorkspaces->update($user->id, $activeWorkspace->workspace_id);
    
            $workspace->delete();
    
            return Redirect::route('dashboard');
        } catch(\Exception $e) {
            return Inertia::render('Workspace/CreateWorkspace');
        }
    }

    // public function getActiveWorkspace($id)
    // {
    //     return Workspace_members::where('user_id', $id)
    //         ->whereHas('workspace', function ($query) {
    //             $query->where('status', WorkspaceStatus::ACTIVE);
    //         })
    //         ->first();
    // }

    // public function getInactiveWorkspace($id)
    // {
    //     return Workspace_members::where('user_id', $id)
    //         ->whereHas('workspace', function ($query) {
    //             $query->where('status', WorkspaceStatus::INACTIVE);
    //         })
    //         ->with('workspace')
    //         ->orderBy('id', 'DESC')
    //         ->get()
    //         ->pluck('workspace');
    // }
}
