import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


export default function Index({ workspace, activeWorkspace, activeMembersStatus, activeMembers, getSpaces}){
    return (
        <AuthenticatedLayout 
            workspace={workspace}
            activeWorkspace={activeWorkspace}
            activeMembersStatus={activeMembersStatus}
            activeMembers={activeMembers}
            getSpaces={getSpaces}
        >
            
            <div className="mb-1">
                <h2 className="text-slate-600 font-bold">lorep/ipsum/amazing</h2>
            </div>

            <hr className="border-slate-400"/>

            <div className="flex justify-between mt-5">
                <div className="flex items-center gap-3">
                    <Link className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg transition-colors duration-200">
                        <FormatListBulletedOutlinedIcon/>
                        <p>List</p>
                    </Link>
                    <Link className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg transition-colors duration-200">
                        <DashboardIcon/>
                        <p>Board</p>
                    </Link>
                    <Link className="flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg transition-colors duration-200">
                        <StackedBarChartOutlinedIcon/>
                        <p>Gantt</p>
                    </Link>
                </div>
                <div>
                    <input
                        class="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-96"
                        placeholder="Search..."
                        required=""
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-7 m-2 mt-5">
                <KeyboardArrowDownIcon className="hover:bg-[#19324928] rounded-md"/>
                <div className="flex space-x-2">
                    <RadioButtonCheckedOutlinedIcon className=""/>
                    <p>Status</p>
                </div>
                <PrimaryButton>
                    <AddOutlinedIcon/>
                    Add Task
                </PrimaryButton>
            </div>

            <div className="mt-5 ml-6 overflow-x-auto rounded-lg shadow">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-sky-300 hidden lg:table-header-group">
                  <tr className="border-b-4 border-gray-400 border-opacity-50">
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Name</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Assign</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Due Date</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white lg:table-row flex flex-col lg:flex-row">
                    <td className="p-3 text-sm text-gray-700 lg:min-w-[200px] whitespace-nowrap cursor-pointer hover:bg-slate-100 " data-label="Name">
                      Task Name
                    </td>
                    <td className="p-3 text-sm font-bold text-blue-500 whitespace-nowrap cursor-pointer hover:bg-slate-100" data-label="Assign">
                      John Doe
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-pointer hover:bg-slate-100" data-label="Due Date">
                      2025-06-01
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-100" data-label="Priority">
                      High
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </AuthenticatedLayout>
    )
}