<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'space_id',
        'name',
    ];

    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class);
    }

}
