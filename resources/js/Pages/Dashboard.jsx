import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ProgressBar from '@/Components/ProgressBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';


export default function Dashboard({ workspace, members, activeWorkspace, activeMembersStatus, getWorkspaceSpaces, getSpaces}) {
    const user = usePage().props.auth.user;

    const flatProjects = getSpaces.flat(); 

    const {data, setData, post, delete:destroy, errors, processing, recentlySuccessful} = useForm({
        name: "",
        user_id: user.id,
    });

    function countAssCompleted(assignments) {
        return assignments.filter(a => a.status.toLowerCase() === 'completed').length;
    }


    return (
        <AuthenticatedLayout 
            workspace={workspace}
            members={members}
            activeWorkspace={activeWorkspace}
            activeMembersStatus={activeMembersStatus}
            getWorkspaceSpaces={getWorkspaceSpaces}
            getSpaces={getSpaces}
        >
            <Head title="Dashboard" />

            <div className="text-center text-[22px] md:text-[30px] bg-white w-full p-5 md:p-7">
                <h1>
                    Workspace <span className="font-bold text-blue-500">{activeWorkspace.workspace.name}</span>
                </h1>
            </div>

            <div className="space-y-5 px-4 sm:px-4 md:px-8 pb-8 mt-10 mb-10">
                <div className="w-full rounded-xl shadow bg-gray-50 p-4 sm:p-6 md:p-10">
                    {flatProjects && flatProjects.length > 0 ? (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
                            {flatProjects.map(space =>
                                space.project?.length > 0 &&
                                space.project.map(project =>
                                    project.tasks?.length > 0 &&
                                    project.tasks.map(task => {
                                        const completedCount = countAssCompleted(task.assignments || []);
                                    
                                        return (
                                            <Link key={`task-${task.id}`} href={route('task.index', task.id)}>
                                                <div className="p-5 pb-10 bg-white rounded-xl shadow hover:shadow-md transition duration-200 border border-gray-200 hover:bg-gray-50 h-full flex flex-col justify-between">
                                                    <div className="mb-3 text-sm text-gray-500 font-medium">
                                                        {space.name} &rarr; {project.name}
                                                    </div>
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                                                        <p className="text-lg font-semibold text-gray-800">{task.name}</p>
                                                        <ProgressBar
                                                            assignments={task.assignments.length}
                                                            completedAss={completedCount}
                                                            className="w-full sm:w-1/3"
                                                            value={Math.floor((completedCount / task.assignments.length) * 100)}
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                            <h2 className="italic">Tidak ada project</h2>
                        </div>
                    )}
                </div>
            </div>


            
        </AuthenticatedLayout>
    );
}
