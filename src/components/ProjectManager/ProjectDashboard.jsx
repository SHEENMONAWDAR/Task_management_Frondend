import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";
import { BsThreeDots } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import proimg from "../../assets/Profile.jpg";
import { LuFileText } from "react-icons/lu";
import { BASE_URL } from "../../config";
import EditProjectFormModal from "./EditProjectFormModal";


const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);



    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");
            setProjects(res.data || []);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        }
    };
    useEffect(() => {
        fetchProjects();
        const handleClickOutside = () => setOpenMenuIndex(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);


    }, []);

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
                    <Header title="Project Dashboard" setSidebarOpen={setSidebarOpen} />

                    {/* Project Cards */}
                    <div className="px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-15">
                        {projects.length > 0 ? (
                            projects.map((project, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3"
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
                                            <h1 className="font-bold text-2xl">
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
                                                {project.project_due_date
                                                    ? new Date(
                                                        project.project_due_date
                                                    ).toLocaleDateString()
                                                    : "No due date"}
                                            </p>
                                        </div>
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
                                                            onClick={() => alert(`Viewing project ${project.project_name}`)}
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
                                                            onClick={() => alert(`Deleting project ${project.project_name}`)}
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
                                                            src={`${BASE_URL}/${user.image}` || proimg}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                            alt={user.name}
                                                        />
                                                    ))
                                                ) : (
                                                    <img
                                                        src={proimg}
                                                        className="w-10 h-10 rounded-full border-2 border-white"
                                                        alt="Default"
                                                    />
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
                                            <p>{project.project_budget || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Start Date</p>
                                            <p>
                                                {project.project_start_date
                                                    ? new Date(
                                                        project.project_start_date
                                                    ).toLocaleDateString()
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
            {showEditModal && (
                <EditProjectFormModal
                    project={editingProject}
                    onClose={() => setShowEditModal(false)}
                    onProjectUpdated={fetchProjects}
                />
            )}

        </>
    );
};

export default ProjectDashboard;
