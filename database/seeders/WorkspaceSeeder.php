<?php

namespace Database\Seeders;

use App\Models\Workspace;
use DateTime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkspaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Workspace::create([
            'user_id' => 1,
            'name' => 'workspace azhar',
            'created_at' => new DateTime(now()),
            'updated_at' => new DateTime(now()),
        ]);
    }
}
