<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignments extends Model
{
    protected $fillable = [
        'space_member_id',
        'tasks_id',
        'name',
        'status',
        'priority',
        'due_date',
    ];

    public function tasks(): BelongsTo
    {
        return $this->belongsTo(Tasks::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(Files::class);
    }
    
}
