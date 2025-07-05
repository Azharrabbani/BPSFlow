<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\Space_MembersRequest;
use App\Models\Space_members;
use App\Models\User;
use App\Models\Workspace_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class Space_MembersController extends Controller
{
    public function store(array $data, $status, $workspace_id)
    {
        try {
            $user = Auth::user();
            if (!empty($data)) {
    
                if ($status === 'private') {
                    $owner = Workspace_members::where([
                        'status' => WorkspaceMembersStatus::OWNER,
                        'workspace_id' => $workspace_id
                        ])->get();
        
                    Space_members::create([
                            'user_id' => $owner[0]->user_id,
                            'space_id' => $data[0],
                        ]);
                }
    
                foreach($data[1] as $userId) {
                    $user = User::where('id', $userId)->first();
    
                    Space_members::create([
                        'user_id' => $user->id,
                        'space_id' => $data[0],
                    ]);
                }
    
            }
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');

        }
    }

    public function deleteMember(Space_members $space_member)
    {
        $space_member->delete();
    }

    public function getSpaceMembers($spaceId)
    {
        return Space_members::where('space_id', $spaceId)
            ->with('user')
            ->get();
    }
}
