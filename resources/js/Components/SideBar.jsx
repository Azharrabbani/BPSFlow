import axios from 'axios';
import { use, useRef, useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import ModalSpace from '@/Components/spaces/ModalSpace';
import EditSpace from '@/Components/spaces/EditSpace';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';
import Workspace from '@/Components/workspaces/Workspace';
import CreateWorkspace from '@/Components/workspaces/CreateWorkspace';
import ModalProject from '@/Components/modal/CreateModal';
import ConfirmDeleteModal from '@/Components/modal/ConfirmDeleteModal';
import ProjectSetting from '@/Components/modal/SettingModal';
import EditProject from '@/Components/modal/EditModal';
import SecondaryButton from './SecondaryButton';
import Menu from '@/Components/modal/Menu';
import CreateModal from '@/Components/modal/CreateModal';


// icons
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveOutlineIcon from '@mui/icons-material/DriveFileMoveOutline';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SettingModal from '@/Components/modal/SettingModal';
import EditModal from '@/Components/modal/EditModal';


export default function Sidebar( { children, workspace, members, activeWorkspace, activeMembersStatus, getSpaces }) {
    const user = usePage().props.auth.user;

    const workspaceMembers = activeMembersStatus.length;

    const flatSpaces = getSpaces.flat();

    const currentUserStatus = activeMembersStatus.find(m=> m.user_id === user.id).status;

    const currentWorkspace = activeWorkspace.name;

    const {data, setData, post, get, delete:destroy, errors, processing, recentlySuccessful} = useForm({
        name: '',
        role: 'member',
        user_id: user.id,
        space_id: '',
        project_id: '',
        workspace_id: activeWorkspace.id,
        status: 'public',
        members: [],
    });


    const [open, setOpen] = useState(false);

    const [settingSpace, setSettingSpace] = useState(null);

    const [openWorkpace, setOpenWorkplace] = useState(false);

    const [createWorkspace, setWorkspace] = useState(false);
    
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [showSelectMember, setShowSelectMember] = useState(false);

    const [ownerMember, setOwnerMember] = useState(null);
    
    const [showSelectMemberSetting, setShowSelectMemberSetting] = useState(null);
    
    const [search, setSearch] = useState('');

    const [searchEmail, setSearchEmail] = useState('');

    const [toggleWorkspaceMore, setToggleWorkspaceMore] = useState(null);

    const [toggleShowProject, setToggleShowProject] = useState(null);

    const [toggleProjectMore, setToggleProjectMore] = useState(null);
    
    // spaces state
    const [searchSpaces, setSearchSpaces] = useState('');

    const [spaceSearch, setSpaceSearch] = useState(false);

    const [spaceDeleteId, setSpaceDeleteId] = useState(null);

    const [editingSpace, setEditingSpace] = useState(null);

    const [toggleSpaceMember, setToggleSpaceMember] = useState(null);

    const [spaceMenu, setSpaceMenu] = useState(null);

    const [toggleDeleteMember, setToggleDeleteMember] = useState(null);

    const [spaceMembers, setSpaceMembers] = useState([]);

    useEffect(() => {
        if (editingSpace) {
          if (data.status === 'private') {
            setShowSelectMemberSetting(editingSpace.id);
          } else {
            setShowSelectMemberSetting(null);
          }
        }
    }, [data.status, editingSpace]);

    // projects state
    const [projectId, setProjectId] = useState(null);

    const [toggleProjects, setToggleProjects] = useState(null);   
    
    const [projectMenu, setProjectMenu] = useState(null);

    const [projectSetting, setProjectSetting] = useState(null);

    const [confirmDeleteProject, setConfirmDeleteProject] = useState(null);

    const [inputValueProject, setInputValueProject] = useState(null);

    const [editProjectid, setEditProjectId] = useState(null);

    const [projects, setProjects] = useState([]);

    // task state
    const [taskId, setTaskId] = useState(null);

    const [toggleTasks, setToggleTasks] = useState(null);

    const [taskSetting, setTaskSetting] = useState(null);

    const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);

    const [editTask, setEditTask] = useState(null);

    const [inputValueTask, setInputValueTask] = useState(null);

    const [tasks, setTasks] = useState([]);



    // Method

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
        post(route('workspace.switch', id));
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

    // Get Space Member
    const getSpaceMembers = async (e, spaceId) => {
        e.preventDefault();

        if (toggleSpaceMember === spaceId) {
            setToggleSpaceMember(null);
            setSpaceMembers([]);
            return;
        }

        try{
            const response = await axios.get(route('space.members', spaceId));
            setSpaceMembers((prev) => ({...prev, [spaceId]: response.data}));
            setToggleSpaceMember(spaceId);
        } catch(error) {
            if (error.response) {
                console.error("Response error:", error.response.status, error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        
        }
    };



    // Delete Space Member
    const deleteMember = (e, space_member) => {
        e.preventDefault();
        destroy(route('space.deleteMember', space_member), {
             onSuccess: () => {
                setSettingSpace(null);
                setEditingSpace(null);
                setSpaceMembers([]);
                data.name = '';
                data.status = '';
                data.members = [];
                clear();
            },
            onError: () => {
                console.log('Gagal Update Space')
            },
            onFinish: () => {
                console.log('finish')
            }
        });
    }

    // Update Space
    const updateSpace = (e, id) => {
        e.preventDefault();
        post(route('space.update', id), {
            onSuccess: () => {
                setSettingSpace(null);
                setEditingSpace(null);
                data.name = '';
                data.status = '';
                data.members = [];
                clear();
            },
            onError: () => {
                console.log('Gagal Update Space')
            },
            onFinish: () => {
                console.log('finish')
            }
        });
    };
    
    // Delete Space
    const deleteSpace = (e, id) => {
        e.preventDefault();
        location.reload();
        destroy(route('space.delete', id), 
        {
            onSuccess: () => {
                setSpaceDeleteId(null);
            },
            onError: () => {
                console.log('Gagal Menghapus space');
            },
            onFinish: () => {
                console.log('selesai');
            }
        }
    );
    }

    // Add Project
    const addProject = (e) => {
        e.preventDefault();
        post(route('project.store'),
        {
            onSuccess: () => {
                setProjectId(null);
                data.name = '';
                data.space_id = '';
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

    // Get Projects
    const getProjects = async (e, spaceId) => {
        e.preventDefault();

        if (toggleProjects === spaceId) {
            setToggleProjects(null);
            setProjects([]);
            return;
        }

        try{
            const response = await axios.get(route('project.get', spaceId));
            setProjects((prev) => ({ ...prev, [spaceId]: response.data }));
            setToggleProjects(spaceId);
        } catch(error) {
            console.error('Gagal fetch project:', error);
        }
    }

    const getAvailable = (spaceId) => {
        const currentSpaceMembers = spaceMembers[spaceId] || [];

        const membersSpace = currentSpaceMembers.map((sm) => sm.user_id);

        const availableMembers = members.filter((member) => !membersSpace.includes(member.user_id));

        return availableMembers;
    }

    // Update Project
     const updateProject = (e, id) => {
        e.preventDefault();
        post(route('project.update', id), {
            onSuccess: () => {
                setEditProjectId(null);
                setToggleProjects(null);
            },
            onError: () => {
                console.log('Update Project Gagal')
            },
            onFinish: () => {
                console.log('selesai');
            }
        });
    };

    // Delete Project
    const deleteProject = (e, id) => {
        e.preventDefault();

        destroy(route('project.delete', id), {
            onSuccess: () => {
                setToggleProjects(null);
                setConfirmDeleteProject(null);
                setProjectSetting(null);
            },
            onError: () => {
                console.log('Gagal Menghapus project');
            },
            onFinish: () => {
                console.log('selesai');
            }
        })
    }

    // Add Task
    const addTask = (e) => {
        e.preventDefault();

        post(route('task.store'));
    }

    // Get Tasks
    const getTasks = async (e, projectId) => {
        e.preventDefault();

        if (toggleTasks === projectId) {
            setToggleTasks(null);
            setTasks([]);
            return;
        }

        try{
            const response = await axios.get(route('task.get', projectId));
            setTasks((prev) => ({ ...prev, [projectId]: response.data }));
            setToggleTasks(projectId);
        } catch(error) {
            console.error('Gagal fetch project:', error);
        }
    }

    // Update Task
    const updateTask = (e, id) => {
        e.preventDefault();

        post(route('task.update', id), {
            onSuccess: () => {
                setEditTask(null);
                setToggleTasks(null);
            },
            onError: () => {
                console.log('Gagal update task');
            },
            onFinish: () => {
                console.log('selesai');
            }
        });
    }

    // Delete Task
    const deleteTask = (e, id) => {
        e.preventDefault();

        destroy(route('task.delete', id), {
            onSuccess: () => {
                setToggleTasks(null);
                setConfirmDeleteTask(null);
                setTaskSetting(null);
            },
            onError: () => {
                console.log('Gagal Menghapus task');
            },
            onFinish: () => {
                console.log('selesai');
            }
        })
    }


    // Clear search input
    const clear = (e) => {
        e.preventDefault();
        setOpenWorkplace(false);
        setSearch('');
    };

    // Toggle the checkbox
    const toggleCheckBox = (user) => {
        const exists = selectedUsers.find(u => u.id === user.id);
        let newSelectedUsers;

        if (exists) {
            newSelectedUsers = selectedUsers.filter(u => u.id !== user.id);
        } else {
            newSelectedUsers = [...selectedUsers, user];
        }
    
        setSelectedUsers(newSelectedUsers);
    
        const memberIds = newSelectedUsers.map(u => ({ id: u.id }));
        setData('members', memberIds);
    };


    const handleClick_SearchSpace = () => {
        setSpaceSearch(true);
    };

    const handleCancel_searchSpace = () => {
        setSpaceSearch(false);
        setSearchSpaces('');
    };

    const spaceMenuPopUp = () => {
        setSpaceMenu(true);
    };

    const closeSpaceMenuPopUp = () => {
        setSpaceMenu(false);
    };
    

    return (
         <div className="h-screen flex bg-blue-100">
            {/* Sidebar Container */}
            <nav className="fixed md:relative z-10 h-screen md:h-full w-[290px] bg-sky-600">
                {/* Sidebar Header */}
                <div 
                    className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-7 py-3 hover:cursor-pointer hover:bg-sky-700"
                    onClick={() => setOpenWorkplace(true)}
                >
                    <div className="header-sidebar flex h-[70px] items-center justify-center gap-0 px-2">
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

                    <div className="mt-1 cursor-default">
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
                    <div className="flex px-3 pt-3 justify-between items-center">
                        {spaceSearch ? 
                            <div>
                                <TextInput 
                                    className="h-[30px] w-[170px] border-transparent focus:border-transparent focus:ring-0 opacity-50 text-black rounded-md"
                                    placeHolder="search..."
                                    value={searchSpaces}
                                    onChange={(e) => setSearchSpaces(e.target.value)}
                                >
                                </TextInput>
                                <CancelIcon
                                    className="flex items-center cursor-pointer text-slate-500 hover:text-red-500 transition-colors duration-200"
                                    onClick={() => handleCancel_searchSpace()}
                                />
                            </div>
                            : 
                            <>
                                    <p className="text-sm text-gray-800">Spaces</p>
                                    <div className="ml-[163px] space-x-2">
                                        <SearchOutlinedIcon 
                                                className="hover:text-blue-500 rounded-md cursor-pointer"
                                                onClick={() => handleClick_SearchSpace()}
                                            />
                                        {/* <MoreHorizOutlinedIcon className="hover:text-blue-500 rounded-md cursor-pointer"/> */}
                                        <AddOutlinedIcon
                                            onClick={() => setOpen(true)} 
                                            className="hover:text-green-600 rounded-md cursor-pointer"
                                        />
                                    </div>
                            </>
                        } 
                        
                        <div className="flex px-[0px] gap-2">                
                            <ModalSpace open={open} onClose={() => setOpen(false)}>
                                <CloseIcon 
                                    className='absolute right-3 top-4 cursor-pointer hover:opacity-50' 
                                    onClick={() => {
                                        setOpen(false); 
                                        clear();
                                    }}
                                />

                                <div className="mt-1 cursor-default">
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
                                        <div className="cursor-default">
                                            <h2>Buat Private</h2>
                                            <p className="opacity-50 pr-[50px]">Buat untuk hanya member yang anda izinkan bisa akses</p>
                                        </div>
                                        <label class="switch relative top-3">
                                            <input type="checkbox"/>
                                            <span 
                                                class="slider" 
                                                onClick={() => {
                                                    setData('status', 'private');
                                                    setShowSelectMember(prev => !prev);
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

                                    {showSelectMember && 
                                        <div className="mt-2">
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
                                                                className="p-4 rounded-lg cursor-default bg-slate-100 mt-3"
                                                                
                                                            >
                                                                <div className="flex items-center space-x-2">                   
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
                                                                    <span className="bg-sky-100 rounded-lg"><p className="p-1 text-blue-700 font-bold">{data.status}</p></span>       
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
                                    }
                                </form>
                            </ModalSpace>

                        </div>
                    </div>
                    
                    {/* Sidebar list menu */}
                    <div>
                        {/* Spaces */}
                        <ul className="relative w-full justify-center max-h-[500px] overflow-y-auto">

                                {flatSpaces && flatSpaces.length > 0 ? (
                                    flatSpaces.filter((item) => {
                                        return searchSpaces.toLowerCase() === '' ? item : item.name.toLowerCase().includes(searchSpaces); 
                                    })
                                )
                                .map((space) => (
                                    <>
                                        <li 
                                            className="py-3 flex items-center hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                            key={space.id}
                                            onMouseOver={() => {
                                                setToggleWorkspaceMore(space.id);
                                                setToggleShowProject(space.id);
                                            }}
                                            onMouseLeave={() => {
                                                setToggleWorkspaceMore(null);
                                                setToggleShowProject(null);
                                            }}
                                        >
                                            <div className="icon-menu">
                                                {toggleShowProject === space.id ? (
                                                    <>
                                                        <KeyboardArrowDownIcon
                                                            className="hover:bg-[#19324928] rounded-md"
                                                            onClick={(e) => {
                                                                setToggleProjects((toggleProjects) => !toggleProjects);
                                                                getProjects(e, space.id);
                                                            }}
                                                        />
                                                        
                                                    </>
                                                )
                                                    : <DesktopWindowsOutlinedIcon/>
                                                }
                                            </div>
                                            <div className="menu-item">{space.name}</div>
                                            <div className="flex px-3 gap-2">
                                                {toggleWorkspaceMore === space.id && (
                                                    <>
                                                        <SettingsIcon 
                                                            onClick={(e) => {
                                                                setSettingSpace(space.id);
                                                                setEditingSpace(space);
                                                                getSpaceMembers(e, space);
                                                                setData('status', space.status);
                                                                setData('name', space.name);
                                                            }}
                                                            className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"
                                                        />
                                                        <HighlightOffIcon
                                                            onClick={() => setSpaceDeleteId(space)}
                                                            className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"
                                                        />
                                                    </>
                                                )}
                                                <AddOutlinedIcon 
                                                    className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"
                                                    onClick={() => setSpaceMenu(space)}
                                                />
                                            </div>
                                                    <EditSpace 
                                                        open={settingSpace === space.id} 
                                                        onClose={() => {
                                                            setSettingSpace(null);
                                                            setEditingSpace(null);
                                                            setSpaceMembers([]);
                                                            clear();
                                                        }}
                                                    >
                                                        <CloseIcon 
                                                            className='absolute right-3 top-4 cursor-pointer hover:opacity-50' 
                                                            onClick={() => {
                                                                setSettingSpace(null);
                                                                setEditingSpace(null);
                                                                setSpaceMembers([]);
                                                                clear();
                                                            }}
                                                        />

                                                        <div className="mt-1">
                                                            <h2 className="text-xl pb-1">Space Setting</h2>
                                                            <p className="opacity-50">Space mewakili bagian, subbagian, atau kelompok kerja, lengkap dengan daftar tugas, alur pelaksanaan</p>
                                                        </div>

                                                        <form onSubmit={(e) => updateSpace(e, space)}>
                                                            <div className="flex flex-col mt-4">
                                                                <label htmlFor="spaceInput" className="mb-1">Space Name</label>
                                                                <TextInput 
                                                                    placeHolder="ex: Unit Perancangan" 
                                                                    value={data.name} 
                                                                    onChange={(e) => setData('name', e.target.value)}
                                                                />
                                                                {errors.name && <p className="error text-red-500">{errors.name}</p>}
                                                            </div>

                                                            <div 
                                                                className="flex flex-wrap justify-center gap-4 m-4 overflow-y-auto max-h-[150px]"
                                                            >
                                                              {spaceMembers[space] && spaceMembers[space].length > 0 ? (
                                                                spaceMembers[space].map((spaceMember, index) => 
                                                                  index === 0 ? (
                                                                    <div
                                                                      key={index}
                                                                      className="bg-white relative shadow-md rounded-lg p-4 w-[120px] text-center cursor-default"
                                                                
                                                                    >
                                                                        <span className="absolute right-1 top-1 bg-sky-100 rounded-lg"><p className="text-sm text-blue-700 font-bold">owner</p></span>
                                                                        <div className="flex flex-col items-center mt-3">
                                                                            <img
                                                                            className="rounded-full mb-2"
                                                                            src={
                                                                                spaceMember.user.photo instanceof File
                                                                                ? URL.createObjectURL(spaceMember.user.photo)
                                                                                : spaceMember.user.photo
                                                                                ? `/storage/${spaceMember.user.photo}`
                                                                                : "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
                                                                            }
                                                                            alt={spaceMember.user.email}
                                                                            width="50"
                                                                            height="50"
                                                                            />
                                                                            <p className="text-sm font-medium">{spaceMember.user.name}</p>
                                                                        </div>
                                                                    </div>
                                                                ) : 
                                                                    data.status === 'private' ? (
                                                                            <div
                                                                              key={index}
                                                                              className="bg-white relative shadow-md rounded-lg p-4 w-[120px] text-center cursor-pointer"
                                                                              onMouseOver={() => setToggleDeleteMember(spaceMember.id)}
                                                                              onMouseLeave={() => setToggleDeleteMember(null)}
                                                                              onClick={(e) => deleteMember(e, spaceMember)}
                                                                            >
                                                                              {toggleDeleteMember === spaceMember.id ? (
                                                                                  <span className="absolute right-1 top-1"><HighlightOffIcon className="text-red-600"/></span>
                                                                              ) : 
                                                                                  <p></p>
                                                                              }
                                                                              <div className="flex flex-col items-center mt-3">
                                                                                  <img
                                                                                  className="rounded-full mb-2"
                                                                                  src={
                                                                                      spaceMember.user.photo instanceof File
                                                                                      ? URL.createObjectURL(spaceMember.user.photo)
                                                                                      : spaceMember.user.photo
                                                                                      ? `/storage/${spaceMember.user.photo}`
                                                                                      : "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
                                                                                  }
                                                                                  alt={spaceMember.user.email}
                                                                                  width="50"
                                                                                  height="50"
                                                                                  />
                                                                                  <p className="text-sm font-medium">{spaceMember.user.name}</p>
                                                                              </div>
                                                                            </div>
                                                                    ) : 
                                                                        <p></p>
                                                            )
                                                              ) : (
                                                                <p></p>
                                                              )}
                                                            </div>

                                                        

                                                            <div className="mt-[50px] flex justify-between">
                                                              <div>
                                                                <h2>{data.status === 'public' ? 'Buat Private' : 'Buat Public'}</h2>
                                                                <p className="opacity-50 pr-[50px]">
                                                                  {data.status === 'public' 
                                                                    ? 'Buat untuk hanya member yang anda izinkan bisa akses'
                                                                    : 'Semua Member dapat mengakses'}
                                                                </p>
                                                              </div>
                                                                
                                                              <label className="switch relative top-3">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={data.status === 'private'}
                                                                  onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setData('status', isChecked ? 'private' : 'public');
                                                                    setShowSelectMemberSetting(isChecked ? space.id : null);
                                                                  }}
                                                                />
                                                                <span className="slider"></span>
                                                              </label>
                                                            </div>

                                                            <div className='flex justify-end mt-3'>
                                                                <PrimaryButton disabled={processing}>
                                                                        Update
                                                                </PrimaryButton> 
                                                            </div>
                                                            
                                                            {showSelectMemberSetting === space.id && 
                                                                <div className="mt-2">
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
                                                                        members.filter(({ user }) => {
                                                                            const isMatch = searchEmail.trim() === '' || user.email?.toLowerCase().includes(searchEmail.toLowerCase());
                                                                            const isAlreadyMember = (spaceMembers[space] || []).some(member => member.user_id === user.id);
                                                                            return isMatch && !isAlreadyMember;

                                                                        }
                                                                        )
                                                                        .map((data) => (
                                                                            <div key={data.id}>
                                                                                {data.status === 'owner' ? (
                                                                                    <div 
                                                                                        className="p-4 rounded-lg cursor-default bg-slate-100 mt-3"
                                                                                                        
                                                                                    >
                                                                                        <div className="flex items-center space-x-2">                   
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
                                                                                            <span className="bg-sky-100 rounded-lg"><p className="p-1 text-blue-700 font-bold">{data.status}</p></span>       
                                                                                        </div>
                                                                                    </div>
                                                                                ) :  (
                                                                                    <div 
                                                                                        className="p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors duration-200 mt-2"
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
                                                        
                                                            }
                                                        </form>
                                                    </EditSpace>                                        
                                        </li>     

                                        <div className="ml-1">
                                                {toggleProjects === space.id && (
                                                    <ul>
                                                        {(projects[space.id] && projects[space.id].length > 0) ? (
                                                            projects[space.id].map((project) => (
                                                                <>
                                                                    <li 
                                                                        className="p-3 ml-4 flex justify-between hover:bg-green-400 hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
                                                                        key={project.id}
                                                                        onMouseOver={() => {
                                                                            setToggleProjectMore(space.id)
                                                                        }}
                                                                        onMouseLeave={() => {
                                                                            setToggleProjectMore(null)
                                                                        }}
                                                                        
                                                                    >
                                                                        {toggleProjectMore === space.id ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <KeyboardArrowDownIcon
                                                                                    className="hover:bg-[#19324928] rounded-md"
                                                                                    onClick={(e) => {
                                                                                        setToggleTasks((toggleTasks) => !toggleTasks);
                                                                                        getTasks(e, project.id);
                                                                                    }}
                                                                                />
                                                                                <p>{project.name}</p>
                                                                            </div>
                                                                        ) : 
                                                                            <div className="flex items-center gap-2">
                                                                                <FolderOpenOutlinedIcon/>
                                                                                <p>{project.name}</p>
                                                                            </div>
                                                                        }

                                                                        <div className="flex space-x-1">
                                                                            {toggleProjectMore === space.id ? (
                                                                                <>
                                                                                    <MoreHorizIcon 
                                                                                        className="hover:bg-[#fffdfd88] rounded-md cursor-pointer"
                                                                                        onClick={() => setProjectSetting(project)}
                                                                                    />
                                                                                    <AddOutlinedIcon 
                                                                                        className="hover:bg-[#fffdfd88] rounded-md cursor-pointer"
                                                                                        onClick={() => setProjectMenu(project)}
                                                                                    />
                                                                                </>

                                                                            ):
                                                                                <AddOutlinedIcon className="hover:bg-[#fffdfd88] rounded-md cursor-pointer"/>
                                                                            }
                                                                        </div>
                                                                    </li>
                                                                
                                                                    <div className="ml-3">
                                                                        {toggleTasks === project.id && (
                                                                            <ul>
                                                                                {tasks[project.id] && tasks[project.id].length > 0 ? (
                                                                                    tasks[project.id].map((task) => (
                                                                                        <li
                                                                                            className="p-3 ml-3 flex justify-between hover:bg-orange-400 hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
                                                                                            key={project.id}
                                                                                        >
                                                                                            <div className="flex items-center gap-2">
                                                                                                <FormatListBulletedOutlinedIcon/>
                                                                                                <p>{task.name}</p>
                                                                                            </div>

                                                                                            <MoreHorizIcon 
                                                                                                className="hover:bg-[#19324928] rounded-md cursor-pointer"
                                                                                                onClick={() => setTaskSetting(task)}
                                                                                            />
                                                                                        </li>
                                                                                    ))
                                                                                ) : 
                                                                                    <li className="text-gray-400 italic p-3 ml-3">Tidak ada task</li>
                                                                                }
                                                                            </ul>
                                                                            
                                                                        )}
                                                                    </div>
                                                                </>

                                                            ))
                                                        ) : (
                                                            <li className="text-gray-400 italic p-3 ml-3">Tidak ada project</li>
                                                        )}
                                                    </ul>
                                                )} 
                                        </div>
                                    </>
                                        
                                    )) : <p></p>
                                }


                                {/* Space */}
                                 <ConfirmDeleteModal open={spaceDeleteId} onClose={() => setSpaceDeleteId(null)}>
                                    <div className="p-5">
                                        <div className="rounded-md flex justify-center mb-5">
                                            <img src="https://t3.ftcdn.net/jpg/06/02/35/80/360_F_602358067_MTaipFpj2ioPKAYXA4wEpc6vu5P9QCfb.jpg" alt="" width={"100"}/>
                                        </div>
                                        {spaceDeleteId && (
                                            <>
                                                <h1 className="text-red-600 cursor-default">Delete: <b><u>{spaceDeleteId.name}</u></b></h1>
                                                <p className="cursor-default">
                                                    Tindakan ini akan menghapus semua data dalam space. Proses ini bersifat permanen. Apakah anda yakin ingin lanjutkan?
                                                </p>

                                                <div className="flex justify-center space-x-5 mt-10">
                                                    <SecondaryButton 
                                                        className="hover:bg-slate-200"
                                                        onClick={() => setSpaceDeleteId(null)}
                                                    >
                                                        Cancel
                                                    </SecondaryButton>
                                                    <PrimaryButton 
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={(e) => deleteSpace(e, spaceDeleteId)} 
                                                    >
                                                        Delete
                                                    </PrimaryButton>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ConfirmDeleteModal>

                                {/* Space Menu */}
                                <Menu open={spaceMenu} onClose={() => setSpaceMenu(null)}>
                                    <p className="mt-[-12px] text-sm opacity-50">Membuat</p>
                                    <hr />
                                    <div className="mt-5 space-y-4">
                                        <div 
                                            className="w-full cursor-pointer hover:bg-green-300 p-3 rounded-lg"
                                            onClick={() => {
                                                setProjectId(spaceMenu);
                                                setSpaceMenu(null);
                                            }}
                                        >
                                            <div className="flex space-x-1">
                                                <h2>Project</h2>
                                                <AccountTreeOutlinedIcon className="text-green-500"/>
                                            </div>
                                            <p className="text-sm opacity-75 p-2">mengelola tugas dan timeline dalam satu tempat</p>
                                        </div>
                                        <div className="w-full cursor-pointer hover:bg-blue-300 p-3 rounded-lg">
                                            <div className="flex space-x-1">
                                                <h2>Doc</h2>
                                                <ArticleOutlinedIcon className="text-blue-700"/>
                                            </div>
                                            <p className="text-sm opacity-75 p-2">Ruang untuk menulis hal penting untuk tim</p>
                                        </div>
                                    </div>
                                </Menu>
                                
                                {/* Create Project */}
                                <CreateModal open={projectId} onClose={() => setProjectId(null)}>
                                    <CloseIcon className='absolute right-3 top-4 cursor-pointer hover:opacity-50' onClick={() => setProjectId(null)}/>
                                    <div className="mt-1 cursor-default">
                                        <h2 className="text-xl pb-1">Buat Project Baru</h2>
                                        <p className="opacity-50">Gunakan project untuk mengelompokkan tugas yang akan ditugaskan kepada para member yang ada di workspace</p>
                                    </div>

                                    {projectId && (
                                        <form onSubmit={(e) => {
                                                addProject(e, projectId.id);
                                                setToggleProjects(null);
                                            }}
                                        >
                                            <div className="flex flex-col mt-4">
                                                <label htmlFor="spaceInput" className="mb-1">Project Name</label>
                                                <TextInput 
                                                    placeHolder="ex: Website BPS" 
                                                    onChange={(e) => {
                                                        setData('name', e.target.value);
                                                        setData('space_id', projectId.id);
                                                    }} 
                                                    value={data.name}/>
                                                {errors.name && <p className="error text-red-500">{errors.name}</p>}
                                            </div>
                                            <PrimaryButton className="absolute bottom-7 right-8">
                                                Create
                                            </PrimaryButton>
                                        </form>
                                    )}
                                </CreateModal>

                                <SettingModal open={projectSetting} onClose={() => setProjectSetting(null)}>
                                    {projectSetting && (
                                        <div className="space-y-3">
                                            <p><b>{projectSetting['name']}</b></p>
                                            <hr/>
                                            <div 
                                                className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors duration-200"
                                                onClick={() => {
                                                    setEditProjectId(projectSetting);
                                                    setProjectSetting(null);
                                                }}
                                            >
                                                <EditIcon/>
                                                <p>Rename</p>
                                            </div>
                                            <div 
                                                className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors duration-200"
                                                onClick={() => setConfirmDeleteProject(projectSetting)}
                                            >
                                                <DeleteIcon/>
                                                <p>Delete</p>
                                            </div>
                                            <div className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors duration-200">
                                                <DriveFileMoveOutlineIcon/>
                                                <p>Pindahkan</p>
                                            </div>
                                        </div>

                                    )}
                                </SettingModal>

                                <EditModal open={editProjectid} onClose={() => setEditProjectId(null)}>
                                    {editProjectid && (
                                        <div className="space-y-3 p-2">
                                            <p className="text-center">Edit: <b>{editProjectid['name']}</b></p>
                                            <hr/>
                                            
                                            <div className="flex justify-center pb-3">
                                                <input 
                                                    className="h-[30px] rounded-md border-none bg-slate-100 p-5"
                                                    defaultValue={editProjectid['name']}
                                                    onChange={(e) => {
                                                        setInputValueProject(e.target.value)
                                                        setData('name', e.target.value);
                                                        setData('space_id', editProjectid['id'])
                                                    }}
                                                    type="text" 
                                                />
                                            </div>
                                            <div className="flex justify-center space-x-3">
                                                {editProjectid.name === inputValueProject ? (
                                                    <PrimaryButton 
                                                        className="bg-blue-400 hover:bg-sky-500 transition-colors duration-200"
                                                        onClick={(e) => updateProject(e, editProjectid['id'])}
                                                    >   
                                                        Save
                                                    </PrimaryButton>
                                                ): 
                                                    <PrimaryButton 
                                                        className="bg-blue-400 hover:bg-sky-500 transition-colors duration-200 cursor-not-allowed"
                                                        onClick={(e) => updateProject(e, editProjectid['id'])}
                                                    >   
                                                        Save
                                                    </PrimaryButton>
                                                }
                                            </div>
                                        </div>

                                    )}
                                </EditModal>
                                
                                <ConfirmDeleteModal open={confirmDeleteProject} onClose={() => setConfirmDeleteProject(null)}>
                                    <div className="p-5">
                                        <div className="rounded-md flex justify-center mb-5">
                                            <img src="https://t3.ftcdn.net/jpg/06/02/35/80/360_F_602358067_MTaipFpj2ioPKAYXA4wEpc6vu5P9QCfb.jpg" alt="" width={"100"}/>
                                        </div>
                                        {confirmDeleteProject && (
                                            <>
                                                <h1 className="text-red-600 cursor-default">Delete: <b><u>{confirmDeleteProject.name}</u></b></h1>
                                                <p className="cursor-default">
                                                    Tindakan ini akan menghapus seluruh data yang terkait dengan proyek ini, termasuk tugas, dokumen, dan konten lainnya secara permanen.
                                                </p>

                                                <div className="flex justify-center space-x-5 mt-10">
                                                    <SecondaryButton 
                                                        className="hover:bg-slate-200"
                                                        onClick={() => setConfirmDeleteProject(null)}
                                                    >
                                                        Cancel
                                                    </SecondaryButton>
                                                    <PrimaryButton 
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={(e) => {
                                                            deleteProject(e, confirmDeleteProject);
                                                        }} 
                                                    >
                                                        Delete
                                                    </PrimaryButton>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ConfirmDeleteModal>

                                {/* Project Menu */}
                                <Menu open={projectMenu} onClose={() => setProjectMenu(null)}>
                                    <p className="mt-[-12px] text-sm opacity-50">Membuat</p>
                                    <hr />
                                    <div className="mt-5 space-y-4">
                                        <div 
                                            className="w-full cursor-pointer hover:bg-orange-200 p-3 rounded-lg"
                                            onClick={() => {
                                                setTaskId(projectMenu);
                                                setProjectMenu(null);
                                            }}
                                        >
                                            <div className="flex space-x-1">
                                                <h2>Task</h2>
                                                <FormatListBulletedOutlinedIcon className="text-orange-600"/>
                                            </div>
                                            <p className="text-sm opacity-75 p-2">Buat task yang perlu ditindaklanjuti oleh anggota workspace</p>
                                        </div>
                                        <div className="w-full cursor-pointer hover:bg-blue-300 p-3 rounded-lg">
                                            <div className="flex space-x-1">
                                                <h2>Doc</h2>
                                                <ArticleOutlinedIcon className="text-blue-700"/>
                                            </div>
                                            <p className="text-sm opacity-75 p-2">Ruang untuk menulis hal penting untuk tim</p>
                                        </div>
                                    </div>
                                </Menu>

                                 {/* Task  */}
                                {/* Create Task */}
                                <CreateModal open={taskId} onClose={() => setTaskId(null)}>
                                    <CloseIcon className='absolute right-3 top-4 cursor-pointer hover:opacity-50' onClick={() => setTaskId(null)}/>
                                    <div className="mt-1 cursor-default">
                                        <h2 className="text-xl pb-1">Buat Task</h2>
                                        <p className="opacity-50">Gunakan task untuk mengelola tugas yang akan ditugaskan kepada para member yang ada di workspace</p>
                                    </div>

                                    {taskId && (
                                        <form onSubmit={(e) => {
                                                addTask(e, taskId.id);
                                                setToggleProjects(null);
                                            }}
                                        >
                                            <div className="flex flex-col mt-4">
                                                <label htmlFor="spaceInput" className="mb-1">Task Name</label>
                                                <TextInput 
                                                    placeHolder="ex: Update UI Laporan Bulanan" 
                                                    onChange={(e) => {
                                                        setData('name', e.target.value);
                                                        setData('project_id',  taskId.id);
                                                    }} 
                                                    value={data.name}/>
                                                {errors.name && <p className="error text-red-500">{errors.name}</p>}
                                            </div>
                                            <PrimaryButton className="absolute bottom-7 right-8">
                                                Create
                                            </PrimaryButton>
                                        </form>
                                    )}
                                </CreateModal>

                                <SettingModal open={taskSetting} onClose={() => setTaskSetting(null)}>
                                    {taskSetting && (
                                        <div className="space-y-3">
                                            <p><b>{taskSetting['name']}</b></p>
                                            <hr/>
                                            <div 
                                                className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors duration-200"
                                                onClick={() => {
                                                    setEditTask(taskSetting);
                                                    setTaskSetting(null);
                                                }}
                                            >
                                                <EditIcon/>
                                                <p>Rename</p>
                                            </div>
                                            <div 
                                                className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors duration-200"
                                                onClick={() => setConfirmDeleteTask(taskSetting)}
                                            >
                                                <DeleteIcon/>
                                                <p>Delete</p>
                                            </div>
                                        </div>

                                    )}
                                </SettingModal>

                                <EditModal open={editTask} onClose={() => setEditTask(null)}>
                                    {editTask && (
                                        <div className="space-y-3 p-2">
                                            <p className="text-center">Edit: <b>{editTask['name']}</b></p>
                                            <hr/>
                                            
                                            <div className="flex justify-center pb-3">
                                                <input 
                                                    className="h-[30px] rounded-md border-none bg-slate-100 p-5"
                                                    defaultValue={editTask['name']}
                                                    onChange={(e) => {
                                                        setInputValueTask(e.target.value)
                                                        setData('name', e.target.value);
                                                        setData('project_id', editTask['project_id'])
                                                    }}
                                                    type="text" 
                                                />
                                            </div>
                                            <div className="flex justify-center space-x-3">
                                                {editTask.name === inputValueTask ? (
                                                    <PrimaryButton 
                                                        className="bg-blue-400 hover:bg-sky-500 transition-colors duration-200"

                                                        onClick={(e) => updateTask(e, editTask['id'])}
                                                    >   
                                                        Save
                                                    </PrimaryButton>
                                                ): 
                                                    <PrimaryButton 
                                                        className="bg-blue-400 hover:bg-sky-500 transition-colors duration-200"
                                                        onClick={(e) => updateTask(e, editTask['id'])}
                                                       
                                                    >   
                                                        Save
                                                    </PrimaryButton>
                                                }
                                            </div>
                                        </div>

                                    )}
                                </EditModal>    

                                <ConfirmDeleteModal open={confirmDeleteTask} onClose={() => setConfirmDeleteTask(null)}>
                                    <div className="p-5">
                                        <div className="rounded-md flex justify-center mb-5">
                                            <img src="https://t3.ftcdn.net/jpg/06/02/35/80/360_F_602358067_MTaipFpj2ioPKAYXA4wEpc6vu5P9QCfb.jpg" alt="" width={"100"}/>
                                        </div>
                                        {confirmDeleteTask && (
                                            <>
                                                <h1 className="text-red-600 cursor-default">Delete: <b><u>{confirmDeleteTask.name}</u></b></h1>
                                                <p className="cursor-default">
                                                    Tindakan ini akan menghapus seluruh data yang terkait dengan proyek ini, termasuk tugas, dokumen, dan konten lainnya secara permanen.
                                                </p>

                                                <div className="flex justify-center space-x-5 mt-10">
                                                    <SecondaryButton 
                                                        className="hover:bg-slate-200"
                                                        onClick={() => setConfirmDeleteTask(null)}
                                                    >
                                                        Cancel
                                                    </SecondaryButton>
                                                    <PrimaryButton 
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={(e) => {
                                                            deleteTask(e, confirmDeleteTask);
                                                        }} 
                                                    >
                                                        Delete
                                                    </PrimaryButton>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ConfirmDeleteModal>

                                


                                



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