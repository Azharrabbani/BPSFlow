<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workspace extends Model
{
    protected $fillable = [
        'name',
        'status',
    ];

    public function users (): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Workspace_members::class, 'workspace_id');
    }

    public function spaces(): HasMany
    {
        return $this->hasMany(Space::class, 'workspace_id');
    }
}
