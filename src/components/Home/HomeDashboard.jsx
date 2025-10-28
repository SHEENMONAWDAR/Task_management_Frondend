import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";
import { CheckCircle, } from "lucide-react";
import { PiClockCountdown } from "react-icons/pi";
import { CiCircleAlert } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import proimg from "../../assets/Profile.jpg";
import { LuFileText } from "react-icons/lu";
import { BASE_URL } from "../../config";
import CombinedProgressCircle from "../Charts/CombinedProgressCircle";
import WaveProgressChart from "../Charts/WaveProgressChart";

const HomeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskstatus, setTaskstatus] = useState([])
  const [monthlyData, setMonthlyData] = useState([]);
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate();

  const fetchtaskStatus = async () => {
    try {
      const res = await API.get(`/tasks/taskstatus/${userId}`)
      setTaskstatus(res.data || [])
    } catch (error) {
      console.error("Failed to fetch status:", err);
    }
  }

  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const res = await API.get(`/projects/userprojects/${userId}`);
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    const fetchMonthly = async () => {
      try {
        const res = await API.post(`/taskmonthlystatus/${userId}`, {});
        setMonthlyData(res.data || []);
      } catch (err) {
        console.error("Error fetching monthly progress:", err);
      }
    };
    fetchMonthly()
    fetchProjects();
    fetchtaskStatus();
  }, []);

  // derived stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.project_status === "completed").length;
  const inProgressProjects = projects.filter((p) => p.project_status === "In Progress").length;
  const overdueProjects = projects.filter(
    (p) => new Date(p.due_date) < new Date() && p.project_status !== "Completed"
  ).length;

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block fixed h-full w-64 bg-white shadow-md ">
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
      <div className="flex-1 flex flex-col md:ml-64 transition-all space-y-3 ">
        <Header title="Home Dashboard" setSidebarOpen={setSidebarOpen} />

        {/* Status Card Section */}
        <div className="px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-15">
          {/* Total Projects */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3">
            <LuFileText size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h3>
            <p className="text-gray-600 text-4xl font-bold">{totalProjects}</p>
          </div>

          {/* Project Completed */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3">
            <CheckCircle size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Completed</h3>
            <p className="text-gray-600 text-4xl font-bold">{completedProjects}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl shadow-md border items-start border-gray-200 hover:shadow-lg transition  p-5 space-y-3">
            <PiClockCountdown size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">In Progress</h3>
            <p className="text-gray-600 text-4xl font-bold">{inProgressProjects}</p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition  p-5 space-y-3">
            <CiCircleAlert size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Overdue</h3>
            <p className="text-gray-600 text-4xl font-bold">{overdueProjects}</p>
          </div>
        </div>



        <div className="px-8 py-1 flex items-center justify-between">
          <div className="font-bold text-3xl">My Projects</div>
          <div className="flex gap-2">
            <div className="bg-white text-md font-bold rounded-md px-3 py-3"><button onClick={() => navigate("/projectdashboard")}>All Projects</button></div>
            <div className="bg-gray-400 rounded-md text-white px-3 py-3">Grid</div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="px-8 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.slice(0, 3).map((project, index) => (
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
                      Deadline: {project.project_due_date
                        ? new Date(project.project_due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric"
                        })
                        : "No due date"}
                    </p>

                  </div>
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <BsThreeDots className="text-gray-600" />
                    </button>
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
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Team Members
                  </h2>


                  <div className="flex justify-between items-center mt-3">
                    <div className="flex -space-x-3">
                      {project.users && project.users.length > 0 ? (
                        project.users.slice(0, 3).map((user) => (
                          <img
                            key={user.id}
                            src={`${BASE_URL}/${user.image}`}
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

              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-3">
              No projects available
            </p>
          )}
        </div>
        <div className="px-6 py-6 grid grid-cols-12 gap-6">
          {/* Chart Section */}
          <div className="col-span-12 md:col-span-8 p-6 bg-white rounded-3xl shadow-lg">
            <WaveProgressChart monthlyData={monthlyData}/>
          </div>

          {/* Progress Circle Section */}
          <div className="col-span-12 md:col-span-4 bg-white shadow-lg rounded-3xl p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="mb- text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">My Progress</h2>
              <p className="text-gray-500 text-sm">Your task completion rate</p>
            </div>

            {/* Circle */}
            <div className="flex justify-center my-4">
              {taskstatus && taskstatus.length > 0 ? (
                <CombinedProgressCircle
                  completed={parseFloat(taskstatus[0].completed_percentage)}
                  inProgress={parseFloat(taskstatus[0].inprogress_percentage)}
                  others={parseFloat(taskstatus[0].others_percentage)}
                />
              ) : (
                <p className="text-gray-500">No task data</p>
              )}
            </div>

            {/* Percentages */}
            {taskstatus && taskstatus.length > 0 && (
              <div className="grid grid-cols-3 text-center gap-4">
                {/* Completed */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round(parseFloat(taskstatus[0].completed_percentage))}%
                  </span>
                  <span className="text-green-400 font-medium">Completed</span>
                </div>

                {/* In Progress */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-yellow-500">
                    {Math.round(parseFloat(taskstatus[0].inprogress_percentage))}%
                  </span>
                  <span className="text-yellow-400 font-medium">In Progress</span>
                </div>

                {/* Others */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {Math.round(parseFloat(taskstatus[0].others_percentage))}%
                  </span>
                  <span className="text-gray-400 font-medium">Others</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default HomeDashboard;
