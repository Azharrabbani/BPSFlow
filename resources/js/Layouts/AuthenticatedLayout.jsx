import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-blue-100 ">
            {/* Sidebar Container */}
            <nav className="border-b bg-sky-600 fixed h-full w-[300px]">
                {/* Sidebar Header */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-7 py-3">
                    <div className="header-sidebar flex h-[70px] items-center justify-around gap-0">
                        <Link href={route('dashboard')} className="bg-white px-[10px] py-[15px] rounded-full w-[70px]">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg" alt="" width="65"/>
                        </Link>
                        <p className="text-white text-xl font-bold">Azhar Rabbani</p>
                                
                            
                        

                        {/* <div className="flex  space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                        </div> */}

                        

                        {/* <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            
                            <div className="relative ms-3">
                                
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div> */}
                    </div>
                </div>



                {/* Sidebar Menu Space */}
                <div className="flex h-full bg-gray-100 flex-col">
                    {/* Sidebar menu */}
                    <div className="sidebar-menu border-b-2">
                        <ul className="w-full justify-center">
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icons"><HomeOutlinedIcon/></div>
                                <div className="menu-item">Home</div>
                            </li>
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icons"><DraftsOutlinedIcon/></div>
                                <div className="menu-item">Inbox</div>
                            </li>
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icons"><PersonOutlineOutlinedIcon/></div>
                                <div className="menu-item">Profile</div>
                            </li>                  
                        </ul>
                    </div>
                    
                    {/* spaces header */}
                    <div className=" flex px-3 pt-3 justify-between">
                        <p className="text-sm text-gray-800">Spaces</p>

                        <div className="flex px-[0px] gap-2">
                            <SearchOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                            <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                            <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                        </div>
                    </div>
                    
                    {/* Sidebar list menu */}
                    <div>
                        <ul className="w-full justify-center">
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icon-menu"><DesktopWindowsOutlinedIcon/></div>
                                <div className="menu-item">Space1</div>
                                <div className="flex px-3 gap-2">
                                    <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                    <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                </div>
                            </li>
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icon-menu"><DesktopWindowsOutlinedIcon/></div>
                                <div className="menu-item">Space2</div>
                                <div className="flex px-3 gap-2">
                                    <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                    <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                </div>
                            </li>
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icon-menu"><DesktopWindowsOutlinedIcon/></div>
                                <div className="menu-item">Space3</div>
                                <div className="flex px-3 gap-2">
                                    <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                    <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                </div>
                            </li>
                            <li className="py-3 flex hover:bg-sky-400 hover:text-white hover:rounded-sm cursor-pointer">
                                <div className="icon-menu"><DesktopWindowsOutlinedIcon/></div>
                                <div className="menu-item">Space4</div>
                                <div className="flex px-3 gap-2">
                                    <MoreHorizOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                    <AddOutlinedIcon className="w-2 hover:bg-[#19324928] rounded-md cursor-pointer"/>
                                </div>
                            </li>                        
                        </ul>
                    </div>
                    

                    {/* Sidebar bottom menu */}
                    <div className="absolute bg-blue-300 bottom-5 left-[50%] right-[50%]">
                        <div className="flex justify-center divide-x-2">
                            <div className="flex gap-2 hover:bg-sky-400 hover:text-white hover:rounded-lg px-5 p-2 cursor-pointer">
                                <PersonAddOutlinedIcon/>
                                <p>Invite</p>
                            </div>
                            <div className="flex gap-2 hover:bg-sky-400 hover:text-white hover:rounded-lg px-5 p-2 cursor-pointer">
                                <LogoutOutlinedIcon/>
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                    

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {children}
            </main>
        </div>
    );
}
