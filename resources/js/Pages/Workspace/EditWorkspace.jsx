import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Head, Link, usePage } from "@inertiajs/react";

import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useEffect, useState } from 'react';


export default function EditWorkspace({ workspace, children, activeMembersStatus }) {
    const user = usePage().props.auth.user;

    const currentUserStatus = activeMembersStatus.find(m => m.user_id === user.id).status;

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const [burgerButton, setBurgerButton] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSideBarOpen(true);
                setBurgerButton(false)
            } else {
                setIsSideBarOpen(false);
                setBurgerButton(true);
            }
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <>
            {burgerButton && (
              <button 
                onClick={() => {
                  setIsSideBarOpen(true);
                  setBurgerButton(false);
                }} 
                className="md:hidden fixed top-4 left-4 z-20 bg-sky-600 text-white p-2 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {isSideBarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
                onClick={() => {
                  setIsSideBarOpen(false);
                  setBurgerButton(true);
                }}
              />
            )}

            <div className="h-screen flex bg-blue-100">
                <Head title="Settings"/>
                {/* Sidebar Container */}

                {isSideBarOpen && (
                    <nav className="fixed md:relative z-10 h-full md:h-auto w-[260px] bg-sky-600 ">
                        {/* Sidebar Header */}
                        <Link 
                            href={route('dashboard')}
                            className="flex gap-1 justify-end mr-3 mt-3 cursor-pointer hover:translate-x-[-10px] duration-200"
                        >
                            <ArrowBackIcon className="text-white"/>
                            <p className="text-white text-sm mt-[3px]">Kembali</p>

                        </Link>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-7 py-3 cursor-default">
                            <div className="header-sidebar flex h-[70px] items-center justify-center gap-0 px-2">
                                <div className="bg-white px-[8px] py-[10px] rounded-full w-[60px]">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="65"/>
                                </div>
                                <p className="text-white text-xl font-bold pl-3">{workspace.name}</p>
                            </div>
                        </div>

                        {/* Sidebar Menu Space */}
                        <div className="flex h-[815px] bg-gray-100 flex-col">
                            <div className="border-b-2 border-gray-300">
                                <ul className="w-full justify-center">
                                    {currentUserStatus === 'admin' || currentUserStatus === 'owner' && (
                                        <Link 
                                            href={route('workspace.edit', workspace)}
                                            className={route().current('workspace.edit', workspace) 
                                                ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer" 
                                                : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                            }>
                                            <div className="flex px-4 gap-2">
                                                <SettingsIcon/>
                                                <p>Settings</p>
                                            </div>
                                        </Link>
                                    )}
                                        

                                    <Link 
                                        href={route('workspace.members', workspace)}
                                        className={route().current('workspace.members')
                                            ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer"
                                            : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                        }>
                                        <div className="flex px-4 gap-2">
                                            <PersonIcon/>
                                            <p>People</p>
                                        </div>
                                    </Link>         
                                    <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer">
                                        <div className="flex px-4 gap-2">
                                            <SatelliteAltIcon/>
                                            <p>Spaces</p>
                                        </div>
                                    </li>         
                                </ul>
                            </div>

                            <div className="my-3">
                                <p className="text-sm opacity-50 px-5">{user.name}</p>
                                <ul className="w-full justify-center my-1">
                                    <Link 
                                        href={route('profile.edit')}
                                        className={route().current('profile.edit') 
                                            ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer" 
                                            : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                        }>
                                        <div className="flex px-4 gap-2">
                                            <ManageAccountsIcon/>
                                            <p>Profile</p>
                                        </div>
                                    </Link>
                                    <Link 
                                        href={route('workspace.index', workspace)}
                                            className={route().current('workspace.index', workspace) 
                                                ? "py-3 flex bg-sky-400 text-white rounded-sm cursor-pointer" 
                                                : "py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer"
                                            }>
                                        <div className="flex px-4 gap-2">
                                            <WorkspacesIcon/>
                                            <p>Workspaces</p>
                                        </div>
                                    </Link>         
                                    <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm transition-colors duration-200 cursor-pointer">
                                        <div className="flex px-4 gap-2">
                                            <DraftsOutlinedIcon/>
                                            <p>Inbox</p>
                                        </div>
                                    </li>         
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
                )}

        
                <main className="flex-1 overflow-auto h-full">
                    {children}
                </main>
            </div>
        </>
    )
}
