<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceStatus;
use App\Http\Requests\AsssignmentRequest;
use App\Mail\AssignNotification;
use App\Models\Assignments;
use App\Models\Project;
use App\Models\Space;
use App\Models\Space_members;
use App\Models\Tasks;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Workspace_members;
use Illuminate\Console\View\Components\Task;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AssignmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Tasks $tasks)
    {
        try {
            
            Tasks::where('id', $tasks->id)->firstOrFail();

            $user = Auth::user();
    
            $spaces = new SpaceController();
    
            $workspace_members = new Workspace_membersController();
    
            $assignment = new AssignmentsController();

            $activeWorkspaces = new ActiveWorkspaceController();
        
            $activeMembership = $activeWorkspaces->getActiveWorkspace($user->id);

            $publicSpaces = $spaces->getPublicSpaces($activeMembership->workspace_id);

            $privateSpaces = $spaces->getPrivateSpaces($activeMembership->workspace_id, $user->id);
    
            $getWorkspaceSpaces = array();
            array_push($getWorkspaceSpaces, $publicSpaces, $privateSpaces);
            
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
        
            $activeWorkspace = $activeWorkspaces->getActiveWorkspace($user->id);

            $activeMembers = Workspace_members::where('workspace_id', $activeMembership->workspace_id)->count();
    
            $activeMembersStatus = $workspace_members->getMembersStatus($activeMembership->workspace_id);
        
            $workspace = Workspace_members::whereNot('workspace_id', $activeWorkspace->workspace_id)->where('user_id', $user->id)->with('workspace')->get();
    
            $currentProject = Project::where('id', $tasks->project_id)->get();
    
            $currentSpace = Space::where('id', $currentProject[0]->space_id)->get();
            
            // Check if User is a Member of Workspace 
            $checkWorkspace = Workspace::where('id', $currentSpace[0]->workspace_id)->get();

            Workspace_members::where(['workspace_id' => $checkWorkspace[0]->id, 'user_id' => $user->id])->firstOrFail();
    
            $assignments = $assignment->getAssignments($tasks->id);
        
            return Inertia::render('Assignment/Index', [
                'workspace' => $workspace,
                'members' => $members,
                'activeMembers' => $activeMembers,
                'activeMembersStatus' => $activeMembersStatus,
                'activeWorkspace' => $activeWorkspace,
                'getWorkspaceSpaces' => $getWorkspaceSpaces,
                'tasks' => $tasks,
                'currentProject' => $currentProject,
                'currentSpace' => $currentSpace,
                'assignments' => $assignments
            ]);
        } catch (ModelNotFoundException $e){
            return Inertia::render('Errors/NotFoundError');
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function store(AsssignmentRequest $request)
    {
        try {
            $data = $request->validated();

            if ($data['space_member_id'] !== null) {
                $user_id = Space_members::where('id', $data['space_member_id'])->get();

                $assignee_email = User::where('id', $user_id[0]->user_id)->get();

                $workspace = $data['workspace'];

                $task = Tasks::where('id', $data['tasks_id'])->get();
                
                $project = Project::where('id', $task[0]->project_id)->get();

                $space = Space::where('id', $project[0]->space_id)->get();

                Mail::to($assignee_email[0]->email)->send(new AssignNotification($workspace['workspace']['name'], $data['name'], $task[0]->name, $project[0]->name, $space[0]->name, $assignee_email[0]->name));
            }
            
            Assignments::create([
                'name' => $data['name'],
                'tasks_id' => $data['tasks_id'],
                'space_member_id' => $data['space_member_id'],
                'status' => $data['status'],
                'priority' => $data['priority'],
                'due_date' => $data['due_date']
            ]);



        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');

        }   
    }

    public function getAssignments($tasks_id)
    {
        return Assignments::where('tasks_id', $tasks_id)->get();
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
        try {
            $assignee = $request->validate([
                'space_member_id' => 'required|integer'
            ]);

            $workspace = $request->workspace;

            $task = Tasks::where('id', $assignments->tasks_id)->get();
            
            $project = Project::where('id', $task[0]->project_id)->get();

            $space = Space::where('id', $project[0]->space_id)->get();

            $user_id = Space_members::where('id', $assignee['space_member_id'])->get();

            $assignee_email = User::where('id', $user_id[0]->user_id)->get();
    
            $assignments->update([
                'space_member_id' => $assignee['space_member_id']
            ]);

            Mail::to($assignee_email[0]->email)->send(new AssignNotification($workspace['workspace']['name'], $assignments->name, $task[0]->name, $project[0]->name, $space[0]->name, $assignee_email[0]->name));
            
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function updateStatus(Request $request, Assignments $assignments)
    {
        try {
            $status = $request->validate([
                'status' => 'required|string'
            ]);
            
            $assignments->update([
                'status' => $status['status']
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');

        }
    }

    public function updatePriority(Request $request, Assignments $assignments)
    {
        try {
            $priority = $request->validate([
                'priority' => 'nullable|string'
            ]);
    
            $assignments->update([
                'priority' => $priority['priority']
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
            
        }
    }

    public function updateDue(Request $request, Assignments $assignments)
    {
        try {
            $dueDate = $request->validate([
                'due_date' => 'nullable|date'
            ]);
    
            $assignments->update([
                'due_date' => $dueDate['due_date']
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }
    
    public function destroy(assignments $assignments)
    {
        $assignments->delete();

        return Redirect::route('task.index', $assignments->tasks_id)->with('message', 'Assignment terhapus');
    }

    
}
