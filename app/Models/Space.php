<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
}
