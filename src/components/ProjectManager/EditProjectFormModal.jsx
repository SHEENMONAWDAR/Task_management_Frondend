// src/components/Projects/EditProjectFormModal.jsx
import React, { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import AddProjectMembersModal from "./AddProjectMembersModal";
import API from "../../api";
import { BASE_URL } from "../../config";

export default function EditProjectFormModal({ project, onClose, onProjectUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    budget: "",
    currency: "USD",
    priority: "Medium",
    progress: 0,
    owner_name: "",
    status: "active",
  });

  const [members, setMembers] = useState([]);
  const [projectLogo, setProjectLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefill data
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.project_name || "",
        description: project.project_description || "",
        start_date: project.project_start_date
          ? project.project_start_date.split("T")[0]
          : "",
        due_date: project.project_due_date
          ? project.project_due_date.split("T")[0]
          : "",
        budget: project.project_budget || "",
        currency: project.project_currency || "USD",
        priority: project.project_priority || "Medium",
        progress: project.project_progress || 0,
        owner_name: project.project_owner_name || "",
        status: project.project_status || "active",
      });
      setPreviewUrl(
        project.project_logo ? `${BASE_URL}/uploads/${project.project_logo}` : null
      );
      setMembers(project.users || []);
    }
  }, [project]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Update member role
  const handleRoleChange = (memberId, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  // Submit updated project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (projectLogo) formDataToSend.append("project_logo", projectLogo);

      // ✅ Update project
      await API.put(`/projects/${project.project_id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Optionally update members
      for (const member of members) {
        await API.put(`/projectmembers/${project.project_id}`, {
          role: member.role || "Viewer",
        });
      }

      alert("✅ Project updated successfully!");
      if (onProjectUpdated) onProjectUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update project:", err);
      alert("Error updating project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn my-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X />
        </button>

        <h2 className="text-2xl font-semibold mb-2">Edit Project</h2>
        <p className="text-gray-500 mb-4">Modify the project details below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* File upload */}
          <div
            onClick={() => document.getElementById("editLogoInput").click()}
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-400"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover mx-auto rounded-md"
              />
            ) : (
              <p className="text-gray-600">Click or drag to upload new logo</p>
            )}
            <input
              id="editLogoInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Members</label>
            <button
              type="button"
              onClick={() => setShowMembersModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus size={16} /> Edit Members
            </button>

            {members.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md p-2 space-y-2">
                {members.map((m) => (
                  <li key={m.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={`${BASE_URL}/uploads/${m.image}`}
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

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
