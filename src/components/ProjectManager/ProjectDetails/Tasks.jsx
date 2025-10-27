import React from "react";
import { CiCalendar } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import proimg from "../../../assets/Profile.jpg";
import { BASE_URL } from "../../../config";

const TaskItem = ({ task, getDueText }) => {
    const borderColor =
        task.status === "in-progress"
            ? "border-yellow-500"
            : task.status === "done"
                ? "border-green-500"
                : task.status === "todo"
                    ? "border-orange-300"
                    : "border-gray-300";

    const pillBg =
        task.status === "completed"
            ? "bg-green-100"
            : task.status === "in-progress"
                ? "bg-yellow-100"
                : "bg-gray-100";


    return (
        <div className=" bg-gray-100 gap-5 p-2 rounded">
            <div className={` border-l-4 ${borderColor} pl-2`}>
                <div className="font-semibold">{task.title}</div>
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <div className={`p-1 rounded-md ${pillBg}`}>
                                <CiCalendar />
                            </div>
                            {getDueText(task.due_date)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded flex items-center text-gray-500`}><GoDotFill /> {task.status}</div>
                    </div>

                    <div className="flex">
                        <div className="flex -space-x-3">
                            {task.users && task.users.length > 0 ? (
                                task.users.slice(0, 3).map((user) => (
                                    <img
                                        key={user.id}
                                        src={user.image ? `${BASE_URL}/${user.image}` : ""}
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
                    </div>

                </div>
            </div>
        </div>
    );
};

// Tasks component
const Tasks = ({ tasks }) => {
    const getDueText = (dueDate) => {
        if (!dueDate) return "N/A";

        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;

        if (diffTime < 0) return "Overdue";

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Due today";
        if (diffDays === 1) return "Due in 1 day";
        if (diffDays < 7) return `Due in ${diffDays} days`;
        if (diffDays < 30)
            return `Due in ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? "s" : ""}`;
        return `Due in ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? "s" : ""}`;
    };

    return (
        <div className="border border-gray-200 rounded-md p-5 bg-white">
            <div className="mb-5">
                <div className="text-2xl font-bold">Project Tasks</div>
                <div className="text-sm text-gray-400">Manage and track project tasks</div>
            </div>
            <div className="overflow-y-auto max-h-96 space-y-2">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => <TaskItem key={task.task_id} task={task} getDueText={getDueText} />)
                ) : (
                    <div className="text-gray-500 text-sm">No upcoming tasks found.</div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
