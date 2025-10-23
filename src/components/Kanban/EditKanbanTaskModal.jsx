import React, { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import Select from "react-select";
import API from "../../api";
import { BASE_URL } from "../../config";
import AddKanbanTaskMembersModal from "./AddKanbanTaskMembersModal";
import userimg from '../../assets/Profile.jpg'

export default function EditKanbanTaskModal({ taskId, onClose, onTaskUpdated }) {
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
    const [projects, setProjects] = useState([]);
    const [assignedMembers, setAssignedMembers] = useState([]);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [comments, setComments] = useState("");
    const [commentsList, setCommentsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const userId = JSON.parse(localStorage.getItem("userid"));

    // ✅ Fetch task details, projects, members, and comments
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, taskRes, memberRes, commentRes] = await Promise.all([
                    API.get("/projects"),
                    API.get(`/tasks/${taskId}`),
                    API.get(`/taskmembers/${taskId}`),
                    API.get(`/comments/${taskId}`), // ✅ Fetch comments for this task
                ]);

                setProjects(projRes.data);
                const task = taskRes.data;
                setForm({
                    title: task.title,
                    description: task.description,
                    Project_types: task.Project_types || "",
                    status: task.status,
                    project_id: task.project_id,
                    priority: task.priority || "low",
                    parent_task_id: task.parent_task_id || "",
                    due_date: task.due_date ? task.due_date.split("T")[0] : "",
                    Attachments: null,
                    existingAttachment: task.Attachments || null
                });

                setAssignedMembers(memberRes.data || []);
                setCommentsList(commentRes?.data?.data || []);
            } catch (err) {
                console.error("❌ Error loading task:", err);
            }
        };

        fetchData();
    }, [taskId]);

    // ✅ Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, Attachments: e.target.files[0] }));
    };

    // ✅ Create comment and refresh list
    const handleCommentCreate = async () => {
        if (!comments.trim()) return;
        try {
            await API.post("/comments", {
                task_id: taskId,
                user_id: userId,
                content: comments,
            });
            setComments("");
            // Refresh comments list
            const res = await API.get(`/comments/${taskId}`);
            setCommentsList(res.data.data || []);
        } catch (err) {
            console.error("❌ Failed to post comment:", err);
            alert("Failed to post comment.");
        }
    };

    // ✅ Submit updated data
    const handleSubmit = async (e) => {
        e.preventDefault();
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
            formDataToSend.append("updated_by", userId);

            await API.put(`/tasks/${taskId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await API.delete(`/taskmembers/${taskId}`); // clear old members
            if (assignedMembers.length > 0) {
                await Promise.all(
                    assignedMembers.map((m) =>
                        API.post("/taskmembers", { task_id: taskId, user_id: m.id })
                    )
                );
            }

            alert("✅ Task updated successfully");
            if (onTaskUpdated) onTaskUpdated();
            onClose();
        } catch (err) {
            console.error("❌ Error updating task:", err);
            alert("Failed to update task. Check console for details.");
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
                    ✏️ Edit Task
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

                    {/* Attachment Section */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Attachment</label>

                        {/* Upload new file */}
                        <input
                            type="file"
                            name="task_attachments"
                            onChange={handleFileChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        {/* Show existing PDF with download button */}
                        {form.existingAttachment && (
                            <div className="mt-2 flex items-center justify-between bg-gray-50 border rounded-lg p-2">
                                <a
                                    href={`${BASE_URL}/${form.existingAttachment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline truncate w-[80%]"
                                >
                                    {form.existingAttachment.split("/").pop()}
                                </a>

                                <a
                                    href={`${BASE_URL}/${form.existingAttachment}`}
                                    target="_blank"
                                    download
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                                >
                                    Download
                                </a>
                            </div>
                        )}
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
                                <UserPlus size={16} /> Edit Members
                            </button>
                            <span className="text-gray-600 text-sm">
                                {assignedMembers.length} member
                                {assignedMembers.length !== 1 ? "s" : ""} assigned
                            </span>
                        </div>

                        {assignedMembers.length > 0 && (
                            <ul className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto space-y-2">
                                {assignedMembers.map((m) => (
                                    <li key={m.id} className="flex items-center gap-2 text-sm">
                                        <img
                                            src={
                                                m.image
                                                    ? `${BASE_URL}/${m.image}`
                                                    : `${userimg}`
                                            }
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

                    {/* ✅ Comments Section */}
                    <div>
                        <label className="block text-sm font-medium">Add Comment</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows="2"
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Write a comment..."
                        />
                        <button
                            type="button"
                            onClick={handleCommentCreate}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                            Post Comment
                        </button>

                        {/* ✅ Display Comments */}
                        <div className="mt-4 border-t pt-3">
                            <h3 className="text-sm font-semibold mb-2">Comments</h3>
                            {commentsList.length > 0 ? (
                                <ul className="space-y-3 max-h-40 overflow-y-auto">
                                    {commentsList.map((c) => (
                                        <li key={c.id} className="border p-2 rounded-md bg-gray-50">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <div className="flex">
                                                    <img
                                                        src={
                                                            c.image
                                                                ? `${BASE_URL}/${c.image}`
                                                                : `${userimg}`
                                                        }
                                                        alt={c.name}
                                                        className="w-6 h-6 rounded-full"
                                                    /><span>{c.name || "Unknown User"}</span>
                                                </div>
                                                <span>
                                                    {new Date(c.created_at).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}{" "}
                                                    {new Date(c.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-800">{c.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No comments yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Update Task"}
                    </button>
                </form>

                {/* Members Modal */}
                {showMembersModal && (
                    <AddKanbanTaskMembersModal
                        onClose={() => setShowMembersModal(false)}
                        selectedMembers={assignedMembers}
                        setSelectedMembers={setAssignedMembers}
                    />
                )}
            </div>
        </div>
    );
}
