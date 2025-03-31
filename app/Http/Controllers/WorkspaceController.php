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
    public function index() {
        $user = Auth::user();
        
        $workspace = Workspace::with('users')->where('user_id', $user->id)->first();

        return Inertia::render('Dashboard', [
            'workspace' => $workspace
        ]);
    }
}
