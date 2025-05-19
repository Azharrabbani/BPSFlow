<?php

namespace App\Enums\task;

enum Priority: string {
    case NORMAL = 'Normal';
    case LOW = 'Low';
    case HIGH = 'High';
    case URGENT = 'Urgent';
}