<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workspace_members extends Model
{
    protected $fillable = [
        'user_id',
        'workspace_id',
        'status',
    ];
}
