import React from "react";
import { Home, Users, BarChart, Settings, LogOut, X} from "lucide-react";
import { LuFileText } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineContacts } from "react-icons/md";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/home" },
    { name: "AdminDashboard", icon: <Home size={20} />, path: "/admindashboard" },
    { name: "Projects", icon: <LuFileText size={20} />, path: "/projectdashboard" },
    { name: "Contacts", icon: <MdOutlineContacts size={20} />, path: "/contactspage" },
    { name: "Tasks", icon: <Settings size={20} />, path: "/tasksdashboard" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <>
      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        w-64 md:translate-x-0`}
      >
        {/* Header / Branding */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold">
              M
            </div>
            <h2 className="text-lg font-bold tracking-wide">MyApp</h2>
          </div>

          {/* Close button for mobile */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu items */}
        <ul className="mt-4 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-gray-700 text-white"
                    : " hover:bg-blue-100 hover:text-blue-800"}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm  hover:bg-blue-100 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile view */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-100 md:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
