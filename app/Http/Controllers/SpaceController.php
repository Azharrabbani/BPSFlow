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
use Illuminate\Validation\ValidationException;

class SpaceController extends Controller
{   
    public function store(SpaceRequest $request) 
    {
        $spaceData = $request->validated();
        
        $space = Space::create([
            'workspace_id' => $spaceData['workspace_id'],
            'name' => $spaceData['name'],
            'status' => $spaceData['status'],
        ]);
        
        if ($spaceData['status'] === 'private'){
            $dataSpaceMember = array();
            
            array_push($dataSpaceMember, $space->id, $spaceData['members']);
            
            $space_member = new Space_MembersController();
            
            $space_member->store($dataSpaceMember);
        }
        
        return redirect('/dashboard');
        
    }

    public function update(Request $request, Space $space)
    {
        dd($request->all());
    }

    public function destroy(Space $space)
    {
        $space->delete();

        return redirect('/dashboard');
    }

    public function getPublicSpaces($workspace_id) 
    {
       return Space::where(['workspace_id' => $workspace_id, 'status' => SpaceStatus::PUBLIC])->get();
    }

    public function getPrivateSpaces($user_id)
    {
        return Space_members::where('user_id', $user_id)
            ->whereHas('space', function($query) {
                $query->where('status', SpaceStatus::PRIVATE);
            })
            ->with('space')
            ->get();
    }
    
}
