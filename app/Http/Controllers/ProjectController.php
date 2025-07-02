<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use LDAP\Result;

class ProjectController extends Controller
{
    public function store(ProjectRequest $request)
    {
        try {
            $project = $request->validated();
    
            Project::create([
                'space_id' => $project['space_id'],
                'name' => $project['name'],
            ]);
        } catch(\Exception $e) {
            return Inertia::render('Errors/ServerError');

        }
    }

    public function update(ProjectRequest $request, Project $project)
    {   
        try {
            $data = $request->validated();
    
            $project->update([
                'name' => $data['name']
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }
    }

    public function destroy(Project $project)
    {
        $project->delete();
    }

    public function getProjects($space_id)
    {
        return Project::where('space_id', $space_id)->get();
    }
}
