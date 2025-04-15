<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Workspace extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'status',
    ];

    public function users (): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
