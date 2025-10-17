import React, { useEffect, useState } from "react";
import API from "../../api";
import { BASE_URL } from "../../config";
import proimg from '../../assets/Profile.jpg'

const TasksListLayout = ({ onAddTask, refreshKey }) => {
    const [todoTasks, setTodoTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const [todoRes, progressRes, doneRes] = await Promise.all([
                API.get("/tasks/todo"),
                API.get("/tasks/inprogress"),
                API.get("/tasks/done"),
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
            <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-800">
                    {task.project_progress}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${task.project_progress || 0}%` }}
                ></div>
            </div>
            <div className="text-sm text-gray-500">
                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
            </div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={task.assigned_user_image ? `${BASE_URL}/${task.assigned_user_image}` : proimg}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
        </div>
    );

    if (loading)
        return <div className="text-center text-gray-500 py-10">Loading tasks...</div>;

    return (
        <div>
            {/* Header Row */}


            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 rounded-md">
                {/* To Do */}
                <div className="bg-white  shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh]">

                    {/* Header (fixed at top) */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">To Do</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {todoTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {todoTasks.length ? (
                            <div className="space-y-4">{todoTasks.map(renderTaskCard)}</div>
                        ) : (
                            <p className="text-gray-500 text-sm">No To Do tasks</p>
                        )}
                    </div>

                    {/* Footer (fixed at bottom) */}
                    <div className="p-5 border-t bg-white sticky bottom-0 z-10">
                        <button
                            onClick={onAddTask}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>


                {/* In Progress */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh]">

                    {/* Header (fixed at top) */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">IN Progress</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {inProgressTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {inProgressTasks.length ? (
                            <div className="space-y-4">{inProgressTasks.map(renderTaskCard)}</div>
                        ) : (
                            <p className="text-gray-500 text-sm">No IN Progress tasks</p>
                        )}
                    </div>

                    {/* Footer (fixed at bottom) */}
                    <div className="p-5 border-t bg-white sticky bottom-0 z-10">
                        <button
                            onClick={onAddTask}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>


                {/* Done */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col h-[90vh]">

                    {/* Header (fixed at top) */}
                    <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-800">Done</h2>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">
                                {doneTasks[0]?.total_tasks || 0}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {doneTasks.length ? (
                            <div className="space-y-4">{doneTasks.map(renderTaskCard)}</div>
                        ) : (
                            <p className="text-gray-500 text-sm">No Done tasks</p>
                        )}
                    </div>

                    {/* Footer (fixed at bottom) */}
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
        </div>
    );
};

export default TasksListLayout;
