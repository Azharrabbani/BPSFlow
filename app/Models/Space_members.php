<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Space_members extends Model
{
    protected $fillable = [
        'user_id',
        'space_id',
    ];

    public function workspace_member(): BelongsTo
    {
        return $this->belongsTo(Workspace_members::class);
    }

    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class);
    }
}
