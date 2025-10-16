import React, { useEffect, useState } from "react";
import { X, CheckCircle, Circle } from "lucide-react";
import API from "../../api";
import { BASE_URL } from "../../config";

export default function AddTaskMembersModal({ onClose, selectedMembers, setSelectedMembers }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Toggle member selection
  const toggleMember = (user) => {
    const exists = selectedMembers.some((m) => m.id === user.id);
    if (exists) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== user.id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-3">Add Task Members</h2>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500"
        />

        {/* User list */}
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const selected = selectedMembers.some((m) => m.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 ${
                    selected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleMember(user)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.image ? `${BASE_URL}/${user.image}` : "/default-avatar.png"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                    </div>
                  </div>
                  {selected ? (
                    <CheckCircle className="text-blue-600" size={20} />
                  ) : (
                    <Circle className="text-gray-400" size={20} />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center py-4 text-gray-500">No users found</p>
          )}
        </div>

        {/* Done button */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
