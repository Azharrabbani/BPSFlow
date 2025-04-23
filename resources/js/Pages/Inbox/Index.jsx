import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

export default function Index({ workspace, activeWorkspace }) {
    return(
        <AuthenticatedLayout 
            workspace={workspace}
            activeWorkspace={activeWorkspace}>
            
            <div>
                <h2>Hello</h2>
            </div>
        </AuthenticatedLayout>
    )
}