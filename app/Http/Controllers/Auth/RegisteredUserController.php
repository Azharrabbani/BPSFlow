<?php

namespace App\Http\Controllers\Auth;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use App\Models\ActiveWorkspace;
use App\Models\Workspace_members;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        $workspace = Workspace::create([
            'name' => 'BPSFlow',
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s"),
        ]);

        ActiveWorkspace::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id
        ]);

        Workspace_members::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
            'status' => WorkspaceMembersStatus::OWNER,
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s"),
        ]);

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
