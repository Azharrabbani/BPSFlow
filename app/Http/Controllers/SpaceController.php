<?php

namespace App\Http\Controllers;

use App\Enums\SpaceStatus;
use App\Http\Requests\Space_MembersRequest;
use App\Http\Requests\SpaceRequest;
use App\Models\Space;
use App\Models\Space_members;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;

class SpaceController extends Controller
{   
    public function store(SpaceRequest $request) 
    {
        $user = Auth::user();

        $spaceData = $request->validated();
        
        $space = Space::create([
            'workspace_id' => $spaceData['workspace_id'],
            'name' => $spaceData['name'],
            'status' => $spaceData['status'],
        ]);
        
        if ($spaceData['status'] === 'private') {
            $dataSpaceMember = [$space->id, $spaceData['members']];
        } else {
            $workspaceController = new WorkspaceController();
            $workspaceMembersController = new Workspace_membersController();
        
            $activeWorkspace = $workspaceController->getActiveWorkspace($user->id);
        
            if (!$activeWorkspace) {
                return back()->withErrors(['workspace' => 'Active workspace not found.']);
            }
        
            $workspaceMembers = $workspaceMembersController->getMembers($activeWorkspace->workspace_id);

            $workspaceMemberIds = $workspaceMembers->pluck('user_id')->toArray();
        
            $dataSpaceMember = [$space->id, $workspaceMemberIds];
        }

        $space_member = new Space_MembersController();
        $space_member->store($dataSpaceMember);
        return Redirect::route('dashboard');
    }

    public function update(Request $request, Space $space)
    {
        dd($request->all());
    }

    public function destroy(Space $space)
    {
        $space->delete();

        return Redirect::route('dashboard');
    }

    public function getPublicSpaces($workspace_id) 
    {
       return Space::where(['workspace_id' => $workspace_id, 'status' => SpaceStatus::PUBLIC])->get();
    }

    public function getPrivateSpaces($workspace_id, $user_id)
    {
       return Space::where(['workspace_id' => $workspace_id, 'status' => SpaceStatus::PRIVATE])
            ->whereHas('space_member', function($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })
        ->get();
    }
    
}
