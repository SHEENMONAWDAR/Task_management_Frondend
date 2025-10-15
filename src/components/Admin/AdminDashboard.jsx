import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import API from "../../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const updateUser = async (id, updates) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
      );
      await API.put(`/users/${id}`, updates);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const toggleStatus = (id, currentStatus) =>
    updateUser(id, { is_active: !currentStatus });

  const handleRoleChange = (id, newRole) =>
    updateUser(id, { role: newRole });

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
        <Header title="Admin Dashboard" setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 overflow-x-auto mt-12">

          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">{u.name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4 capitalize">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            u.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : u.role === "manager"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            u.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleStatus(u.id, u.is_active)}
                          className={`px-4 py-1 rounded-lg text-sm font-medium ${
                            u.is_active
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {u.is_active ? "Block" : "Activate"}
                        </button>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
