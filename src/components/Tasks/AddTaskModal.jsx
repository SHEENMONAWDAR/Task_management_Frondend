import React, { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import Select from "react-select";
import API from "../../api";
import { BASE_URL } from "../../config";
import AddTaskMembersModal from "./AddTaskMembersModal"; // We'll create a modal similar to AddProjectMembersModal

export default function AddTaskModal({ onClose, onTaskAdded }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    Project_types: "",
    Attachments: null,
    status: "todo",
    project_id: "",
    priority: "low",
    parent_task_id: "",
    due_date: "",
  });

  const userId = JSON.parse(localStorage.getItem("userid"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          API.get("/projects"),
          API.get("/users"),
        ]);
        setProjects(projRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, Attachments: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.project_id) {
      alert("Please provide a title and select a project.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "Attachments" && value) {
          formDataToSend.append("task_attachments", value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      formDataToSend.append("created_by", userId);
      formDataToSend.append(
        "assigned_to",
        JSON.stringify(assignedMembers.map((m) => m.id))
      );


      const res = await API.post("/tasks", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const taskId = res.data.taskId;

      if (assignedMembers.length > 0) {
        await Promise.all(
          assignedMembers.map((member) =>
            API.post("/taskmembers", { task_id: taskId, user_id: member.id })
          )
        );
      }

      if (onTaskAdded) onTaskAdded();
      onClose();
    } catch (err) {
      console.error("❌ Failed to create task:", err);
      alert("Failed to create task. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn my-10 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          ➕ Add New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium">Project Type</label>
            <select
              name="Project_types"
              value={form.Project_types}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Type</option>
              <option value="Figma Design System">Figma Design System</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Marketing Campaign">Marketing Campaign</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="flex gap-4">
              {["low", "medium", "high"].map((level) => (
                <label key={level} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={form.priority === level}
                    onChange={handleChange}
                  />
                  <span
                    className={
                      level === "low"
                        ? "text-green-500"
                        : level === "medium"
                        ? "text-blue-500"
                        : "text-red-500"
                    }
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium">Attachment</label>
            <input
              type="file"
              name="task_attachments"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block mb-1 font-medium">Project *</label>
            <Select
              className="w-full border rounded-md"
              options={projects.map((p) => ({
                value: p.project_id,
                label: p.project_name,
              }))}
              value={
                projects
                  .map((p) => ({
                    value: p.project_id,
                    label: p.project_name,
                  }))
                  .find((opt) => opt.value === form.project_id) || null
              }
              onChange={(selected) =>
                setForm((prev) => ({
                  ...prev,
                  project_id: selected ? selected.value : "",
                }))
              }
              placeholder="Select Project"
              isSearchable
            />
          </div>

          {/* Assigned Members */}
          <div>
            <label className="block text-sm font-medium">Assign To</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMembersModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus size={16} /> Add Members
              </button>
              <span className="text-gray-600 text-sm">
                {assignedMembers.length} member
                {assignedMembers.length !== 1 ? "s" : ""} added
              </span>
            </div>

            {assignedMembers.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto space-y-2">
                {assignedMembers.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <img
                      src={m.image ? `${BASE_URL}/${m.image}` : "/default-avatar.png"}
                      alt={m.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{m.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>

        {showMembersModal && (
          <AddTaskMembersModal
            onClose={() => setShowMembersModal(false)}
            selectedMembers={assignedMembers}
            setSelectedMembers={setAssignedMembers}
          />
        )}
      </div>
    </div>
  );
}
