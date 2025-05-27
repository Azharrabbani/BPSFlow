import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import AssignmentModal from "@/Components/assignment/AssignmentModal";
import AssignModal from "@/Components/assignment/AssignModal";
import PriorityModal from "@/Components/assignment/PriorityModal";
import { useRef, useState } from "react";

import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from "@/Components/TextInput";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';




export default function Index({ workspace, activeWorkspace, activeMembersStatus, members, getSpaces, task, currentProject, currentSpace}){
  const user = usePage().props.auth.user;
  

  const {data, setData, post, errors, processing, recentlySuccessful} = useForm({
    'name': '',
    'task_id' : task.id,
    'space_member_id': '',
    'status': '',
    'priority': '',
    'due_date': '',
  });

  const [search, setSearch] = useState('');

  const [addAssignment, setAddAssignment] = useState(false);

  const dateRef = useRef(null);

  const [assignMemberHover, setAssignMemberHover] = useState(false);

  const [toggleAssign, setToggleAssign] = useState(false);
  
  const [dueDateHover, setDueDateHover] = useState(false);

  const [toggledue, setToggleDue] = useState(false);

  const [priorityHover, setPriorityHover] = useState(false);

  const [togglePriority, setTogglePriority] = useState(false);



  return (
      <AuthenticatedLayout 
          workspace={workspace}
          members={members}
          activeWorkspace={activeWorkspace}
          activeMembersStatus={activeMembersStatus}
          getSpaces={getSpaces}
      >
          <Head title="assignment"/>
          
          <div className="mb-1">
            <div className="flex space-x-3">
                <Link className="flex gap-2 text-slate-600 font-bold hover:bg-sky-400 hover:text-white p-2 rounded-lg transition-colors duration-200">
                  <DesktopWindowsOutlinedIcon/>
                  {currentSpace[0].name}
                </Link>
                <p className="p-2 ">/</p>
                <Link className="flex gap-2 text-slate-600 font-bold hover:bg-green-400 hover:text-white p-2 rounded-lg transition-colors duration-200">
                  <FolderOpenOutlinedIcon/>
                  {currentProject[0].name} 
                </Link>
                <p className="p-2 ">/</p>
                <Link className="flex gap-2 text-slate-600 font-bold hover:bg-orange-400 hover:text-white p-2 rounded-lg transition-colors duration-200">
                  <FormatListBulletedOutlinedIcon/>
                  {task.name}
                </Link>
            </div>
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
              <PrimaryButton onClick={() => setAddAssignment(true)}>
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


            <AssignmentModal 
              open={addAssignment} 
              onClose={() => {
                setAddAssignment(false);
                setToggleAssign(false);
                setToggleDue(false);
                setTogglePriority(false);
              }}
            >
              <CloseIcon 
                  className='absolute right-3 top-4 cursor-pointer hover:opacity-50' 
                  onClick={() => {
                      setAddAssignment(false); 
                      clear();
                  }}
              />

              <div className="mt-1 cursor-default">
                  <h2 className="text-xl pb-1">Buat Assignment Baru</h2>
                  <p className="opacity-50">Assignment mewakili unit kerja, proyek, atau kegiatan spesifik dalam sebuah space. Gunakan assignment untuk mengelompokkan tugas-tugas berdasarkan tujuan, waktu, atau member yang bertanggung jawab.</p>
              </div>

              <form>
                <div className="flex flex-col mt-6">
                  <label htmlFor="spaceInput" className="mb-1">Assignment Name</label>
                  <TextInput 
                    placeHolder="Pengembangan Dashboard Statistik" 
                      
                  />
                  {errors.name && <p className="error text-red-500">{errors.name}</p>}
                </div>
                
                <div className="mt-9">
                  <div className="w-full">
                    <div className="flex justify-around">
                      {/* Assign Member */}
                      <div 
                        className="flex flex-col items-center hover:text-green-600 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                        onMouseEnter={() => setAssignMemberHover(true)}
                        onMouseLeave={() => setAssignMemberHover(false)}
                        onClick={() => setToggleAssign(true)}
                      >
                        <PersonAddAltOutlinedIcon/>
                        {assignMemberHover && (
                          <p className="bg-green-100 p-2 text-green-500 text-bold mt-2 absolute top-[300px] rounded-lg">Assign Member</p>
                        )}
                      </div>

                      {/* due date */}
                      <div 
                        className="hover:text-orange-500 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                        onMouseEnter={() => setDueDateHover(true)}
                        onMouseLeave={() => setDueDateHover(false)}
                        onClick={() => dateRef.current?.showPicker()}
                      >
                        <input 
                          type="date" 
                          ref={dateRef}  
                          className="hidden absolute left-10"
                        />
                        <CalendarMonthOutlinedIcon/>
                        {dueDateHover && (
                          <p className="bg-orange-100 p-2 text-orange-500 text-bold mt-2 absolute top-[300px] right-[240px] rounded-lg">Set Due Date</p>
                        )}
                      </div>

                      {/* priority */}
                      <div 
                        className="hover:text-red-600 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                        onMouseEnter={() => setPriorityHover(true)}
                        onMouseLeave={() => setPriorityHover(false)}
                        onClick={() => setTogglePriority(true)}
                      >
                        <OutlinedFlagOutlinedIcon/>
                        {priorityHover && (
                          <p className="bg-red-100 p-2 text-red-500 text-bold mt-2 absolute top-[300px] right-[70px] rounded-lg">Set Priority</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end mt-5'>
                  <PrimaryButton>
                      Create
                  </PrimaryButton>
                </div>

                <AssignModal open={toggleAssign} onClose={() => {setToggleAssign(false)}}>
                  <div>
                    <input
                        class="input rounded-full px-5 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full"
                        placeholder="Search..."
                        required=""
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="p-1 mt-5 max-h-[100px] overflow-y-auto">
                    {members && members.length > 0 ? (
                      members.filter(user => {
                        if (!search || search.trim === '') return true;

                        const query = search.toLowerCase();
                        return (
                          user.user?.name?.toLowerCase().includes(query) || 
                          search.user?.email?.toLowerCase().includes(query)
                        );
                      })
                      .map(member => (
                        <div className="hover:bg-slate-100 transition-colors duration-150 pl-2 rounded-lg cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <img src={
                                member.user.photo instanceof File 
                                ? URL.createObjectURL( member.user.photo) 
                                :  member.user.photo
                                ? `/storage/${ member.user.photo}` 
                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                            }  alt="Profile" width="25" className='my-5 rounded-full'/> 
                            <p>{member.user.name}</p>
                          </div>
                        </div>
                      ))
                    ) : 
                      <p>dfdfd</p>
                    }
                  </div>

                </AssignModal>

                <PriorityModal open={togglePriority} onClose={() => setTogglePriority(false)}>
                    <div className="max-h-[150px] overflow-y-auto space-y-3">
                      <div className="flex items-center space-x-2 hover:bg-red-100 transition-colors duration-150 cursor-pointer w-full rounded-lg">
                        <OutlinedFlagOutlinedIcon className="text-red-500"/>
                        <p className="p-1">High</p>
                      </div>
                      <div className="flex items-center space-x-2 hover:bg-orange-100 transition-colors duration-150 cursor-pointer w-full rounded-lg">
                        <OutlinedFlagOutlinedIcon className="text-orange-500"/>
                        <p className="p-1">Urgent</p>
                      </div>
                      <div className="flex items-center space-x-2 hover:bg-green-100 transition-colors duration-150 cursor-pointer w-full rounded-lg">
                        <OutlinedFlagOutlinedIcon className="text-green-500"/>
                        <p className="p-1">Normal</p>
                      </div>
                      <div className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg">
                        <OutlinedFlagOutlinedIcon/>
                        <p className="p-1">Low</p>
                      </div>
                    </div>
                </PriorityModal>

               
              </form>
            </AssignmentModal>
      </AuthenticatedLayout>
  )
}