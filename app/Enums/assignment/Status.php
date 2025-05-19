<?php

namespace App\Enums\task;

enum Status: string {
    case TO_DO = 'To Do';
    case IN_PROGRESS = 'In Progress';
    case APPROVEL_REQUIRED = 'Aprovel Required';
    case COMPLETE = 'Complete';
}