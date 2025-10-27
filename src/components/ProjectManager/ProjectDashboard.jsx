import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";
import { BsThreeDots } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import proimg from "../../assets/Profile.jpg";
import { LuFileText } from "react-icons/lu";
import { BASE_URL } from "../../config";
import EditProjectFormModal from "./EditProjectFormModal";
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import { CiFilter } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";

const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [details, setDetails] = useState(null);

    // Search & Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects", {
                params: {
                    q: searchQuery || undefined,
                    status: statusFilter || undefined,
                },
            });
            setProjects(res.data || []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
        const handleClickOutside = () => setOpenMenuIndex(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [searchQuery, statusFilter]);

    return (
        <>
            <div className="flex bg-gray-100 min-h-screen relative">
                {/* Sidebar (desktop) */}
                <div className="hidden md:block fixed h-full w-64 bg-white shadow-md z-30">
                    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                </div>

                {/* Sidebar (mobile) */}
                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-40 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                </div>

                {/* Main Section */}
                <div className="flex-1 flex flex-col md:ml-64 transition-all space-y-3">
                    <Header
                        title="Project Dashboard"
                        setSidebarOpen={setSidebarOpen}
                        onProjectCreated={fetchProjects}
                    />

                    {/* Search & Filter */}
                    <div className="bg-white p-6 rounded-md shadow-md mt-15 flex flex-col md:flex-row gap-4">
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <IoSearchOutline
                                    size={20}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by project name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-2 py-2 border border-gray-300 bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>


                            <div className="">
                                <div className="relative w-full md:w-48">
                                    <CiFilter
                                        size={20}
                                        className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500"
                                    />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-2 pl-8 w-full"
                                    >
                                        <option value="">All Projects</option>
                                        <option value="on-hold">On-Hold</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>


                            </div>
                        </div>

                    </div>

                    {/* Project Cards */}
                    <div className="px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
                        {projects.length > 0 ? (
                            projects.map((project, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-md shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3"
                                >
                                    {/* Header */}
                                    <div
                                        className={`border-l-4 flex justify-between ${project.project_status === "inprogress"
                                            ? "border-yellow-500"
                                            : project.project_status === "completed"
                                                ? "border-green-500"
                                                : project.project_status === "planning"
                                                    ? "border-blue-500"
                                                    : project.project_status === "cancelled"
                                                        ? "border-orange-500"
                                                        : project.project_status === "active"
                                                            ? "border-orange-300"
                                                            : "border-gray-300"
                                            }`}
                                    >
                                        <div className="ml-2">
                                            <h1 className="font-bold text-2xl mb-1">
                                                {project.project_name}
                                            </h1>
                                            <p className="text-sm text-gray-600">
                                                {project.project_description || "No description available"}
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className={`text-xs font-semibold px-2 py-1 rounded-full capitalize inline-block ${project.project_status === "inprogress"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : project.project_status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : project.project_status === "planning"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : project.project_status === "active"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {project.project_status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Due Date */}
                                    <div className="flex justify-between items-center text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <CiCalendar />
                                            <p>
                                                Deadline:{" "}
                                                {project.project_due_date
                                                    ? new Date(project.project_due_date).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short", day: "2-digit", year: "numeric" }
                                                    )
                                                    : "No due date"}
                                            </p>
                                        </div>

                                        {/* Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                <BsThreeDots className="text-gray-600" />
                                            </button>

                                            {openMenuIndex === index && (
                                                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                    <ul className="text-sm text-gray-700">
                                                        <li
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setDetails(project);
                                                                setOpenDetailsModal(true);
                                                            }}
                                                        >
                                                            View Details
                                                        </li>
                                                        <li
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setEditingProject(project);
                                                                setShowEditModal(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </li>
                                                        <li
                                                            className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                                                            onClick={() =>
                                                                alert(`Deleting project ${project.project_name}`)
                                                            }
                                                        >
                                                            Delete
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-medium text-gray-800">
                                            {project.project_progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${project.project_progress || 0}%` }}
                                        ></div>
                                    </div>

                                    {/* Team Section */}
                                    <div className="p-4 bg-white rounded-xl shadow">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                            Team Members
                                        </h2>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex -space-x-3">
                                                {project.users && project.users.length > 0 ? (
                                                    project.users.slice(0, 3).map((user) => (
                                                        <img
                                                            key={user.id}
                                                            src={user.image ? `${BASE_URL}/${user.image}` : proimg}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                            alt={user.name}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={proimg}
                                                            className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
                                                            alt="Default"
                                                        />
                                                        <div className="text-sm mt-1">No team members</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <LuFileText className="mr-1" />
                                                <p className="text-sm">
                                                    {project.total_tasks > 0
                                                        ? `${project.total_tasks} Tasks`
                                                        : "No Tasks"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-2" />

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                                        <div>
                                            <p className="text-gray-500">Client</p>
                                            <p>{project.project_owner_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Budget</p>
                                            <p>
                                                {project.project_budget
                                                    ? Number(project.project_budget).toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        minimumFractionDigits: 0,
                                                    })
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Start Date</p>
                                            <p>
                                                {project.project_start_date
                                                    ? new Date(project.project_start_date).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short", day: "2-digit", year: "numeric" }
                                                    )
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Priority</p>
                                            <p
                                                className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${project.project_priority === "High"
                                                    ? "bg-red-100 text-red-700"
                                                    : project.project_priority === "Medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : project.project_priority === "Low"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {project.project_priority || "Normal"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center col-span-3">
                                No projects available
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditProjectFormModal
                    project={editingProject}
                    onClose={() => setShowEditModal(false)}
                    onProjectUpdated={fetchProjects}
                />
            )}
            {openDetailsModal && (
                <ProjectDetails
                    project={details}
                    onClose={() => setOpenDetailsModal(false)}
                    onProjectUpdated={fetchProjects}
                />
            )}
        </>
    );
};

export default ProjectDashboard;
