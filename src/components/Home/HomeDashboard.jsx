import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";
import {  CheckCircle,} from "lucide-react";
import { LuFileText } from "react-icons/lu";
import { PiClockCountdown } from "react-icons/pi";
import { CiCircleAlert } from "react-icons/ci";

const HomeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // derived stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const inProgressProjects = projects.filter((p) => p.status === "In Progress").length;
  const overdueProjects = projects.filter(
    (p) => new Date(p.due_date) < new Date() && p.status !== "Completed"
  ).length;

  return (
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
      <div className="flex-1 flex flex-col md:ml-64 transition-all space-y-3 ">
        <Header title="Home Dashboard" setSidebarOpen={setSidebarOpen} />

        {/* Status Card Section */}
        <div className="px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-15 ">
          {/* Total Projects */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3">
            <LuFileText size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h3>
            <p className="text-gray-600 text-sm">{totalProjects}</p>
          </div>

          {/* Project Completed */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3">
            <CheckCircle size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Completed</h3>
            <p className="text-gray-600 text-sm">{completedProjects}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl shadow-md border items-start border-gray-200 hover:shadow-lg transition  p-5 space-y-3">
            <PiClockCountdown size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">In Progress</h3>
            <p className="text-gray-600 text-sm">{inProgressProjects}</p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition  p-5 space-y-3">
            <CiCircleAlert size={38} className="text-blue-500 p-1 bg-blue-100 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Overdue</h3>
            <p className="text-gray-600 text-sm">{overdueProjects}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeDashboard;
