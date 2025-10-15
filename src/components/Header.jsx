import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User as UserIcon, Settings, Plus, Bell } from "lucide-react";
import API from "../api";
import AddProjectFormModal from "./ProjectManager/AddProjectFormModal";
import { BASE_URL } from "../config";

export default function Header({ setSidebarOpen, title = "Dashboard" }) {
  const [user, setUser] = useState({ name: "Admin", image: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        if (res.data) setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

    const handleAddProject = async (data) => {
    try {
      const res = await API.post("/projects", data);
      alert("Project created successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to create project");
      console.error(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-4 md:px-8 z-30 transition-all">
        {/* ☰ Sidebar toggle (mobile only) */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Title */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
          {title}
        </h1>

        {/* Profile & New Project */}
        <div className="flex items-center gap-x-5">
          <Bell />
          <div
            className="bg-blue-600 cursor-pointer px-5 py-2 rounded-md text-white inline-block"
            onClick={() => setOpenAddProjectModal(true)} 
            onSubmit={handleAddProject}
          >
            <button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border bg-gray-200 flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={`${BASE_URL}/${user.image}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-white bg-blue-900 w-full h-full flex items-center justify-center">
                    {user?.name?.[0]?.toUpperCase() || "A"}
                  </span>
                )}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.name || "dmin"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <UserIcon size={16} /> Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Settings size={16} /> Settings
                </button>

                <hr />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {openAddProjectModal && (
        <AddProjectFormModal 

        onClose={() => setOpenAddProjectModal(false)} />
      )}
    </>
  );
}
