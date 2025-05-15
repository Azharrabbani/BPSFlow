import { useEffect, useRef, useState } from "react";
import EditWorkspace from "./EditWorkspace";
import Select from  "react-select";
import { Description } from "@headlessui/react";
import { useForm, Link, usePage } from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton";

// Icons
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InviteMember from "@/Components/workspaces/InviteMember";
import CloseIcon from '@mui/icons-material/Close';
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';


const roles = [
    { value: 'admin', label: 'Admin - Dapat mengelola anggota & workspace' },
    { value: 'member', label: 'Member - Hanya bisa akses workspace saja' }
]

const customLayout = {
    control: (provided) => ({
        ...provided,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        paddingLeft: '0px',
        fontWeight: 'bold',
        color: '#000',
        minHeight: 'initial',
        cursor: 'pointer',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "white" : "black",
        backgroundColor: state.isSelected ? "#38c1fc" : "white",
        cursor: 'pointer',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: 0,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'black',
    }),
};

export default function Members( { workspace, members, activeMembersStatus } ) {
    const user = usePage().props.auth.user;

    const currentUserStatus = members.find(m => m.user_id === user.id).status;

    const settingMenu = useRef();
      
    const {data, setData, post, delete:destroy, errors, processing, reset} = useForm({
        email: '',
        role: 'member',
        workspace: workspace.id,
    });

    const [open, setOpen] = useState(false);
    
    const [search, setSearch] = useState('');

    const [activeMemberId, setActiveMemberId] = useState(null);

    const togglePopup = (id) => {
        if (activeMemberId === id) {
            setActiveMemberId(null);
        } else {
            setActiveMemberId(id);
        }
    }

    // useEffect(() => {
    //     let handler = (e) => {
    //         if (!settingMenu.current.contains(e.target)) {
    //             setActiveMemberId(null);
    //         }
    //     };

    //     document.addEventListener('mousedown', handler);

    //     return () => {
    //         document.removeEventListener('mousedown', handler);
    //     };
    // });

    const invite = (e) => {
        e.preventDefault();
        
        post(route('invitation.accept'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: () => {
                console.log('Gagal', errors);
            }

        });
    }

    const changeRole = (e, id, newRole) => {
        e.preventDefault();
        console.log("Edit member dengan ID:", id);
        post(route('role.update', id, newRole));
    };

    const deleteMember = (e, id) => {
        e.preventDefault();
        console.log(id);
        destroy(route('member.delete', id), {
            onSuccess: () => {
                setActiveMemberId(null);
            },
            onError: () => {
                console.log("Gagal menghapus member");
            },
            onFinish: () => {
                console.log("Selesai");
            }
        });
    };

    return(
        <EditWorkspace 
            workspace={workspace}
            activeMembersStatus={activeMembersStatus}
        >
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
                        onChange={(e) => setSearch(e.target.value)}
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

                        <form onSubmit={invite}>
                            <div className="flex flex-col mt-4">
                                <label htmlFor="spaceInput" className="mb-1">Email</label>
                                <TextInput 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    type="email"
                                    placeHolder="ex: bps@gmail.com"
                                />
                                {errors.email && <p className="text-red-600">{errors.email}</p>}
                                {errors.user && <p className="text-red-600">{errors.user}</p>}
                            </div>

                            <div className="mt-4">
                                <h2 className="opacity-50">Invite sebagai</h2>
                                <div className="flex items-center w-ful py-5 px-3 rounded-lg space-x-2">
                                    <span className="bg-sky-400 p-3 text-white rounded-md">
                                        <PersonAddAltIcon/>
                                    </span>
                                    <Select 
                                        name="role" 
                                        id="role" 
                                        className="w-96 border-0"
                                        options={roles}
                                        defaultValue={roles[1]}
                                        onChange={(selected) => setData('role', selected.value)}
                                        styles={customLayout}
                                    />
                                    
                                </div>
                            </div>
                            <div className="flex justify-end my-2">
                                <PrimaryButton>
                                    Invite
                                </PrimaryButton>
                            </div>
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
                        { members && members.length > 0 ?
                           members.filter(({ user, status }) =>
                                search.trim() === ''
                                    ? true
                                    : user.name?.toLowerCase().includes(search.toLowerCase()) ||
                                      user.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
                                      user.email?.toLowerCase().includes(search.toLowerCase()) ||
                                      status?.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((member) => (
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
                                    {member.user.jabatan?.length > 0
                                        ? <td className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-default">{member.user.jabatan}</td>
                                        : <td className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-default">Karyawan</td>
                                    }
                                    
                                    <td className={`p-3 text-sm whitespace-nowrap cursor-default ${
                                        member.status === 'owner' ? 'text-sky-600' :
                                        member.status === 'admin' ? 'text-orange-500' :
                                        'text-green-500'
                                    }`}>
                                        {member.status}
                                    </td>
                                    {user.id !== member.user_id && currentUserStatus !== 'member'
                                        ? 
                                        <td className="relative p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                                            {member.status !== 'owner' 
                                                ? <SettingsIcon 
                                                    className="hover:opacity-50 cursor-pointer" 
                                                    onClick={() => togglePopup(member.id)} 
                                                  />
                                                : <p>...</p>  
                                            }
                                            
                                            
                                            {activeMemberId === member.id && (
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white shadow-lg rounded-md p-4 z-50" ref={settingMenu}>
                                                    <div className="text-left space-y-4">
                                                    
                                                        <div >
                                                            {member.status === 'member' 
                                                                ? 
                                                                <Link 
                                                                    className="flex items-center gap-1 hover:opacity-50"
                                                                    onClick={(e) => {
                                                                        setData('role', 'admin')
                                                                        changeRole(e, member.id, data.role)

                                                                    }}
                                                                >
                                                                    <AdminPanelSettingsIcon/>
                                                                    <p>Set as <span className="text-orange-500">admin</span></p>  
                                                                </Link>
                                                                : 
                                                                <Link 
                                                                    className="flex items-center gap-1 hover:opacity-50"
                                                                    onClick={(e) => {
                                                                        changeRole(e, member.id, 'member')
                                                                    }}
                                                                >
                                                                    <AssignmentIndIcon/>
                                                                    <p>Set as <span className="text-green-500">member</span></p>
                                                                </Link>
                                                            }
                                                        </div>
                                            
                                                        <Link 
                                                            onClick={(e) => deleteMember(e, member)}
                                                            className="flex items-center gap-1 hover:opacity-50"
                                                        >
                                                            <PersonRemoveAlt1Icon/>
                                                            Delete
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        : 
                                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                                            ...
                                        </td>
                                    }
                                </tr>
                        )) : 
                            <tr></tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:hidden my-4">
                {members && members.length > 0 ? 
                    members.filter(({ user, status }) =>
                        search.trim() === ''
                            ? true
                            : user.name?.toLowerCase().includes(search.toLowerCase()) ||
                              user.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
                              user.email?.toLowerCase().includes(search.toLowerCase()) ||
                              status?.toLowerCase().includes(search.toLowerCase())
                    )
                .map(member => (
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

                        {user.id !== member.user_id && currentUserStatus !== 'member'
                            ? 
                            <div className="relative text-sm font-medium text-black">
                                
                                {member.status !== 'owner' 
                                    ? <SettingsIcon 
                                        className="hover:opacity-50 cursor-pointer" 
                                        onClick={() => togglePopup(member.id)} 
                                      />
                                    : <p>...</p>  
                                }
                                                
                                    {activeMemberId === member.id && (
                                        <div className="absolute left-10 top-5 -translate-y-1/2 mr-2 bg-white shadow-lg rounded-md p-4 z-50" ref={settingMenu}>
                                            <div className="text-left space-y-4">
                                            
                                                <Link className="flex items-center gap-1 hover:opacity-50">
                                                    
                                                    {member.status === 'member' 
                                                        ? 
                                                        <div className="flex items-center gap-1">
                                                            <AdminPanelSettingsIcon/>
                                                            <p>Set as <span className="text-orange-500">admin</span></p>  
                                                        </div>
                                                        : 
                                                        <div className="flex items-center gap-1">
                                                            <AssignmentIndIcon/>
                                                            <p>Set as <span className="text-green-500">member</span></p>
                                                        </div>
                                                    }
                                                </Link>
                                    
                                                <Link 
                                                    className="flex items-center gap-1 hover:opacity-50"
                                                    onClick={(e) => deleteMember(e, member)}
                                                >
                                                    <PersonRemoveAlt1Icon/>
                                                    Delete
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                            </div>
                            : <div className="text-sm font-medium text-black">
                                ...
                            </div>
                        } 
                            
                    </div>
                )):
                    <div></div>
                }
                
            </div>
            
            </div>

        </EditWorkspace>
    )
}