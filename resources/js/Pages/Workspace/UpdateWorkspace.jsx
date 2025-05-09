import EditWorkspace from "@/Pages/Workspace/EditWorkspace";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";


export default function UpdateWorkspace( { workspace, activeMembersStatus } ) {
    const {data, setData, post, processing} = useForm({
        id: workspace.id,
        name: workspace.name,
    });

    const isMatch = data.name === workspace.name || data.name.trim().length === 0;

    const updateWorkspace = (e) => {
        e.preventDefault();

        console.log(workspace);
        post(route('workspace.update', workspace));
    }

    return(
        <EditWorkspace 
            workspace={workspace}
            activeMembersStatus={activeMembersStatus}
        >
            <div className="p-6">
                <h1 className="text-3xl">Workspace Setting</h1>
            </div>

            <div  className="px-7 my-3">
                <div className="flex gap-2">
                    <div className="bg-white px-[8px] py-[10px] rounded-lg w-[80px]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="Workspace" width="65"/>
                    </div>
                    <input 
                        type="text" 
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="text-lg w-full border-0 border-b bg-transparent focus:outline-hidden opacity-50"
                    />
                </div>
            </div>

            <div className="flex justify-between my-[90px] px-8">
                <Link 
                    href={route('workspace.deletePage', data)}
                    className="border-2 p-5 rounded-xl hover:bg-red-600 text-red-500 hover:text-white transition-colors duration-200"
                >
                    <p className="text-lg">Hapus Workspace</p>
                </Link>
                
                {isMatch ? (
                    <Link className="border-2 p-5 w-[190px] text-center rounded-xl border-green-500 cursor-not-allowed" disabled>
                        <p className="text-lg">Save</p>
                    </Link>
                ) : (
                    <form onSubmit={updateWorkspace}>
                        <button
                            type="submit" 
                            className="border-2 p-5 w-[190px] text-center rounded-xl border-green-500 hover:bg-green-500 hover:text-white transition-colors duration-200"
                        >
                            <p className="text-lg">{processing ? 'Mengupdate' : 'Update'}</p>
                        </button>
                    </form>
                )}
            </div>
            
        </EditWorkspace>
    )
}