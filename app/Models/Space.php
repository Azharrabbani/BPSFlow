<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Space extends Model
{
    protected $fillable = [
        'workspace_id',
        'name',
        'status',
    ];

    public function workspace(): BelongsTo 
    {
        return $this->belongsTo(Workspace::class);
    }

    public function user(): BelongsToMany
    {
        return $this->belongsToMany(Workspace_members::class);
    }

    public function space_member(): HasMany
    {
        return $this->hasMany(Space_members::class);
    }

    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
