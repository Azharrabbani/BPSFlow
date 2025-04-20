<?php

namespace App\Enums;

enum WorkspaceMembersStatus: string {
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
}