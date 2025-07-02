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
use Inertia\Inertia;

use function PHPUnit\Framework\isArray;

class SpaceController extends Controller
{   
    public function store(SpaceRequest $request) 
    {
        try {
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
            $space_member->store($dataSpaceMember, $space->status);
            return Redirect::route('dashboard');


        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function update(SpaceRequest $request, Space $space)
    {
        try {
            $data = $request->validated();
    
            $space->update([
                'name' => $data['name'],
                'status' => $data['status'],
            ]);
    
            if (isset($data['members']) && is_array($data['members'])) {
                foreach($data['members'] as $userId) {
                    Space_members::create([
                        'space_id' => $space->id,
                        'user_id' => $userId['id'],
                    ]);
                }
            }
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function destroy(Space $space)
    {
        $space->delete();
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
