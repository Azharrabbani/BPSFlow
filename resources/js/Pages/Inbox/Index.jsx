import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ workspace, activeWorkspace, activeMembers, activeMembersStatus, publicSpaces, privateSpaces }) {
    return(
        <AuthenticatedLayout 
            workspace={workspace}
            activeWorkspace={activeWorkspace}
            activeMembersStatus={activeMembersStatus}
            activeMembers={activeMembers}
            publicSpaces={publicSpaces}
            privateSpaces={privateSpaces}
        >

            <Head title="Inbox"/>
            
            <div>
                <h2>Hello</h2>
            </div>
        </AuthenticatedLayout>
    )
}