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
        
        if ($spaceData['status'] === 'private') {
            $dataSpaceMember = array();
            
            
            array_push($dataSpaceMember, $space->id, $spaceData['members']);
            
            $space_member = new Space_MembersController();
            
            $space_member->store($dataSpaceMember);
        }
        
        return redirect('/dashboard');
        
    }

    public function getSpaces($workspace_id) 
    {
       return Space::where('workspace_id', $workspace_id)->get();
    }
}
