<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilesRequest;
use App\Mail\AssignmentNotification;
use App\Models\Assignments;
use App\Models\Files;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FilesController extends Controller
{
   
    public function store(FilesRequest $request, Assignments $assignment)
    {        
        try {
            $user = Auth::user();
            
            $members = $request['members'];
    
            $files = $request->file('file'); 
    
            $workspace = $request['workspace'];
    
            $fileHashName = '';
    
            $fileName = '';
    
            $uploadedFiles = array();
    
            
            foreach($files as $file) {
                $fileHashName = $file->hashName();
                $fileName = $file->getClientOriginalName();    
                $file->storeAs('files', $fileHashName);
                
                Files::create([
                    'assignment_id' => $assignment->id,
                    'originalName' => $fileName,
                    'generatedName' => $fileHashName,
                ]);
                
                $uploadedFiles[] = $fileName;
            }
            
            foreach($members as $member) {
                if ($member['status'] === 'owner' || $member['status'] === 'admin') {
                    Mail::to($member['user']['email'])->send(new AssignmentNotification($workspace['workspace']['name'], $assignment->name, $uploadedFiles, $user, $member['user']['name']));
                }
            }
        } catch (\Exception $e) {
            return Inertia::render('Errors/ServerError');
        }

    }

    public function getFiles(Assignments $assignment)
    {
        return Files::where('assignment_id', $assignment->id)->get();
    }

    public function destroy(Files $files)
    {
        Storage::delete($files['generatedName']);

        $files->delete();
    }

    public function download(Files $files)
{
    $path = 'files/' . $files['generatedName'];

    if (Storage::exists($path)) {
        return Storage::download($path, $files['originalName']);
    } else {
        abort(404, 'File tidak ditemukan.');
    }
}


}
