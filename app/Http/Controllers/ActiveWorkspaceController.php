<?php

namespace App\Http\Controllers;

use App\Models\ActiveWorkspace;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Illuminate\Http\Request;

class ActiveWorkspaceController extends Controller
{
   
    public function getActiveWorkspace($userId)
    {
        $active = ActiveWorkspace::where('user_id', $userId)->firstOrFail();

        if (!$active) {
            return null;
        }

        $isMember = Workspace_members::where('user_id', $userId)
            ->where('workspace_id', $active->workspace_id)
            ->exists();

        if (!$isMember) {
            
            $newMembership = Workspace_members::where('user_id', $userId)->first();

            if ($newMembership) {
                
                $active->update([
                    'workspace_id' => $newMembership->workspace_id,
                ]);

                return ActiveWorkspace::where('user_id', $userId)->with('workspace')->first();
            } else {
                $active->delete();
                return null;
            }
        }

        return ActiveWorkspace::where('user_id', $userId)->with('workspace')->first();
    }


    public function store($userId, $workspaceId)
    {
        ActiveWorkspace::create([
            'user_id' => $userId,
            'workspace_id' => $workspaceId
        ]);
    }

    public function update($userId, $workspaceId)
    {
        ActiveWorkspace::where('user_id', $userId)->update(['workspace_id' => $workspaceId]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActiveWorkspace $activeWorkspace)
    {
        //
    }
}
