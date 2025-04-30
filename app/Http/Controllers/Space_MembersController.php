<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceMembersStatus;
use App\Enums\WorkspaceStatus;
use App\Http\Requests\Space_MembersRequest;
use App\Models\Space_members;
use App\Models\User;
use App\Models\Workspace_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Space_MembersController extends Controller
{
    public function store(array $data)
    {
        $user = Auth::user();
        if (!empty($data)) {
            $activeMembership = Workspace_members::where('user_id', $user->id)
            ->whereHas('workspace', function ($query) {
                $query->where('status', WorkspaceStatus::ACTIVE);
            })
            ->first();

            foreach($data[1] as $userId) {
                $user = User::where('id', $userId)->first();

                Space_members::create([
                    'user_id' => $user->id,
                    'space_id' => $data[0],
                ]);
            }

        }
    }
}
