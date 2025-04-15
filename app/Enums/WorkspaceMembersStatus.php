<?php

namespace App\Enums;

enum WorkspaceMembersStatus: string {
    case OWNER = 'owner';
    case MEMBER = 'member';
}