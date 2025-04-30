import { useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import ModalSpace from '@/Components/ModalSpace';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';
import Workspace from '@/Components/workspaces/Workspace';
import CreateWorkspace from '@/Components/workspaces/CreateWorkspace';


// icons
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


export default function Sidebar( { children, workspace, members, activeWorkspace, activeMembersStatus, spaces }) {
    const user = usePage().props.auth.user;

    const workspaceMembers = activeMembersStatus.length;

    const currentUserStatus = activeMembersStatus.find(m=> m.user_id === user.id).status;

    const {data, setData, post, put, errors, processing, recentlySuccessful} = useForm({
        name: '',
        role: 'member',
        user_id: user.id,
        workspace_id: activeWorkspace.id,
        status: 'public',
        members: [],
    });

    const currentWorkspace = activeWorkspace.name;

    const [open, setOpen] = useState(false);

    const [openWorkpace, setOpenWorkplace] = useState(false);

    const [createWorkspace, setWorkspace] = useState(false);

    const setHidden = useRef(null);

    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const [search, setSearch] = useState('');

    const [searchEmail, setSearchEmail] = useState('');

    const [searchSpaces, setSearchSpaces] = useState('');

    // Add new Workspace
    const addWorkspace  = (e) => {
        e.preventDefault();

        post(route('workspace.store'), {
            onSuccess: () => {
                setWorkspace(false);
                setOpenWorkplace(false);
            },

            onError: () => {
                console.log('Gagal', errors.name);
            },

            onFinish: () => {
                console.log('selesai');
            }
        });
    }

    const invite = (e, id) => {
        e.preventDefault();
        
        post(route('invitation.accept', id), {
            onSuccess: () => {
                reset();
                setInviteModal(false);
            },
            onError: () => {
                console.log('Gagal', errors);
            }

        });
    }

    const switchWorkspace = (e, id) => {
        e.preventDefault();
        setSearch('');
        put(route('workspace.switch', id));
    }


    // Add new Space
    const addSpace = (e) => {
        e.preventDefault();
    
        post(route('space.store'),
        {
            onSuccess: () => {
                setOpen(false);
                setData.name = '';
            },
            onError: () => {
                data.members = [];
                console.log(data.members);
                console.log('Gagal', errors.name);
            },
            onFinish: () => {
                console.log('selesai');
            }
        });
    };
    

    // Clear search input
    const clear = (e) => {
        e.preventDefault();
        setOpenWorkplace(false);
        setSearch('');
    }

    // Toggle the checkbox
    const toggleCheckBox = (email) => {
        setSelectedUsers(prev => {
            const updated = prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email];
            setData('members', updated);
            return updated;
        }
        );
    };


    return (
         <div className="h-screen flex bg-blue-100">
            {/* Sidebar Container */}
            <nav className="fixed md:relative z-10 h-screen md:h-full w-[260px] bg-sky-600">
                {/* Sidebar Header */}
                <div 
                    className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-7 py-3 hover:cursor-pointer hover:bg-sky-700"
                    onClick={() => setOpenWorkplace(true)}
                >
                    <div className="header-sidebar flex h-[70px] items-center justify-start gap-0 px-2">
                        <Link href={route('dashboard')} className="bg-white px-[8px] py-[10px] rounded-full w-[60px]">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="65"/>
                        </Link>
                        <p className="text-white text-xl font-bold pl-3">{currentWorkspace}</p>
                        <KeyboardArrowDownIcon className="text-white"/>
                    </div>
                </div>

                <Workspace open={openWorkpace} onClose={() => setOpenWorkplace(false)}>
                    <div className="my-3">
                        <CloseIcon 
                            onClick={clear}
                            className="absolute right-2 w-2 hover:opacity-50 transition-colors duration-200 rounded-md cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center px-5 py-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="50"/>
                        <div className="ml-3 cursor-default">
                            <h2>{currentWorkspace}</h2>
                            <p className="text-sm opacity-50 mt-[-5px]">{workspaceMembers} members</p>
                        </div>
                    </div>

                    <div className="border-b-2 border-gray-400">

                        {currentUserStatus === 'owner' 
                            ? 
                                <div>
                                    <Link 
                                        href={route('workspace.edit', activeWorkspace)}
                                        className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="icons"><SettingsIcon/></div>
                                        <div className="menu-item">Settings</div>
                                    </Link>

                                    <Link 
                                        href={route('workspace.members', activeWorkspace)}
                                        className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="icons"><ManageAccountsIcon/></div>
                                        <div className="menu-item">Manage Users</div>
                                    </Link>
                                </div>
                            : currentUserStatus === 'admin' || currentUserStatus === 'member' ?
                                <div>
                                    <Link 
                                        href={route('workspace.members', activeWorkspace)}
                                        className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="icons"><ManageAccountsIcon/></div>
                                        <div className="menu-item">Manage Users</div>
                                    </Link>
                                </div>
                            : <p></p>
                        }
                    </div>

                    <div>
                        <div className="mt-4 px-5">
                            <div className="flex justify-between">
                                <input 
                                    className="text-sm opacity-50 cursor-default border-0 border-b-2 rounded-lg transition duration-300 focus:opacity-100 focus:outline-none" 
                                    placeHolder="Switch Workspaces"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <SearchOutlinedIcon className="w-2 mt-2 hover:bg-[#19324928] transition-colors duration-200 rounded-md cursor-pointer"/>
                            </div>

                            <div className="flex mt-3 flex-col max-h-[200px] overflow-y-auto">
                                {workspace && workspace.length > 0 ? (
                                    workspace.filter((item) => {
                                        return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search); 
                                    })
                                    .map((data) => (
                                        <button
                                            key={data.id} 
                                            onClick={(e) => switchWorkspace(e, data.id)}
                                            href={route('workspace.switch', data)} 
                                            className="flex items-center px-4 py-4 hover:bg-gray-200 hover:rounded-lg transition-colors duration-200 cursor-pointer"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="50"/>
                                            <div className="ml-3">
                                                <h2 className="text-start">{data.name}</h2>
                                            </div>
                                        </button>                                        
                                    ))
                                ): <p></p>}
                                
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 w-full">
                        <div 
                            // href={route('dashboard')}
                            onClick={() => setWorkspace(true)}
                            className="flex items-center gap-2 py-3 hover:bg-sky-400 hover:text-white rounded-sm transition-colors duration-200 cursor-pointer"
                        >
                            <div className="icons">
                                <AddOutlinedIcon />
                            </div>
                            <span className="menu-item">New Workspaces</span>
                        </div>

                    </div>
                </Workspace>

                <CreateWorkspace open={createWorkspace} onClose={() => setWorkspace(false)}>
                    <CloseIcon className='absolute right-3 top-4 cursor-pointer hover:opacity-50' onClick={() => setWorkspace(false)}/>

                    <div className="mt-1">
                        <h2 className="text-xl pb-1">Buat Wokspace Baru</h2>
                        <p className="opacity-50">Gunakan workspace untuk mengelompokkan tugas berdasarkan tim atau unit kerja agar manajemen proyek lebih tertata.</p>
                    </div>

                    <form onSubmit={addWorkspace}>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="spaceInput" className="mb-1">Workspace Name</label>
                            <TextInput placeHolder="ex: Tim Pengolahan Data" onChange={(e) => setData('name', e.target.value)} value={data.name}/>
                            {errors.name && <p className="error text-red-500">{errors.name}</p>}
                        </div>
                        <PrimaryButton className="absolute bottom-3 right-8">
                            Create
                        </PrimaryButton>
                    </form>
                </CreateWorkspace>

                {/* Sidebar Menu Space */}
                <div className="flex h-full bg-gray-100 flex-col">
                    {/* Sidebar menu */}
                    <div className="sidebar-menu border-b-2">
                        <ul className="w-full justify-center">
                            <Link 
                                href={route('dashboard')}
                                className={route().current('dashboard') 
                                    ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer" 
                                    : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                }
                            >
                                <div className="icons"><HomeOutlinedIcon/></div>
                                <div className="menu-item">Home</div>
                            </Link>
                            <Link
                                href={route('inbox')}
                                className={route().current('inbox') 
                                    ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer" 
                                    : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                }
                            >
                                <div className="icons"><DraftsOutlinedIcon/></div>
                                <div className="menu-item">Inbox</div>
                            </Link>
                        </ul>
                    </div>
                    
                    {/* spaces header */}
                    <div className=" flex px-3 pt-3 justify-between">
                        <p className="text-sm text-gray-800">Spaces</p>

                        <div className="flex px-[0px] gap-2">
                            <SearchOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                            <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                            <AddOutlinedIcon
                                onClick={() => setOpen(true)} 
                                className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"
                            />
                            
                            <ModalSpace open={open} onClose={() => setOpen(false)}>
                                <CloseIcon 
                                    className='absolute right-3 top-4 cursor-pointer hover:opacity-50' 
                                    onClick={() => {
                                        setOpen(false); 
                                        clear();
                                    }}
                                />

                                <div className="mt-1">
                                    <h2 className="text-xl pb-1">Buat Space Baru</h2>
                                    <p className="opacity-50">Space mewakili bagian, subbagian, atau kelompok kerja, lengkap dengan daftar tugas, alur pelaksanaan</p>
                                </div>

                                <form onSubmit={addSpace}>
                                    <div className="flex flex-col mt-4">
                                        <label htmlFor="spaceInput" className="mb-1">Space Name</label>
                                        <TextInput 
                                            placeHolder="ex: Unit Perancangan" 
                                            onChange={(e) =>  setData('name', e.target.value)} 
                                            value={data.name}
                                        />
                                        {errors.name && <p className="error text-red-500">{errors.name}</p>}
                                    </div>
                                

                                    <div className="mt-[50px] flex justify-between">
                                        <div className="">
                                            <h2>Buat Private</h2>
                                            <p className="opacity-50 pr-[50px]">Buat untuk hanya member yang anda izinkan bisa akses</p>
                                        </div>
                                        <label class="switch relative top-3">
                                            <input type="checkbox"/>
                                            <span 
                                                class="slider" 
                                                onClick={() => {
                                                    setData('status', 'private');
                                                    
                                                    if (setHidden.current) {
                                                        if (setHidden.current.hidden) {
                                                            setHidden.current.hidden = false
                                                        } else {
                                                            setHidden.current.hidden = true
                                                        }
                                                    }
                                                }}
                                            >
                                            </span>
                                        </label>
                                    </div>

                                    <div className='flex justify-end mt-3'>
                                        <PrimaryButton disabled={processing}>
                                            Create
                                        </PrimaryButton>

                                    </div>

                                    <div className="mt-2" hidden ref={setHidden}>
                                        <h2 className="opacity-50">Select Member yang hanya boleh mengakses</h2>
                                        <hr/>

                                        <div className="flex flex-col mt-4">
                                            <TextInput 
                                                value={searchEmail}
                                                onChange={e => {
                                                    setData('email', e.target.value);
                                                    setSearchEmail(e.target.value)  
                                                }}
                                                type="email"
                                                placeHolder="Cari atau masukkan email yang akan diberikan akses"
                                            />
                                            {errors.email && <p className="text-red-600">{errors.email}</p>}
                                            {errors.user && <p className="text-red-600">{errors.user}</p>}
                                        </div>

                                        <div className="overflow-y-auto max-h-[130px]">
                                        {members && members.length > 0 ? (
                                             members.filter(({ user }) =>
                                                searchEmail.trim() === ''
                                                    ? true
                                                    : user.email?.toLowerCase().includes(searchEmail.toLowerCase())
                                            )
                                             .map((data) => (
                                                <div key={data.id}>
                                                    {data.status === 'owner' ? (
                                                        <div 
                                                            className="p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                                            onLoad={() => toggleCheckBox(data.user)}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <input 
                                                                    className="peer appearance-none w-5 h-5 rounded focus:outline-none checked:bg-blue-500 hover:ring hover:ring-blue-600" 
                                                                    type="checkbox" 
                                                                    checked
                                                                    readOnly
                                                                />                                   
                                                                <img 
                                                                    className="rounded-full" 
                                                                    src={
                                                                        data.user.photo instanceof File 
                                                                            ? URL.createObjectURL(data.user.photo) 
                                                                            : data.user.photo
                                                                                ? `/storage/${data.user.photo}` 
                                                                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                                                                    } 
                                                                    alt="" 
                                                                    width="40"
                                                                />
                                                                <p>{data.user.email}</p>       
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div 
                                                            className="p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                                            onClick={() => toggleCheckBox(data.user)}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <input 
                                                                    className="peer appearance-none w-5 h-5 rounded focus:outline-none checked:bg-blue-500 hover:ring hover:ring-blue-600" 
                                                                    type="checkbox" 
                                                                    checked={selectedUsers.includes(data.user)}
                                                                    readOnly
                                                                />                                   
                                                                <img 
                                                                    className="rounded-full" 
                                                                    src={
                                                                        data.user.photo instanceof File 
                                                                            ? URL.createObjectURL(data.user.photo) 
                                                                            : data.user.photo
                                                                                ? `/storage/${data.user.photo}` 
                                                                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                                                                    } 
                                                                    alt="" 
                                                                    width="40"
                                                                />
                                                                <p>{data.user.email}</p>            
                                                            </div>
                                                        </div>
                                                    )}         
                                                </div>
                                             ))
                                             ): <p></p>
                                        }
                                            
                                        </div>
                                    </div>
                                </form>
                            </ModalSpace>

                        </div>
                    </div>
                    
                    {/* Sidebar list menu */}
                    <div>
                        <ul className="w-full justify-center">

                                {spaces && spaces.length > 0 ? (
                                    spaces.filter((item) => {
                                        return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search); 
                                    })
                                    .map((data) => (
                                        <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer space-x-0">
                                            <div className="icon-menu"><DesktopWindowsOutlinedIcon/></div>
                                            <div className="menu-item">{data.name}</div>
                                            <div className="flex px-3 gap-2">
                                                <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                                <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                            </div>
                                        </li>                                
                                    ))
                                ): <p></p>}
                            
                             
                        </ul>
                    </div>
                    

                    {/* Sidebar bottom menu */}
                    <div className="flex absolute border-t-2 border-gray-300 bottom-0 w-full justify-start divide-x-2">
                        <Link
                            method="post" 
                            href={route('logout')}
                            className="flex gap-2 w-full hover:bg-sky-400 hover:text-white hover:rounded-lg transition-colors duration-200 px-5 p-2 cursor-pointer">
                            <LogoutOutlinedIcon/>
                            <p>Logout</p>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 ml-[260px] md:ml-0 p-4 md:p-6 overflow-auto h-full">
                {children}
            </main>
        </div>

    );
}