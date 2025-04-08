import EditWorkspace from "@/Pages/EditWorkspace";
import { Head, Link, usePage } from "@inertiajs/react";


export default function UpdateWorkspace( {workspace} ) {

    return(
        <EditWorkspace workspace={workspace}>
            <div className="p-6">
                <h1 className="text-3xl">Workspace Setting</h1>
            </div>

            <div className="px-7 my-3">
                <form className="flex gap-2">
                    <div className="bg-white px-[8px] py-[10px] rounded-lg w-[80px]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="65"/>
                    </div>
                    <input 
                        value={workspace.name}
                        type="text" 
                        className="text-lg w-full border-0 border-b bg-transparent focus:outline-hidden opacity-50"
                    />
                </form>
            </div>

            <div className="flex justify-between my-[90px] px-8">
                <Link 
                    href={route('workspace.deletePage', workspace)}
                    className="border-2 p-5 rounded-xl hover:bg-red-600 text-red-500 hover:text-white transition-colors duration-200"
                >
                    <p className="text-lg">Hapus Workspace</p>
                </Link>
                <Link className="border-2 p-5 w-[190px] text-center rounded-xl hover:bg-green-500 hover:text-white transition-colors duration-200">
                    <p className="text-lg">Save</p>
                </Link>
            </div>
            
        </EditWorkspace>
    )
}