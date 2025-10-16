import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import AddProjectMembersModal from "./AddProjectMembersModal";
import API from "../../api"; 
import { BASE_URL } from "../../config";

export default function AddProjectFormModal({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    budget: "",
    currency: "USD",
    priority: "Medium",
    progress: 0,
    owner_id: 1,
    owner_name: "",
    status: "active",
  });

  const [projectLogo, setProjectLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [members, setMembers] = useState([]); 
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Drag-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setProjectLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Update member role in array
  const handleRoleChange = (memberId, newRole) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, role: newRole } : m
      )
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.owner_name.trim()) {
      alert("Please fill in required fields: Project Name and Owner Name");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (projectLogo) {
        formDataToSend.append("project_logo", projectLogo);
      }

      // 1️⃣ Create the project
      const projectRes = await API.post("/projects", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const project_id = projectRes.data.project_id;

      // 2️⃣ Add members with their specific roles
      if (members.length > 0) {
        for (const member of members) {
          await API.post("/projectmembers", {
            project_id,
            user_id: member.id,
            role: member.role || "Viewer",
          });
        }
      }

      alert("✅ Project created successfully!");
      if (onProjectCreated) onProjectCreated();
      onClose();
    } catch (err) {
      console.error("❌ Error creating project:", err);
      alert("Failed to create project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-y-auto">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn my-10 max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Create New Project</h2>
          <p className="text-md text-gray-500">
            Fill in the details to create a new project.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter project name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter description"
            />
          </div>

          {/* Dates */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Budget + Currency */}
          <div className="flex gap-3">
            <div className="flex-1 w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-2 py-2"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <input
                type="number"
                step="0.01"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Owner full name"
              required
            />
          </div>

          {/* Priority & Status */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-2 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-2 py-2"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On-Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* File Uploader */}
          <div
            className={`mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("projectLogoInput").click()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover mx-auto rounded-md"
              />
            ) : (
              <p className="text-gray-600">
                Drag & drop or click to upload project logo
              </p>
            )}
            <input
              id="projectLogoInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Members
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMembersModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus size={16} /> Add Members
              </button>
              <span className="text-gray-600 text-sm">
                {members.length} member{members.length !== 1 ? "s" : ""} added
              </span>
            </div>

            {/* Member list with individual role selectors */}
            {members.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto space-y-2">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`${BASE_URL}/${m.image}`}
                        alt={m.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{m.name}</span>
                    </div>
                    <select
                      value={m.role || "Viewer"}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                      <option value="Manager">Manager</option>
                      <option value="Owner">Owner</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        {/* Add Members Modal */}
        {showMembersModal && (
          <AddProjectMembersModal
            onClose={() => setShowMembersModal(false)}
            selectedMembers={members}
            setSelectedMembers={setMembers}
          />
        )}
      </div>
    </div>
  );
}
