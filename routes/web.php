<?php

use App\Http\Controllers\AssignmentsController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\OauthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Space_MembersController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\Workspace_membersController;
use App\Models\Assignments;
use App\Models\Space;
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

Route::get('/createWorkspace', function() {
    return Inertia::render('Chart/Gant');
})->name('gant');

Route::middleware('auth')->group(function () {
    // Profile route
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Workspace route
    Route::post('/workspace', [WorkspaceController::class, 'store'])->name('workspace.store');
    Route::get('/workspace/{workspace}', [WorkspaceController::class, 'edit'])->name('workspace.edit');
    Route::get('/workspace/{workspace}/workpace', [WorkspaceController::class, 'workspace'])->name('workspace.index');
    Route::post('/workspace/{workspace}', [WorkspaceController::class, 'update'])->name('workspace.update');
    Route::post('/workspace/{workspace}/switch', [WorkspaceController::class, 'switchWorkspace'])->name('workspace.switch');
    Route::get('/workspace/{workspace}/deleteWorkspace', [WorkspaceController::class, 'deleteConfirmation'])->name('workspace.deletePage');
    Route::delete('workspace/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspace.delete');
    
    // Workspace_members route
    // Route::get('/invite', [WorkspaceController::class, 'sendInvitation'])->name('invitation.send');
    Route::get('/workspace/{workspace}/members', [Workspace_membersController::class, 'index'])->name('workspace.members');
    Route::post('/invite', [Workspace_membersController::class, 'invite'])->name('invitation.accept');
    Route::post('/role/{member}', [Workspace_membersController::class, 'changeRole'])->name('role.update');
    Route::delete('/workspace/{member}/members', [Workspace_membersController::class, 'deleteMember'])->name('member.delete');

    // Space Route
    Route::post('/space', [SpaceController::class, 'store'])->name('space.store');
    Route::post('/space/{space}', [SpaceController::class, 'update'])->name('space.update');
    Route::delete('/space/{space}', [SpaceController::class, 'destroy'])->name('space.delete');

    // Space_member Route
    Route::get('/space_member/{spaceId}', [Space_MembersController::class, 'getSpaceMembers'])->name('space.members');
    Route::delete('/space_member/{space_member}', [Space_MembersController::class, 'deleteMember'])->name('space.deleteMember');

    // Project Route
    Route::post('/project', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/project/{space_id}', [ProjectController::class, 'getProjects'])->name('project.get');
    Route::post('/project/{project}', [ProjectController::class, 'update'])->name('project.update');
    Route::delete('/project/{project}', [ProjectController::class, 'destroy'])->name('project.delete');

    // Task Route
    Route::post('/task', [TasksController::class, 'store'])->name('task.store');
    Route::get('/task/{project_id}/tasks', [TasksController::class, 'getTasks'])->name('task.get');
    Route::get('/task/{tasks}', [AssignmentsController::class, 'index'])->name('task.index');
    // Route::get('/task/{tasks}/gantChart', [AssignmentsController::class, 'getGant'])->name('task.gantChart');
    Route::post('/task/{tasks}', [TasksController::class, 'update'])->name('task.update');
    Route::delete('/task/{tasks}', [TasksController::class, 'destroy'])->name('task.delete');
    
    // Inbox Route
    Route::get('/inbox', [InboxController::class, 'index'])->name('inbox');

    // Assignment Route
    Route::post('/assignment', [AssignmentsController::class, 'store'])->name('assignment.store');
    Route::post('/assignment/{assignments}/assignment', [AssignmentsController::class, 'renameAssignment'])->name('assignment.renameAssignment');
    Route::post('/assignment/{assignments}/assignee', [AssignmentsController::class, 'updateAssignee'])->name('assignment.updateAssignee');
    Route::post('/assignment/{assignments}/status', [AssignmentsController::class, 'updateStatus'])->name('assignment.updateStatus');
    Route::post('/assignment/{assignments}/priority', [AssignmentsController::class, 'updatePriority'])->name('assignment.updatePriority');
    Route::post('/assignment/{assignments}/dueDate', [AssignmentsController::class, 'updateDue'])->name('assignment.updateDue');
    Route::delete('/assignment/{assignments}', [AssignmentsController::class, 'destroy'])->name('assignment.delete');

    // Files Route
    Route::post('/assignment/{assignment}/file', [FilesController::class, 'store'])->name('assignment.file');
    Route::get('/assignment/{assignment}/files', [FilesController::class, 'getFiles'])->name('assignment.getFiles');
    Route::get('/files/{files}', [FilesController::class, 'download'])->name('files.download');
    Route::delete('/files/{files}', [FilesController::class, 'destroy'])->name('files.destroy');
});

require __DIR__.'/auth.php';
