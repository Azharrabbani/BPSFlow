<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::user();

        $activeWorkspaces = new ActiveWorkspaceController();
        
        $workspace = $activeWorkspaces->getActiveWorkspace($user->id);

        $activeMembersStatus = Workspace_members::where('workspace_id', $workspace->workspace_id)->get();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'workspace' => $workspace->workspace,
            'activeMembersStatus' => $activeMembersStatus
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $user = $request->user();
            $user->fill($request->validated());
    
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }
    
            // Check if receive photo from FrontEnd
            if ($request->hasFile('photo')) {
    
                // Delete the old Image in storage
                if ($request->oldProfile) {
                    Storage::delete($request->oldProfile);
                }
                
                $photoPath = $request->file('photo')->store('profile_photos');
    
                $user->photo = $photoPath;
            }
    
            $user->save();
    
            return Redirect::route('profile.edit')->with('message', 'Profile Updated');

        } catch (\Exception $e) {
            return Redirect::route('profile.edit')->withErrors(['error' => 'Update Failed']);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        $ownedWorkspaces = Workspace_members::where('user_id', $user->id)
        ->where('status', WorkspaceMembersStatus::OWNER)
        ->pluck('workspace_id');

        foreach ($ownedWorkspaces as $workspaceId) {
            Workspace::where('id', $workspaceId)->delete();
        }   

        if ($user->photo) {
            Storage::delete($user->photo);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/login');
    }
}
