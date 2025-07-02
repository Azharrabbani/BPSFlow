import { Link, useForm } from "@inertiajs/react";
import EditWorkspace from "./EditWorkspace";

export default function Index({ workspaceDetail, activeMembersStatus, workspaceList }) {
    const flatWorkspaces = workspaceList.flat();

    const {post} = useForm();

    const switchWorkspace = (e, id) => {
        e.preventDefault();
        post(route('workspace.switch', id));
    }

    return (
        <>
            <EditWorkspace
                workspace={workspaceDetail}
                activeMembersStatus={activeMembersStatus}
            >
                <div className="text-center text-[22px] md:text-[30px] bg-white w-full p-5 md:p-7">
                    <h1>
                        Your <span className="font-bold text-blue-500">workspace</span>
                    </h1>
                </div>

                <div className="px-4 sm:px-10 mt-10">
                    <div className="flex flex-wrap justify-start gap-6">
                        {flatWorkspaces && flatWorkspaces.length > 0 ? (
                        flatWorkspaces.map((data, i) => (
                            <button
                                key={i}
                                className="flex flex-col items-center bg-white p-6 sm:p-9 w-full sm:w-[200px] rounded-lg space-y-5 hover:shadow-xl hover:shadow-blue-300 transition-shadow duration-300 cursor-pointer"
                                onClick={(e) => switchWorkspace(e, data.workspace.id)} 
                            >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg"
                                alt="bps-logo"
                                className="h-20 w-auto object-contain"
                            />
                            <p className="text-center text-xl">{data.workspace.name}</p>
                            </button>
                        ))
                        ) : (
                            <p className="text-gray-500">Tidak ada workspace</p>
                        )}
                    </div>
                </div>
            </EditWorkspace>
        </>
    )
}