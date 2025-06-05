import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Dashboard({ workspace, members, activeWorkspace, activeMembersStatus, getSpaces }) {
    const user = usePage().props.auth.user;

    const {data, setData, post, delete:destroy, errors, processing, recentlySuccessful} = useForm({
        name: "",
        user_id: user.id,
    });

    const [dataId, setDataId] = useState(null);
    const inputWorkspace = useRef(null);

    const handleInputClick = (id, currentName) => {
        setDataId(id);
        setData("name", currentName);
        setTimeout(() => inputWorkspace.current?.focus(), 0);
    };

    const handleCancel = () => {
        setDataId(null);
        setTimeout(() => inputWorkspace.current?.focus(), 0);
    };

    const createWorkspace = (e) => {
        e.preventDefault();
        post(route('workspace.store'));
    };

    const updateWorkspace = (e, id) => {
        e.preventDefault();
    
        post(route('workspace.update', id), {
            onSuccess: () => setDataId(null),
        });
    };

    const deleteWorkspace = (e, id) => {
        e.preventDefault();

        destroy(route('workspace.delete', id));
    };

    return (
        <AuthenticatedLayout 
            workspace={workspace}
            members={members}
            activeWorkspace={activeWorkspace}
            activeMembersStatus={activeMembersStatus}
            getSpaces={getSpaces}
        >
            <Head title="Dashboard" />
            <div className="space-y-5">
                <div className="text-center text-[30px] bg-white w-full p-4">
                    <h1>Workspace <span className="font-bold text-blue-500">{activeWorkspace.name}</span></h1>
                </div>

                <div className="bg-white rounded-md shadow w-full">
                    <div>
                        {/* Data Container */}
                        <div className="p-8 bg-white border border-bottom-black">
                            <h2 className="opacity-50">Space / Project / Task</h2>
                            <div className="flex justify-between">
                                <p>Assigment Name</p>
                                <p>Progress Bar</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white border border-bottom-black">
                            <h2 className="opacity-50">Space / Project / Task</h2>
                            <div className="flex justify-between">
                                <p>Assigment Name</p>
                                <p>Progress Bar</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white border border-bottom-black">
                            <h2 className="opacity-50">Space / Project / Task</h2>
                            <div className="flex justify-between">
                                <p>Assigment Name</p>
                                <p>Progress Bar</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white border border-bottom-black">
                            <h2 className="opacity-50">Space / Project / Task</h2>
                            <div className="flex justify-between">
                                <p>Assigment Name</p>
                                <p>Progress Bar</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white border border-bottom-black">
                            <h2 className="opacity-50">Space / Project / Task</h2>
                            <div className="flex justify-between">
                                <p>Assigment Name</p>
                                <p>Progress Bar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
