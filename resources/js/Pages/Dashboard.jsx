import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Dashboard({ workspace }) {
    const user = usePage().props.auth.user;

    const {data, setData, post, delete:destory, errors, processing, recentlySuccessful} = useForm({
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
    }

    const createWorkspace = (e) => {
        e.preventDefault();
        post(route('workspace.store'));
    }

    const updateWorkspace = (e, id) => {
        e.preventDefault();
    
        post(route('workspace.update', id), {
            onSuccess: () => setDataId(null),
        });
    };

    const deleteWorkspace = (e, id) => {
        e.preventDefault();

        destory(route('workspace.delete', id));
    }

    return (
        <AuthenticatedLayout workspace={workspace}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-12'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <form onSubmit={createWorkspace}>
                                
                                <label htmlFor="title-workspace">Title</label>
                                <input type="text" name='name' onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="error">{errors.name}</p>}
                                <PrimaryButton>Create</PrimaryButton>
                            </form>
                        </div>   
                    </div>
                </div>
                

            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Inbox

                            {workspace && workspace.length > 0 ? (
                                workspace.map((workspaceData) => (
                                    <div key={data.id} className="flex items-center justify-between border-b py-2">
                                        {dataId === workspaceData.id ? (
                                            <input 
                                                type="text" 
                                                defaultValue={workspaceData.name} 
                                                onChange={(e) => setData('name', e.target.value)}
                                                ref={inputWorkspace} 
                                                className="border px-2 py-1 rounded"
                                            />
                                        ) : (
                                            <p className="text-lg" ref={inputWorkspace}>{workspaceData.name}</p>
                                        )}
    
                                        <div className="flex gap-5">
                                            {dataId === workspaceData.id ? (
                                                <div className='flex gap-2'>
                                                <form onSubmit={(e) => updateWorkspace(e, workspaceData.id)}>
                                                    
                                                    <button 
                                                        type="submit"
                                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                    >
                                                        Save
                                                    </button>
                                                </form>
                                            
                                                <button 
                                                    onClick={() => handleCancel(workspaceData.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    cancel
                                                </button>
                                            
                                                
                                            
                                                </div>
                                                
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => handleInputClick(workspaceData.id)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                            
                                                    <form onSubmit={(e) => deleteWorkspace(e, workspaceData.id)}>
                                                        <button 
                                                            type="submit"
                                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                        >
                                                            Delete                                     
                                                        </button>
                                                    </form>
                                            
                                                </div>
                                                
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No workspaces found</p>
                            )}
                            
                        </div>   
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
