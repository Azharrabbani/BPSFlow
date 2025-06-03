<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Files extends Model
{
    protected $fillable = [
        'assignment_id',
        'originalName',
        'generatedName',
    ];

    public function assignments(): BelongsTo
    {
        return $this->belongsTo(Assignments::class);
    }
}
