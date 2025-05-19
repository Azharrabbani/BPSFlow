<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tasks extends Model
{
    protected $fillable = [
        'project_id',
        'name',
    ];

    public function projects(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
