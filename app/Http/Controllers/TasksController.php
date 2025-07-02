<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Tasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function store(TaskRequest $request)
    {
        try{
            $data = $request->validated();
    
            Tasks::create([
                'project_id' => $data['project_id'],
                'name' => $data['name'],
            ]);
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function update(TaskRequest $request, Tasks $tasks)
    {
        $data = $request->validated();

        $tasks->update([
            'name' => $data['name'],
        ]);
    }

    public function destroy(tasks $tasks)
    {
        $tasks->delete();
    }

    public function getTasks($project_id)
    {
        return Tasks::where('project_id', $project_id)->get();
    }

    public function checkTask($taskId) 
    {
        if (Tasks::where('id', $taskId)->firstOrFail()) {
            return true;
        }

        return false;
    }
}
