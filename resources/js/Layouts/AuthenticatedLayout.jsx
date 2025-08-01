import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
// import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Sidebar from '@/Components/sideBar';

export default function AuthenticatedLayout({ header, children, workspace, members, activeWorkspace, activeMembersStatus, getWorkspaceSpaces, getSpaces }) {
    const user = usePage().props.auth.user;

    return (
        <Sidebar 
            workspace={workspace}
            members={members}
            activeWorkspace={activeWorkspace}
            activeMembersStatus={activeMembersStatus}
            getWorkspaceSpaces={getWorkspaceSpaces}
            getSpaces={getSpaces}
        >
        <div className="min-h-screen bg-blue-100 ">
           

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                    
                </header>
            )}

            <main>
                {children}
            </main>
        </div>

        </Sidebar>
    );
}
