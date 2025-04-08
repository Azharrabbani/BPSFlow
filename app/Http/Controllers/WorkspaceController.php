<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkspaceRequest;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index() 
    {
        $user = Auth::user();
        
        $workspace = Workspace::with('users')->where('user_id', $user->id)->orderBy('id', 'DESC')->get();

        return Inertia::render('Dashboard', [
            'workspace' => $workspace
        ]);
    }

    public function edit (Workspace $workspace) 
    {
        return Inertia::render('EditWorkspace', [
            'workspace' => $workspace
        ]);
    }

    public function store(WorkspaceRequest $request) 
    {
        $user = $request->validated();
        
        Workspace::create($user);

        return redirect('/dashboard');
    }

    public function update(WorkspaceRequest $request, Workspace $workspace) 
    {
        $data = $request->validated();

        $workspace->update([
            'name' => $data['name'],
        ]);

        return redirect('/dashboard');
    }

    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return redirect('/dashboard');
    }
}
