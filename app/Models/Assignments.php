<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Assignments extends Model
{
    protected $fillable = [
        'space_member_id',
        'task_id',
        'name',
        'status',
        'priority',
        'due_date',
    ];
}
