import { useState } from "react";
import EditWorkspace from "./EditWorkspace";

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InviteMember from "@/Components/workspaces/InviteMember";
import CloseIcon from '@mui/icons-material/Close';
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SettingsIcon from '@mui/icons-material/Settings';


export default function Members( { workspace, members } ) {
    const [open, setOpen] = useState(false);

    return(
        <EditWorkspace workspace={workspace}>
            <div className="p-6">
                <h1 className="text-3xl"><span className="text-blue-500">{workspace.name}'s</span> Members</h1>

            <div class="relative mt-5">
                <button class="absolute left-2 -translate-y-1/2 top-1/2 p-1">
                    <svg
                    width="17"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-labelledby="search"
                    class="w-5 h-5 text-gray-700"
                    >
                    <path
                        d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                        stroke="currentColor"
                        stroke-width="1.333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    </svg>
                </button>
                <div className="flex space-x-4">
                    <input
                        class="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-96"
                        placeholder="Search..."
                        required=""
                        type="text"
                    />
                    

                <button 
                    onClick={() => setOpen(true)}
                    className="flex items-center bg-sky-500 hover:bg-sky-600 rounded-lg text-white font-semibold overflow-hidden transition-colors duration-200"
                >
                    <div className="flex items-center gap-2 px-3 py-2">
                      <PersonAddAltIcon className="w-5 h-5"/>
                      <div className="w-px h-5 bg-white opacity-50"/>
                    </div>
                    <span className="px-3 py-2">Invite</span>
                </button>

                <InviteMember open={open} onClose={() => setOpen(false) }>
                    <CloseIcon className='absolute right-3 top-4 cursor-pointer hover:opacity-50' onClick={() => setOpen(false)}/>

                    <h2 className="text-xl pb-1">Undang Anggota</h2>
                    <p className="opacity-50">
                        Ajak anggota tim atau unit kerja untuk bergabung ke workspace agar kolaborasi dan manajemen proyek berjalan lebih efektif.
                    </p>

                    <form>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="spaceInput" className="mb-1">Email</label>
                            <TextInput placeHolder="ex: bps@gmail.com"/>
                        </div>
                        <PrimaryButton className="absolute bottom-6 right-8">
                            Invite
                        </PrimaryButton>
                    </form>
                </InviteMember>


                </div>
                
            </div>

            <div className="mt-5 overflow-auto rounded-lg shadow hidden lg:block">
                <table className="w-full">
                    <thead className="bg-sky-300 border-b-2 border-gray-200">
                        <tr className="border-b-4 border-gray-400 border-opacity-50">
                            <th className="p-3 text-sm font-semibold tracking-wide text-left">Name</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left">Jabatan</th>
                            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Role</th>
                            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left"></th>
                        
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                    {members.map(member => (
                        <tr key={member.id} className="bg-white">
                            <div className="flex items-center p-3">
                            <img src={
                                member.user.photo instanceof File 
                                ? URL.createObjectURL( member.user.photo) 
                                :  member.user.photo
                                ? `/storage/${ member.user.photo}` 
                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                            }  alt="Profile" width="45" className='my-5 rounded-full'/> 
                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-default">{member.user.name}</td>
                            </div>
                            <td className="p-3 text-sm font-bold text-blue-500 whitespace-nowrap cursor-default">{member.user.email}</td>
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-default">{member.user.jabatan}</td>
                            <td className={`p-3 text-sm whitespace-nowrap cursor-default ${
                                member.status === 'owner' ? 'text-sky-600' :
                                member.status === 'admin' ? 'text-orange-500' :
                                'text-green-500'
                            }`}>
                                {member.status}
                            </td>
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                                <SettingsIcon/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:hidden my-4">
                {members.map(member => (
                    <div key={member.id} className="bg-white p-4 rounded-lg shadow space-y-1 my-2">
                        <div className="flex items-center space-x-2 text-sm">
                            <div>
                                <p className="font-bold text-blue-500">{member.user.email}</p>
                            </div>
                            <div className="text-gray-500">{member.user.jabatan}</div>
                            <div className={`rounded-md ${member.status === 'owner'? 'bg-sky-600'
                                : member.status === 'admin' ? 'bg-orange-400'
                                : 'bg-green-500'
                             }`}>
                                <p className="text-white p-[3px]">{member.status}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <img src={
                                member.user.photo instanceof File 
                                ? URL.createObjectURL( member.user.photo) 
                                :  member.user.photo
                                ? `/storage/${ member.user.photo}` 
                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                            }  alt="Profile" width="45" className='my-5 rounded-full'/> 
                            {member.user.name}
                        
                        </div>
                        <div className="text-sm font-medium text-black">
                            <SettingsIcon/>
                        </div>
                    </div>
                ))}
                
            </div>
            
            </div>

        </EditWorkspace>
    )
}