<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceStatus;
use App\Http\Requests\AsssignmentRequest;
use App\Models\Assignments;
use App\Models\Project;
use App\Models\Space;
use App\Models\Tasks;
use App\Models\Workspace_members;
use Illuminate\Console\View\Components\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AssignmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Tasks $tasks)
    {
        $user = Auth::user();

        $workspaces = new WorkspaceController();

        $spaces = new SpaceController();

        $workspace_members = new Workspace_membersController();

        $assignment = new AssignmentsController();
    
        $activeMembership = $workspaces->getActiveWorkspace($user->id);

        $publicSpaces = $spaces->getPublicSpaces($activeMembership->workspace_id);

        $privateSpaces = $spaces->getPrivateSpaces($activeMembership->workspace_id, $user->id);

        $getSpaces = array();
        array_push($getSpaces, $publicSpaces, $privateSpaces);
        
        $members = $workspace_members->getMembers($activeMembership->workspace_id);

        if (!$activeMembership) {
            $firstInactive = Workspace_members::where('user_id', $user->id)
                ->whereHas('workspace', function ($query) {
                    $query->where('status', WorkspaceStatus::INACTIVE);
                })
                ->first();
    
            if ($firstInactive) {
                $firstInactive->workspace->update([
                    'status' => WorkspaceStatus::ACTIVE
                ]);
    
                $activeMembership = Workspace_members::where('user_id', $user->id)
                    ->whereHas('workspace', function ($query) {
                        $query->where('status', WorkspaceStatus::ACTIVE);
                    })
                    ->first();
            }
        }
    
        if (!$activeMembership) {
            return Inertia::render('Assignment/Index', [
                'workspace' => [],
                'activeMembers' => 0,
                'activeMembersStatus' => [],
                'activeWorkspace' => null,
            ]);
        }
    
        $activeWorkspace = $activeMembership->workspace;

        $activeMembers = Workspace_members::where('workspace_id', $activeMembership->workspace_id)->count();

        $activeMembersStatus = $workspace_members->getMembersStatus($activeMembership->workspace_id);
    
        $workspace = $workspaces->getInactiveWorkspace($user->id);

        $currentProject = Project::where('id', $tasks->project_id)->get();

        $currentSpace = Space::where('id', $currentProject[0]->space_id)->get();

        $assignments = $assignment->getAssignments($tasks->id);
    
        return Inertia::render('Assignment/Index', [
            'workspace' => $workspace,
            'members' => $members,
            'activeMembers' => $activeMembers,
            'activeMembersStatus' => $activeMembersStatus,
            'activeWorkspace' => $activeWorkspace,
            'getSpaces' => $getSpaces,
            'task' => $tasks,
            'currentProject' => $currentProject,
            'currentSpace' => $currentSpace,
            'assignments' => $assignments
        ]);
    }

    public function store(AsssignmentRequest $request)
    {
        $data = $request->validated();

        Assignments::create([
            'name' => $data['name'],
            'task_id' => $data['task_id'],
            'space_member_id' => $data['space_member_id'],
            'status' => $data['status'],
            'priority' => $data['priority'],
            'due_date' => $data['due_date']
        ]);
    }

    public function getAssignments($task_id)
    {
        return Assignments::where('task_id', $task_id)->get();
    }

     public function renameAssignment(Request $request, Assignments $assignments)
    {
        $assignment = $request->validate([
            'name' => 'required|string'
        ]);
        
        $assignments->update([
            'name' => $assignment['name']
        ]);
    }

    public function updateAssignee(Request $request, Assignments $assignments)
    {
        $assignee = $request->validate([
            'space_member_id' => 'required|integer'
        ]);

        $assignments->update([
            'space_member_id' => $assignee['space_member_id']
        ]);
    }

    public function updateStatus(Request $request, Assignments $assignments)
    {
        $status = $request->validate([
            'status' => 'required|string'
        ]);
        
        $assignments->update([
            'status' => $status['status']
        ]);
    }

    public function updatePriority(Request $request, Assignments $assignments)
    {
        $priority = $request->validate([
            'priority' => 'nullable|string'
        ]);

        $assignments->update([
            'priority' => $priority['priority']
        ]);
    }

    public function updateDue(Request $request, Assignments $assignments)
    {
        $dueDate = $request->validate([
            'due_date' => 'nullable|date'
        ]);

        $assignments->update([
            'due_date' => $dueDate['due_date']
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(assignments $assignments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, assignments $assignments)
    {
        //
    }

    
    public function destroy(assignments $assignments)
    {
        $assignments->delete();

        return Redirect::route('task.index', $assignments->task_id)->with('message', 'Assignment terhapus');
    }
}
