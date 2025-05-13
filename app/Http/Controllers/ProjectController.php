<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Redirect;
use LDAP\Result;

class ProjectController extends Controller
{
    public function store(ProjectRequest $request)
    {
        $project = $request->validated();

        Project::create([
            'space_id' => $project['space_id'],
            'name' => $project['name'],
        ]);

        return Redirect::route('dashboard');
    }

    public function update(ProjectRequest $request, Project $project)
    {   
        $data = $request->validated();

        $project->update([
            'name' => $data['name']
        ]);

        return Redirect::route('dashboard');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return Redirect::route('dashboard');
    }

    public function getProjects($space_id)
    {
        return Project::where('space_id', $space_id)->get();
    }
}
