import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import AssignmentModal from "@/Components/assignment/AssignmentModal";
import AssignModal from "@/Components/assignment/AssignModal";
import PriorityModal from "@/Components/assignment/PriorityModal";
import AssignModal2 from "@/Components/assignment/AssignModal2";
import PriorityModal2 from "@/Components/assignment/PriorityModal2";
import StatusModal from "@/Components/assignment/StatusModal";
import DetailModal from "@/Components/assignment/detailModal";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Willow } from "wx-react-gantt";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from "react";

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
import DeleteIcon from '@mui/icons-material/Delete';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ArticleIcon from '@mui/icons-material/Article';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import CodeIcon from '@mui/icons-material/Code';
import FolderZipIcon from '@mui/icons-material/FolderZip';


export default function Index({ workspace, activeWorkspace, activeMembersStatus, members, getWorkspaceSpaces, tasks, currentProject, currentSpace, assignments}){
  const user = usePage().props.auth.user;

  const currentUserStatus = activeMembersStatus.find(m=> m.user_id === user.id).status;
  
  const {data, setData, post, get, delete:destroy, errors, processing, recentlySuccessful} = useForm({
    'name': '',
    'tasks_id' : tasks.id,
    'workspace': activeWorkspace,
    'members': members,
    'space_member_id': '',
    'status': 'To Do',
    'priority': '',
    'due_date': '',
    'assignment_id': '',
    'file': '',
  });

  const mappedAssignments = assignments.map(item => ({
    id: item.id,
    text: item.name,
    start: item.created_at,
    end: item.due_date,
    lazy: false,
  }));

  const links = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
  ];

  const readonly = true;


  const {flash} = usePage().props;

  const [flashMsg, setFlashMsg] = useState(flash?.message || null);

  const [search, setSearch] = useState('');

  const [searchAssignment, SetSearchAssignment] = useState('');

  const [showAssignment, setShowAssignment] = useState(null);

  const [detailToggle, setDetailToggle] = useState(false);

  const [assignmentData, setAssignmentData] = useState(null);

  const [listView, setListView] = useState(true);

  const [gantView, setGantView] = useState(false);

  useEffect(() => {
    if (flash?.message) {
      setFlashMsg(flash.message);
      setTimeout(() => setFlashMsg(null), 3000);
    }
  }, [flash]);

  const groupAssignments = assignments.reduce((groups, tasks) => {
    const status = tasks.status;
    if (!groups[status]) groups[status] = [];
    groups[status].push(tasks);
    return groups;
  }, {});

  // Assign State
  const [member, setMember] = useState(null);

  const [assignMemberHover, setAssignMemberHover] = useState(false);
  
  const [addAssignment, setAddAssignment] = useState(false);

  const [toggleAssign, setToggleAssign] = useState(false);

  const [toggleAssign2, setToggleAssign2] = useState(null);

  const [hoverAssignment, setHoverAssignment] = useState(null);

  const [editingAssignment, setEditingAssignment] = useState(null);

  const [editedName, setEditedName] = useState('');
  
  // Due Date State
  const [dueDateHover, setDueDateHover] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null);

  const [toggledue, setToggleDue] = useState(false);

  const [toggledue2, setToggleDue2] = useState(null);

  const [hoverDueDate, setHoverDueDate] = useState(null); 

  // Status State
  const [toggleStatus, setToggleStatus] = useState(null);

  // Priority State
  const [priority, setPriority] = useState(null);

  const [priorityHover, setPriorityHover] = useState(false);

  const [togglePriority, setTogglePriority] = useState(false);

  const [togglePriority2, setTogglePriority2] = useState(null);

  // Files State
  const [files, setFiles] = useState([]);


  const [uploadTrigger, setUploadTrigger] = useState(false);

  // renderFiles
  useEffect(() => {
    if (assignmentData) {
      getFiles({ preventDefault: () => {} }, assignmentData);
    }
  }, [uploadTrigger]);


  function clear() {
    setAddAssignment(false);
    setToggleAssign(false);
    setToggleDue(false);
    setTogglePriority(false);
    setMember(null);
    setSelectedDate(null);
    setPriority(null);
  }

  function checkUser(space_member_id) {
    const member = members.find(element => element.user_id === space_member_id);

    return (
      member ? (
        <div className="flex items-center space-x-2">
          <img src={
            member.user.photo instanceof File 
            ? URL.createObjectURL( member.user.photo) 
            :  member.user.photo
            ? `/storage/${ member.user.photo}` 
            : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
          }  alt="Profile" width="25" className='rounded-full'/> 
          <p className="cursor-default">{member.user.name}</p>
        </div>
      ) : null
    );
  }

  function checkStatus(status) {
    if (status === 'To Do') {
      return (
        <div className="flex gap-2 items-center">
          <RadioButtonCheckedOutlinedIcon />
          {status}
        </div>
      )
    } else if (status === 'In Progress') {
      return (
        <div className="text-blue-500 flex gap-2 items-center">
          <RadioButtonCheckedOutlinedIcon />
          {status}
        </div>
      )
    } else if (status === 'Completed') {
      return (
        <div className="text-green-600 flex gap-2 items-center">
          <RadioButtonCheckedOutlinedIcon />
          {status}
        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  function checkPriority(priority) {
    if (priority === 'High') {
      return (
        <div className="text-red-600">
          <OutlinedFlagOutlinedIcon />
          {priority}
        </div>
      )
    } else if (priority === 'Urgent') {
      return (
        <div className="text-orange-500">
          <OutlinedFlagOutlinedIcon />
          {priority}
        </div>
      )
    } else if (priority === 'Normal') {
      return (
        <div className="text-green-500">
          <OutlinedFlagOutlinedIcon />
          {priority}
        </div>
      )
    } else if (priority === 'Low') {
      return (
        <div>
          <OutlinedFlagOutlinedIcon />
          {priority}
        </div>
      )
    } else {
      return (
        <p className="opacity-50 italic">Select status</p>
      )
    }
  }

  function checkFiles(file, index) {
    const extension = file.generatedName.slice(file.generatedName.lastIndexOf('.') + 1).toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
    const isCodeFile = ['cpp', 'py', 'java', 'html', 'css', 'js', 'php', 'dart', 'c', 'swift', 'vb', 'xml', 'json', 'sh', 'bat', 'dll', 'apk'].includes(extension);
    const imageSrc =
      file instanceof File
        ? URL.createObjectURL(file.generatedName)
        : file.generatedName
          ? `/storage/files/${file.generatedName}`
          : 'https://www.freeiconspng.com/uploads/photo-album-icon-png-14.png';

    const baseStyle = "relative w-32 h-32 border-2 flex flex-col items-center justify-center text-center rounded-xl shadow cursor-pointer hover:opacity-70";

    const iconWrapper = (children, color) => (
      <a 
        key={index} 
        className={`${baseStyle} border-2 ${color}`}
        
        href={route('files.download', file)}
      >
        {children}
        
          <HighlightOffIcon 
            className="absolute top-1 right-1 hover:text-red-500"
            onClick={(e) => deleteFiles(e, file.id)}
          />
   
        <figcaption className="text-xs mt-2 break-all px-1">{file.originalName.length > 10 && (
            file.originalName.slice(0, 15 - 3) + '...'
          )}
        </figcaption>
      </a>
    );


    if (isImage) {
      return (
        <a 
          key={index} 
          className={baseStyle}
          
          href={route('files.download', file)}
        >
          
            <HighlightOffIcon 
              className="absolute top-1 right-1 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteFiles(e, file.id);
              }}
            />
          
          <img
            src={imageSrc}
            alt="Uploaded file"
            className="w-16 mt-4 h-20 object-cover rounded-xl"
          />
          <figcaption className="text-xs mt-4 break-all px-1">
            {file.originalName.length < 10
              ? file.originalName
              : file.originalName.slice(0, 10 - 3) + '...'}
          </figcaption>
        </a>
      );
    } else if (isCodeFile) {
      return iconWrapper(<CodeIcon className="text-orange-500 text-6xl" />, "border-orange-500");
    } else if (extension === 'pdf') {
      return iconWrapper(<PictureAsPdfIcon className="text-red-600 text-6xl" />, "border-red-600");
    } else if (extension === 'docx') {
      return iconWrapper(<ArticleIcon className="text-blue-500 text-6xl" />, "border-blue-500");
    } else if (extension === 'xlsx') {
      return iconWrapper(<BackupTableIcon className="text-green-700 font-semibold text-sm"/>, "border-green-500");
    } else if (extension === 'zip') {
      return iconWrapper(<FolderZipIcon className="text-black font-semibold text-sm"/>, "border-black");
    } else {
      return iconWrapper(<span className="text-gray-500 text-sm">FILE</span>, "border-gray-400");
    }
  }

  function checkDue(assignment) {
    const today = new Date().toISOString().slice(0, 10);
    const setTomorrow = new Date(today);
    setTomorrow.setDate(setTomorrow.getDate() + 1);
    const tomorrow = new Date(setTomorrow).toISOString().slice(0, 10);

    if (assignment.status === 'Completed') {
      return (
        <p>{assignment.due_date}</p>
      )
    }

    if (assignment.due_date === today) {
      return (
        <p className="text-blue-500">Today</p>
      )
    } else if (assignment.due_date === tomorrow) {
      return (
        <p className="text-orange-500">Tomorrow</p>
      )
    } else if (assignment.due_date < today) {
      return (
        <p className="text-red-500">Late</p>
      )
    } else {
      return (
        <p>{assignment.due_date}</p>
      )
    }
  }

  // Assignment Method

  // Create Assignment
  const createAssignment = (e) => {
    e.preventDefault();

    post(route('assignment.store'), {
      onSuccess: () => {
        data.status = 'To Do';
        data.name = '';
        data.priority = '';
        data.due_date = '';
        clear();
      },
      onError: () => [
        console.log("Gagal membuat assignment")
      ],
      onFinish: () => {
        console.log('Selesai');
      }
    })
  }

  // Upload File
  const uploadFiles = (e, assignmentId) => {
  e.preventDefault();

  post(route('assignment.file', assignmentId), {
    forceFormData: true,
    onSuccess: () => {
      setUploadTrigger(prev => !prev); 
    },
    onError: (err) => {
      console.error('Gagal upload file:', err);
    }
  });
};

  // Get Files
  const getFiles = async (e, assignmentId) => {
    e.preventDefault();

    if(assignmentData === assignmentId.id) {
      setAssignmentData(null);
      setDetailToggle(false);
      setFiles([]);
      return;
    }

    try{
      const response = await axios.get(route('assignment.getFiles', assignmentId.id));
      setFiles((prev) => ({...prev, [assignmentId.id]: response.data}));
      setAssignmentData(assignmentId)
      setDetailToggle(true);
    }catch(error) {
      console.error("Gagal fetch files", error);
    }
  }

  // Delete Files
  const deleteFiles = (e, fileId) => {
    e.preventDefault();

    destroy(route('files.destroy', fileId), {
      onSuccess: () => {
      setUploadTrigger(prev => !prev); 
    },
    });
  }
  
  // Rename Assignment
  const renameAssignment = (e, assignmentId) => {
    e.preventDefault();

    post(route('assignment.renameAssignment', assignmentId), {
      onSuccess: () => {
        setEditingAssignment(null);
      },
      onError: () => {
        console.log('Gagal rename Assignment');
      },
      onFinish: () => {
        console.log('selesai');
      }
    });
  }

  // Delete Assignment
  const deleteAssignment = (e, assignmentId) => {
    e.preventDefault();

    destroy(route('assignment.delete', assignmentId));
  }

  // Update Assignee
  const updateAssignee = (e, assignmentId) => {
    e.preventDefault();

    post(route('assignment.updateAssignee', assignmentId), {
      onSuccess: () => {
        setToggleAssign2(null);
      },
      onError: () => {
        console.log('Gagal Update Assignee')
      },
      onFinish: () => {
        console.log('selesai');
      }
    });
  }

  // Update Status
  const updateStatus = (e, assignmentId) => {
    e.preventDefault();

    post(route('assignment.updateStatus', assignmentId), {
      onSuccess: () => {
        setToggleStatus(null);
      },
      onError: () => {
        console.log('Gagal Update Priority')
      },
      onFinish: () => {
        console.log('selesai');
      }
    });
  }

  // Update Priority
  const updatePriority = (e, assignmentId) => {
    e.preventDefault();

    post(route('assignment.updatePriority', assignmentId), {
      onSuccess: () => {
        setTogglePriority2(null);
        data.priority = '';
      },
      onError: () => {
        console.log('Gagal Update Priority')
      },
      onFinish: () => {
        console.log('selesai');
      }
    });
  }

  // Update Due
  const updateDue = (e, assignmentId) => {
    e.preventDefault();

    post(route('assignment.updateDue', assignmentId), {
      onSuccess: () => {
        setToggleDue2(null);
        data.due_date = '';
      },
      onError: () => {
        console.log('Gagal Update Due Date')
      },
      onFinish: () => {
        console.log('selesai');
      }
    });
  }

  return (
      <AuthenticatedLayout 
          workspace={workspace}
          members={members}
          activeWorkspace={activeWorkspace}
          activeMembersStatus={activeMembersStatus}
          getWorkspaceSpaces={getWorkspaceSpaces}
      >
          <Head title="assignment"/>

          <div className="absolute top-10 right-4 md:right-8 lg:right-5">
            {flashMsg && (

                <div class="card">
                    <svg class="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                        fill-opacity="1"
                      ></path>
                    </svg>

                    <div class="icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        stroke-width="0"
                        fill="currentColor"
                        stroke="currentColor"
                        class="icon"
                      >
                        <path
                          d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                        ></path>
                      </svg>
                    </div>
                    <div class="message-text-container">
                      <p class="message-text">Success</p>
                      <p class="sub-text">{flashMsg}</p>
                    </div>
                </div>
                )}
          </div>
          
          <div className="mb-1 mt-9 md:mt-0 p-7">
            <div className="flex space-x-3">
                <div className="flex gap-2 text-slate-600 font-bold p-2 rounded-lg cursor-default">
                  <DesktopWindowsOutlinedIcon/>
                  {currentSpace[0].name}
                </div>
                <p className="p-2 ">/</p>
                <div className="flex gap-2 text-slate-600 font-bold p-2 rounded-lg cursor-default">
                  <FolderOpenOutlinedIcon/>
                  {currentProject[0].name} 
                </div>
                <p className="p-2 ">/</p>
                <div className="flex gap-2 text-slate-600 font-bold p-2 rounded-lg cursor-default">
                  <FormatListBulletedOutlinedIcon/>
                  {tasks.name}
                </div>
            </div>
          </div>
          <hr className="border-slate-400"/>
          <div className="flex justify-between mt-5 px-7">
              <div className="flex items-center gap-3">
                  <div 
                    className={listView 
                      ? "flex space-x-1 bg-sky-300 text-white p-2 rounded-lg cursor-pointer" 
                      : "flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                    }
                    onClick={() => {
                      setListView(true);
                      setGantView(false);
                    }}
                  >
                      <FormatListBulletedOutlinedIcon/>
                      <p>List</p>
                  </div>
                  <div 
                    className={gantView 
                      ? "flex space-x-1 bg-sky-300 text-white p-2 rounded-lg cursor-pointer"
                      : "flex space-x-1 hover:bg-sky-300 hover:text-white p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                    } 
                    onClick={() => {
                      setListView(false);
                      setGantView(true);
                    }}
                  >
                      <StackedBarChartOutlinedIcon/>
                      <p>Gantt</p>
                  </div>
              </div>
                  <PrimaryButton onClick={() => setAddAssignment(true)}>
                    <AddOutlinedIcon />
                    Assignment
                  </PrimaryButton>
          </div>
          

          {listView && (
            <>
              {assignments && assignments.length > 0 ? (
                Object.entries(groupAssignments).map(([status, tasks]) => (
                  <div key={status} className="mt-[50px] px-7">
                    <div className="flex flex-col space-y-5 md:flex-row items-center justify-between space-x-7 m-2 mt-5 ">
                      <div className="flex items-center space-x-6">
                        <KeyboardArrowDownIcon 
                          className="hover:bg-[#19324928] rounded-md" 
                          onClick={() => setShowAssignment(status)}
                        />
                        {checkStatus(status)}
                        
                        <PrimaryButton onClick={() => setAddAssignment(true)}>
                          <AddOutlinedIcon />
                          Assignment
                        </PrimaryButton>
                      </div>
    
                      {showAssignment === status && (
                        <div>
                          <input
                              class="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-96"
                              placeholder="Search..."
                              required=""
                              type="text"
                              onChange={(e) => SetSearchAssignment(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
    
                    {showAssignment === status && (
                      <div className="my-10 ml-6 overflow-x-auto max-h-[300px] overflow-y-auto rounded-lg shadow">
                        <table className="min-w-full table-auto divide-y divide-gray-200">
                          <thead className="bg-sky-300 hidden lg:table-header-group">
                            <tr className="border-b-4 border-gray-400 border-opacity-50">
                              <th className="p-3 text-sm font-semibold tracking-wide text-left">Name</th>
                              <th className="p-3 text-sm font-semibold tracking-wide text-left">Assignee</th>
                              <th className="p-3 text-sm font-semibold tracking-wide text-left">Due Date</th>
                              <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                              <th className="p-3 text-sm font-semibold tracking-wide text-left">Priority</th>
                              <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {tasks && tasks.length > 0 ? (
                              tasks.filter(data => {
                                if (!searchAssignment || searchAssignment.trim === '') return true;
                                const query = searchAssignment.toLowerCase();
                                return(
                                  data.name.toLowerCase().includes(query)
                                );
                              })
                              .map(assignment => (
                                currentUserStatus === 'owner' || currentUserStatus === 'admin' 
                                ? 
                                  <tr className="bg-white lg:table-row flex flex-col lg:flex-row">
                                    <td 
                                      className="p-3 flex justify-between text-gray-700 lg:min-w-[200px] whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                      data-label="Name"
                                      onMouseOver={() => setHoverAssignment(assignment)}
                                      onMouseLeave={() => setHoverAssignment(null)}
                                      onClick={(e) => {
                                        getFiles(e, assignment);
                                      }}
                                    >
                                      {editingAssignment === assignment.id ? (
                                        <input
                                          className="border border-gray-300 rounded px-2 py-1 w-full"
                                          defaultValue={editedName}
                                          onChange={(e) => setData('name', e.target.value)}
                                          onBlur={() => renameAssignment(assignment)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') renameAssignment(e, assignment);
                                            if (e.key === 'Escape') setEditingAssignment(null);
                                          }}
                                          autoFocus
                                        />
                                      ) : (
                                        <>
                                          {assignment.name}
                                          {hoverAssignment === assignment && (
                                            <DriveFileRenameOutlineIcon
                                              className="hover:bg-slate-300 rounded-full"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setEditingAssignment(assignment.id);
                                                setEditedName(assignment.name);
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </td>
                                    
                                    {assignment.status === 'Completed' ? (
                                      <td 
                                        className="p-3 text-sm font-bold text-blue-500 whitespace-nowrap" 
                                        data-label="Assign"
                                      >
                                        {checkUser(assignment.space_member_id)}
                                        
                                      </td>
                                      
                                    ) : 
                                      <td 
                                        className="p-3 text-sm font-bold text-blue-500 whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                        data-label="Assign"
                                        onClick={() => setToggleAssign2(assignment)}
                                      >
                                        {checkUser(assignment.space_member_id)}  
                                      </td>
                                    }
                                    {assignment.due_date ? (
                                      <td 
                                        className="p-3 flex justify-between text-sm text-gray-700 whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                        data-label="Due Date"
                                        onClick={() => setToggleDue2(assignment)}
                                        onMouseOver={() => setHoverDueDate(assignment)}
                                        onMouseLeave={() => setHoverDueDate(null)}
                                      >
                                        {checkDue(assignment)}
                                        {hoverDueDate === assignment && (
                                          <CloseIcon 
                                            className="hover:bg-slate-300 rounded-full"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              data.due_date = ''
                                              updateDue(e, assignment)
                                            }}
                                          /> 
                                        )}
                                      </td>
                                    ) : 
                                      <td 
                                        className="p-3 text-sm text-gray-700 whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                        data-label="Due Date"
                                        onClick={() => setToggleDue2(assignment)}
                                      >
                                        <CalendarMonthOutlinedIcon/>
                                      </td>
                                    }
                                    {assignment.status === 'Completed' ? (
                                      <td 
                                        className="p-3 text-sm whitespace-nowrap" 
                                        data-label="Status"
                                      >
                                        {checkStatus(assignment.status)}
                                      </td>
                                    ) : 
                                        <td 
                                        className="p-3 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                        data-label="Status"
                                        onClick={() => setToggleStatus(assignment)}
                                      >
                                        {checkStatus(assignment.status)}
                                      </td>
                                    }
                                    <td 
                                      className="p-3 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                      data-label="Priority"
                                      onClick={() => setTogglePriority2(assignment)}
                                    >
                                      {checkPriority(assignment.priority)}
                                    </td>
                                    <td className="p-3 text-sm whitespace-nowrap space-x-5" data-label="">
                                      <DeleteIcon 
                                        className="text-red-500 hover:bg-slate-200 rounded-full cursor-pointer"
                                        onClick={(e) => deleteAssignment(e, assignment)}
                                      />
                                      
                                    </td>
      
                                    {toggleAssign2 === assignment&& (
                                      <AssignModal2 open={toggleAssign2} onClose={() => {setToggleAssign2(null)}}>
                                          <div>
                                            <input
                                                class="input rounded-full px-5 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full"
                                                placeholder="Search..."
                                                required=""
                                                type="text"
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                          </div>
                                          <div className="p-1 mt-5 max-h-[150px] overflow-y-auto">
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
                                                  <div 
                                                    className="flex items-center space-x-2"
                                                    onClick={(e) => {
                                                      data.space_member_id = member.user_id
                                                      setToggleAssign(false);
                                                      updateAssignee(e, assignment)
                                                    }}
                                                  >
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
                                              null
                                            }
                                          </div>
                                      </AssignModal2>
                                    )}
      
                                    {toggleStatus === assignment && (
                                      <StatusModal open={toggleStatus} onClose={() => {setToggleStatus(null)}}>
                                        <div className="max-h-[150px] overflow-y-auto space-y-3">
                                          <div 
                                            className="flex items-center p-1 space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'To Do'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">To Do</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-sky-100 text-blue-500 p-1 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'In Progress'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
      
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">In Progress</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-green-100 text-green-600 p-1 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'Completed'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">Completed</p>
                                          </div>
                                        </div>
                                      </StatusModal>
                                    )}
      
                                    {togglePriority2 === assignment && (
                                      <PriorityModal2 open={togglePriority2} onClose={() => setTogglePriority2(null)}>
                                        <div className="max-h-[150px] overflow-y-auto space-y-3">
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-red-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.priority = 'High'
                                              setTogglePriority2(null);
                                              updatePriority(e, assignment)
                                            }}
                                          >
                                            <OutlinedFlagOutlinedIcon className="text-red-500"/>
                                            <p className="p-1">High</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-orange-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.priority = 'Urgent'
                                              setTogglePriority2(null);
                                              updatePriority(e, assignment)
                                            }}
                                          >
                                            <OutlinedFlagOutlinedIcon className="text-orange-500"/>
                                            <p className="p-1">Urgent</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-green-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.priority = 'Normal'
                                              setTogglePriority2(null);
                                              updatePriority(e, assignment)
                                            }}
                                          >
                                            <OutlinedFlagOutlinedIcon className="text-green-500"/>
                                            <p className="p-1">Normal</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.priority = 'Low'
                                              setTogglePriority2(null);
                                              updatePriority(e, assignment)
                                            }}
                                          >
                                            <OutlinedFlagOutlinedIcon/>
                                            <p className="p-1">Low</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.priority = ''
                                              setTogglePriority2(null);
                                              updatePriority(e, assignment)
                                            }}
                                          >
                                            <NotInterestedIcon/>
                                            <p className="p-1">Clear</p>
                                          </div>
                                        </div>
                                      </PriorityModal2>
                                    )}
      
                                    {toggledue2 === assignment && (
                                      <div className="fixed z-50 inset-0 flex justify-center items-center transition-colors ">
                                          <DatePicker
                                            selected={assignment.due_date}
                                            onChange={(date, e) => {
                                              setSelectedDate(date);
                                              const year = date.getFullYear();
                                              const month = String(date.getMonth() + 1).padStart(2, '0');
                                              const day = String(date.getDate()).padStart(2, '0');
                                              data.due_date = `${year}-${month}-${day}`
                                              updateDue(e, assignment)
                                            }}
                                            inline
                                            minDate={new Date()}
                                          />
                                      </div>
                                    )}
                                  </tr>
                                : 
                                  <tr className="bg-white lg:table-row flex flex-col lg:flex-row">
                                    <td 
                                      className="p-3 flex justify-between text-gray-700 lg:min-w-[200px] whitespace-nowrap cursor-pointer hover:bg-slate-100" 
                                      data-label="Name"
                                      onClick={(e) => {
                                        getFiles(e, assignment);
                                      }}
                                    >
                                      {editingAssignment === assignment.id ? (
                                        <input
                                          className="border border-gray-300 rounded px-2 py-1 w-full"
                                          defaultValue={editedName}
                                          onChange={(e) => setData('name', e.target.value)}
                                          onBlur={() => renameAssignment(assignment)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') renameAssignment(e, assignment);
                                            if (e.key === 'Escape') setEditingAssignment(null);
                                          }}
                                          autoFocus
                                        />
                                      ) : (
                                        <>
                                          {assignment.name}
                                        </>
                                      )}
                                    </td>
                                    
                                    {assignment.status === 'Completed' ? (
                                      <td 
                                        className="p-3 text-sm font-bold text-blue-500 whitespace-nowrap" 
                                        data-label="Assign"
                                      >
                                        {checkUser(assignment.space_member_id)}
                                        
                                      </td>
                                    ) : 
                                      <td 
                                        className="relative p-3 text-sm font-bold text-blue-500 whitespace-nowrap" 
                                        data-label="Assign"
                                      >
                                        {checkUser(assignment.space_member_id)} 

                                        {toggleAssign2 === assignment&& (
                                      <AssignModal2 open={toggleAssign2} onClose={() => {setToggleAssign2(null)}}>
                                          <div>
                                            <input
                                                class="input rounded-full px-5 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full"
                                                placeholder="Search..."
                                                required=""
                                                type="text"
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                          </div>
                                          <div className="p-1 mt-5 max-h-[150px] overflow-y-auto">
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
                                                  <div 
                                                    className="flex items-center space-x-2"
                                                    onClick={(e) => {
                                                      data.space_member_id = member.user_id
                                                      setToggleAssign(false);
                                                      updateAssignee(e, assignment)
                                                    }}
                                                  >
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
                                              null
                                            }
                                          </div>
                                      </AssignModal2>
                                    )} 
                                      </td>
                                    }
                                    {assignment.due_date ? (
                                      <td 
                                        className="p-3 flex justify-between text-sm text-gray-700 whitespace-nowrap" 
                                        data-label="Due Date"
                                      >
                                        {checkDue(assignment)}
                                      </td>
                                    ) : 
                                      <td 
                                        className="p-3 text-sm text-gray-700 whitespace-nowrap" 
                                        data-label="Due Date"
                                        onClick={() => setToggleDue2(assignment)}
                                      >
                                        <CalendarMonthOutlinedIcon/>
                                      </td>
                                    }
                                    <td 
                                      className="relative p-3 text-sm whitespace-nowrap" 
                                      data-label="Status"
                                    >
                                      {checkStatus(assignment.status)}

                                       {toggleStatus === assignment && (
                                      <StatusModal open={toggleStatus} onClose={() => {setToggleStatus(null)}}>
                                        <div className="max-h-[150px] overflow-y-auto space-y-3">
                                          <div 
                                            className="flex items-center p-1 space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'To Do'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">To Do</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-sky-100 text-blue-500 p-1 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'In Progress'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
      
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">In Progress</p>
                                          </div>
                                          <div 
                                            className="flex items-center space-x-2 hover:bg-green-100 text-green-600 p-1 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                            onClick={(e) => {
                                              data.status = 'Completed'
                                              setToggleStatus(null);
                                              updateStatus(e, assignment)
                                            }}
                                          >
                                            <RadioButtonCheckedOutlinedIcon/>
                                            <p className="p-1">Completed</p>
                                          </div>
                                        </div>
                                      </StatusModal>
                                    )}
                                    </td>
                                    <td 
                                      className="p-3 text-sm whitespace-nowrap" 
                                      data-label="Priority"
                                    >
                                      {checkPriority(assignment.priority)}
                                        {togglePriority2 === assignment && (
                                          <PriorityModal2 open={togglePriority2} onClose={() => setTogglePriority2(null)}>
                                            <div className="max-h-[150px] overflow-y-auto space-y-3">
                                              <div 
                                                className="flex items-center space-x-2 hover:bg-red-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                                onClick={(e) => {
                                                  data.priority = 'High'
                                                  setTogglePriority2(null);
                                                  updatePriority(e, assignment)
                                                }}
                                              >
                                                <OutlinedFlagOutlinedIcon className="text-red-500"/>
                                                <p className="p-1">High</p>
                                              </div>
                                              <div 
                                                className="flex items-center space-x-2 hover:bg-orange-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                                onClick={(e) => {
                                                  data.priority = 'Urgent'
                                                  setTogglePriority2(null);
                                                  updatePriority(e, assignment)
                                                }}
                                              >
                                                <OutlinedFlagOutlinedIcon className="text-orange-500"/>
                                                <p className="p-1">Urgent</p>
                                              </div>
                                              <div 
                                                className="flex items-center space-x-2 hover:bg-green-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                                onClick={(e) => {
                                                  data.priority = 'Normal'
                                                  setTogglePriority2(null);
                                                  updatePriority(e, assignment)
                                                }}
                                              >
                                                <OutlinedFlagOutlinedIcon className="text-green-500"/>
                                                <p className="p-1">Normal</p>
                                              </div>
                                              <div 
                                                className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                                onClick={(e) => {
                                                  data.priority = 'Low'
                                                  setTogglePriority2(null);
                                                  updatePriority(e, assignment)
                                                }}
                                              >
                                                <OutlinedFlagOutlinedIcon/>
                                                <p className="p-1">Low</p>
                                              </div>
                                              <div 
                                                className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                                                onClick={(e) => {
                                                  data.priority = ''
                                                  setTogglePriority2(null);
                                                  updatePriority(e, assignment)
                                                }}
                                              >
                                                <NotInterestedIcon/>
                                                <p className="p-1">Clear</p>
                                              </div>
                                            </div>
                                          </PriorityModal2>
                                        )}
                                    </td>
                                    
      
                                    
      
                                   
      
                                   
      
                                    {toggledue2 === assignment && (
                                      <div className="absolute right-[380px] z-50 mt-2">
                                          <DatePicker
                                            selected={assignment.due_date}
                                            onChange={(date, e) => {
                                              setSelectedDate(date);
                                              const year = date.getFullYear();
                                              const month = String(date.getMonth() + 1).padStart(2, '0');
                                              const day = String(date.getDate()).padStart(2, '0');
                                              data.due_date = `${year}-${month}-${day}`
                                              updateDue(e, assignment)
                                            }}
                                            inline
                                            minDate={new Date()}
                                          />
                                      </div>
                                    )}
                                  </tr>
                              ))
                            ) : 
                              null
                            }
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
                
              ) :
                <></>
              }
            </>
          )}

          {gantView && (
            <>
              <div className="m-8 px-2">
                <Willow>
                  <Gantt 
                    tasks={mappedAssignments} 
                    links={links} 
                    scales={scales} 
                    readonly={readonly}
                  />
                </Willow>
              </div>  
            </>
          )}

         

          <AssignmentModal 
              open={addAssignment} 
              onClose={() => {
                clear()
              }}
            >
              <CloseIcon 
                  className='absolute right-3 top-4 cursor-pointer hover:opacity-50' 
                  onClick={() => {
                    clear()
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
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && <p className="error text-red-500">{errors.name}</p>}
                </div>
                
                <div className="mt-9">
                  <div className="w-full">
                    <div className="flex justify-around">
                      {/* Assign Member */}
                      {member ? (
                        <div 
                          className="flex relative flex-col items-center rounded-lg cursor-pointer mt-[-13px]"
                          onClick={() => {
                            setMember(null);
                            setData('space_member_id', '');
                          }}
                        >
                          <CloseIcon className="absolute text-red-600 bg-white p-1 rounded-full top-2 left-6"/>
                          <img src={
                                member.user.photo instanceof File 
                                ? URL.createObjectURL( member.user.photo) 
                                :  member.user.photo
                                ? `/storage/${ member.user.photo}` 
                                : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                            }  alt="Profile" width="40" className='my-5 rounded-full'/> 
                        </div>
                      ) : 
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
                      }

                      {/* due date */}
                      <div className="relative">
                        {selectedDate ? (
                          <div 
                            className="p-3 rounded-lg cursor-pointer flex space-x-2 hover:text-slate-600"
                            onClick={() => setToggleDue(true)}
                          >
                            <CalendarMonthOutlinedIcon/>
                            <p className="mt-[2px]">{selectedDate.toLocaleDateString()}</p>
                          </div>
                        ) : 
                          <div 
                            className="hover:text-orange-500 transition-colors duration-200 p-3 rounded-lg cursor-pointer flex flex-col items-center"
                            onClick={() => setToggleDue(true)}
                            onMouseEnter={() => setDueDateHover(true)}
                            onMouseLeave={() => setDueDateHover(false)}
                          >
                            <CalendarMonthOutlinedIcon />
                            {dueDateHover && (
                              <p className="bg-orange-100 p-2 text-orange-500 text-bold mt-2 absolute w-[120px] text-center top-[35px] rounded-lg">
                                Set Due Date
                              </p>
                            )}
                          </div>
                        }
                        
                        {toggledue && (
                          <div className="absolute z-50 mt-2">
                            <DatePicker
                              selected={selectedDate}
                              onChange={(date) => {
                                setSelectedDate(date);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                setData('due_date', `${year}-${month}-${day}`)
                                setToggleDue(false);
                              }}
                              inline
                              minDate={new Date()}
                            />
                          </div>
                        )}
                      </div>

                      {/* priority */}
                      {priority ? (
                        priority === 'High' ? (
                          <div 
                            className="flex items-center hover:text-red-600 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                            onClick={() => setTogglePriority(true)}
                          >
                            <OutlinedFlagOutlinedIcon className="text-red-500"/>
                            <p className="p-1">High</p>
                          </div>
                        ) : priority === 'Urgent' ? (
                          <div 
                            className="flex items-center hover:text-orange-500 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                            onClick={() => setTogglePriority(true)}
                          >
                            <OutlinedFlagOutlinedIcon className="text-orange-500"/>
                            <p className="p-1">Urgent</p>
                          </div>
                        ) : priority === 'Normal' ? (
                          <div 
                            className="flex items-center hover:text-green-500 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                            onClick={() => setTogglePriority(true)}
                          >
                            <OutlinedFlagOutlinedIcon className="text-green-500"/>
                            <p className="p-1">Normal</p>
                          </div>
                        ) : priority === 'Low' ? (
                          <div 
                            className="flex items-center p-3 rounded-lg cursor-pointer"
                            onClick={() => setTogglePriority(true)}
                          >
                            <OutlinedFlagOutlinedIcon/>
                            <p className="p-1">Low</p>
                          </div>
                        ) : null
                      ) : (
                        <div 
                          className="hover:text-red-600 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
                          onMouseEnter={() => setPriorityHover(true)}
                          onMouseLeave={() => setPriorityHover(false)}
                          onClick={() => setTogglePriority(true)}
                        >
                          <OutlinedFlagOutlinedIcon />
                          {priorityHover && (
                            <p className="bg-red-100 p-2 text-red-500 text-bold mt-2 absolute top-[300px] right-[70px] rounded-lg">
                              Set Priority
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex justify-end mt-5'>
                  <PrimaryButton onClick={(e) => createAssignment(e)}>
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
                          <div 
                            className="flex items-center space-x-2"
                            onClick={() => {
                              setMember(member);
                              setData('space_member_id', member.user_id)
                              setToggleAssign(false);
                            }}
                          >
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
                      null
                    }
                  </div>

                </AssignModal>

                <PriorityModal open={togglePriority} onClose={() => setTogglePriority(false)}>
                    <div className="max-h-[150px] overflow-y-auto space-y-3">
                      <div 
                        className="flex items-center space-x-2 hover:bg-red-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                        onClick={() => {
                          setPriority('High');
                          setData('priority', 'High')
                          setTogglePriority(false);
                        }}
                      >
                        <OutlinedFlagOutlinedIcon className="text-red-500"/>
                        <p className="p-1">High</p>
                      </div>
                      <div 
                        className="flex items-center space-x-2 hover:bg-orange-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                        onClick={() => {
                          setPriority('Urgent');
                          setData('priority', 'Urgent');
                          setTogglePriority(false);
                        }}
                      >
                        <OutlinedFlagOutlinedIcon className="text-orange-500"/>
                        <p className="p-1">Urgent</p>
                      </div>
                      <div 
                        className="flex items-center space-x-2 hover:bg-green-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                        onClick={() => {
                          setPriority('Normal');
                          setData('priority', 'Normal')
                          setTogglePriority(false);
                        }}
                      >
                        <OutlinedFlagOutlinedIcon className="text-green-500"/>
                        <p className="p-1">Normal</p>
                      </div>
                      <div 
                        className="flex items-center space-x-2 hover:bg-slate-100 transition-colors duration-150 cursor-pointer w-full rounded-lg"
                        onClick={() => {
                          setPriority('Low');
                          setData('priority', 'Low')
                          setTogglePriority(false);
                        }}
                      >
                        <OutlinedFlagOutlinedIcon/>
                        <p className="p-1">Low</p>
                      </div>
                    </div>
                </PriorityModal>

               
              </form>
          </AssignmentModal>

        <DetailModal open={detailToggle} onClose={() => setDetailToggle(false)}>
          {assignmentData && (
            <>
              <h1 className="text-2xl font-bold mb-4">{assignmentData.name}</h1>
              <div className="flex gap-4 flex-col md:flex-row">
                {/* Left Side */}
                <div className="p-6 space-y-6 basis-2/3 bg-white border rounded shadow">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold">Status</p>
                      <p>{checkStatus(assignmentData.status) || '-'}</p>
                      <p className="font-semibold mt-4">Due Date</p>
                      <p>{assignmentData.due_date || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Assignee</p>
                      <p>{checkUser(assignmentData.space_member_id) || '-'}</p>
                      <p className="font-semibold mt-4">Priority</p>
                      <p>{checkPriority(assignmentData.priority) || '-'}</p>
                      
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <form 
                  className="p-6 basis-2/3 bg-white border rounded shadow space-y-4" 
                  encType="multipart/form-data"
                >
                  <div>
                    <p className="font-semibold text-lg">Upload File</p>
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer inline-block px-4 py-1 bg-blue-50 text-blue-500 font-semibold rounded-full hover:bg-blue-100"
                    >
                      Upload File
                    </label>
                    <input
                      id="fileUpload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        data.file = e.target.files;
                        data.assignment_id = assignmentData.id;
                        uploadFiles(e, assignmentData);
                      }}
                    />
                    <div className="space-y-3 mt-3">
                      <p className="font-semibold">Uploaded Files:</p>
                      <ul className="flex flex-wrap gap-3 text-sm max-h-[200px] overflow-y-auto">
                        {files[assignmentData.id] && files[assignmentData.id].length > 0 ? (
                          files[assignmentData.id].map((file, index) => (
                            <div className="flex mt-3">
                              {checkFiles(file, index)}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">Belum ada file yang diunggah.</p>
                        )}
                          
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </DetailModal>
      </AuthenticatedLayout>
  )
}