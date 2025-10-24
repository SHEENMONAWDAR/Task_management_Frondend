import React, { useEffect, useState } from "react";
import API from "../../api";
import { BASE_URL } from "../../config";
import proimg from "../../assets/Profile.jpg";
import EditTaskModal from "../Tasks/EditTaskModal"; // ✅ import edit modal
import { LuFileText } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";

const TasksListLayout = ({ onAddTask, refreshKey }) => {
    const [todoTasks, setTodoTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 For edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const userId = localStorage.getItem("userid")

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const [todoRes, progressRes, doneRes] = await Promise.all([
                API.get(`/tasks/mytodo/${userId}`),
                API.get(`/tasks/myinprogress/${userId}`),
                API.get(`/tasks/mydone/${userId}`),
            ]);
            setTodoTasks(todoRes.data);
            setInProgressTasks(progressRes.data);
            setDoneTasks(doneRes.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshKey]);

    const handleEdit = (taskId) => {
        setSelectedTaskId(taskId);
        setShowEditModal(true);
    };

    const renderTaskCard = (task) => (
        <div
            key={task.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 space-y-3"
        >
            <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg text-gray-800">{task.title}</h2>
                <span
                    className={`text-xs font-medium px-2 py-1 rounded ${task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-600"
                        }`}
                >
                    {task.priority || "low"}
                </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
            <div className="flex">
                <div><span className="text-black text-md mr-2">Project Name:</span><span className="text-md font-bold text-blue-600">{task.project_name}</span></div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Project progress</span>
                <span className="font-medium text-gray-800">
                    {task.task_progress}%
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${task.task_progress || 0}%` }}
                ></div>
            </div>
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit"

                    }) : "—"}
                </div>
                <div className="flex items-center gap-1">
                    <div><FiMessageSquare /></div><div className="">{task.comment_count}</div>
                </div>
            </div>


            <div className="flex justify-between items-center mt-3">
                <div className="flex -space-x-3">
                    {task.users && task.users.length > 0 ? (
                        [...new Map(task.users.map(u => [u.id, u])).values()].slice(0, 3).map((user) => (
                            <img
                                key={user.id}
                                src={`${BASE_URL}/${user.image}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                alt={user.name}
                            />
                        ))
                    ) : (
                        <img
                            src={proimg}
                            className="w-10 h-10 rounded-full border-2 border-white"
                            alt="Default"
                        />
                    )}
                </div>

                {/* 🔹 Edit button */}
                <button
                    onClick={() => handleEdit(task.id)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                    Edit
                </button>
            </div>
        </div>
    );

    if (loading)
        return <div className="text-center text-gray-500 py-10">Loading tasks...</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {/* To Do Column */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh] overflow-hidden">
                    {/* Top Header */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">To Do</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {todoTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {todoTasks.length ? (
                            <div className="space-y-4">{todoTasks.map(renderTaskCard)}</div>
                        ) : (
                            <p className="text-gray-500 text-sm">No To Do tasks</p>
                        )}
                    </div>

                    {/* Bottom Footer */}
                    <div className="p-5 border-t bg-white sticky bottom-0 z-10">
                        <button
                            onClick={onAddTask}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>

                {/*In Progress Column*/}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh] overflow-hidden">
                    {/* Top Header */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">In Progress</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {inProgressTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {inProgressTasks.length ? (
                            <div className="space-y-4">
                                {inProgressTasks.map(renderTaskCard)}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No In Progress tasks</p>
                        )}
                    </div>

                    {/* Bottom Footer */}
                    <div className="p-5 border-t bg-white sticky bottom-0 z-10">
                        <button
                            onClick={onAddTask}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>
                {/* Done Column */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh] overflow-hidden">
                    {/* Top Header */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">Done</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {doneTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {doneTasks.length ? (
                            <div className="space-y-4">{doneTasks.map(renderTaskCard)}</div>
                        ) : (
                            <p className="text-gray-500 text-sm">No Done tasks</p>
                        )}
                    </div>

                    {/* Bottom Footer */}
                    <div className="p-5 border-t bg-white sticky bottom-0 z-10">
                        <button
                            onClick={onAddTask}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 Edit Modal */}
            {showEditModal && (
                <EditTaskModal
                    taskId={selectedTaskId}
                    onClose={() => setShowEditModal(false)}
                    onTaskUpdated={() => {
                        setShowEditModal(false);
                        fetchTasks();
                    }}
                />
            )}
        </div>
    );
};

export default TasksListLayout;
