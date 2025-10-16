import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";
import proimg from "../../assets/Profile1.jpg";
import { BASE_URL } from "../../config";
import { TfiEmail } from "react-icons/tfi";
import { LuPhoneCall } from "react-icons/lu";

const ContactsPage = () => {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block fixed h-full w-64 bg-white shadow-md z-30">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Sidebar (mobile) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-40 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all">
        <Header title="Contacts" setSidebarOpen={setSidebarOpen} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20 px-5">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3"
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={user.image ? `${BASE_URL}/${user.image}` : proimg}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="mt-3 text-lg font-semibold text-gray-800">
                    {user.name}
                  </h1>
                  <p className="text-gray-500 text-xs capitalize">
                    {user.role || "Viewer"}
                  </p>
                  <div className="text-center text-gray-600 text-sm mt-2">
                    <p className="flex items-center gap-2"><TfiEmail/>{user.email}</p>
                    <p className="flex items-center gap-2"><LuPhoneCall/>{user.phone}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
