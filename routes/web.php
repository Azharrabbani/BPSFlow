<?php

use App\Http\Controllers\OauthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\Workspace_membersController;
use App\Models\Workspace_members;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('oauth/google', [OauthController::class, 'redirectToProvider'])->name('oauth.google');
Route::get('oauth/google/callback', [OauthController::class, 'handleProviderCallback'])->name('/oauth.google.callback');

Route::get('/dashboard', [WorkspaceController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile route
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Workspace route
    Route::post('/workspace', [WorkspaceController::class, 'store'])->name('workspace.store');
    Route::get('/workspace/{workspace}', [WorkspaceController::class, 'edit'])->name('workspace.edit');
    Route::get('/workspace/{workspace}/deleteWorkspace', [WorkspaceController::class, 'deleteConfirmation'])->name('workspace.deletePage');
    Route::put('/workspace/{workspace}/switch', [WorkspaceController::class, 'switchWorkspace'])->name('workspace.switch');
    Route::put('/workspace/{workspace}', [WorkspaceController::class, 'update'])->name('workspace.update');
    Route::delete('workspace/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspace.delete');
    
    // Workspace_members route
    // Route::get('/invite', [WorkspaceController::class, 'sendInvitation'])->name('invitation.send');
    Route::get('/workspace/{workspace}/members', [Workspace_membersController::class, 'index'])->name('workspace.members');
    Route::post('/invite', [Workspace_membersController::class, 'invite'])->name('invitation.accept');
    Route::put('/role/{workspace_member}', [Workspace_membersController::class, 'changeRole'])->name('role.update');
    Route::delete('/workspace/{workspace_member}/members', [Workspace_membersController::class, 'deleteMember'])->name('member.delete');

    // Space Route
    Route::get('/space', [SpaceController::class, 'index'])->name('space.index');
    Route::post('/space', [SpaceController::class, 'store'])->name('space.store');

    // Inbox Route
    Route::get('/inbox', [InboxController::class, 'index'])->name('inbox');

});

require __DIR__.'/auth.php';
