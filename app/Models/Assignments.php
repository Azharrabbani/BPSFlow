<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Assignments extends Model
{
    protected $fillable = [
        'task_id',
        'name',
        'status',
        'priority',
        'due_date',
    ];

    public function space_members(): BelongsToMany
    {
        return $this->belongsToMany(Space_members::class);
    }

}
