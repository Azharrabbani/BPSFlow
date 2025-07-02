<?php

namespace App\Http\Controllers;

use App\Models\ActiveWorkspace;
use App\Models\Workspace;
use Illuminate\Http\Request;

class ActiveWorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getActiveWorkspace($userId)
    {
        return ActiveWorkspace::where('user_id', $userId)->with('workspace')->firstOrFail();
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
