import React from 'react';
import { CiCalendar } from "react-icons/ci";


const Overview = ({ project, tasks }) => {
    const getDueText = (dueDate) => {
        if (!dueDate) return 'N/A';

        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now; // difference in milliseconds

        if (diffTime < 0) return 'Overdue';

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms to days

        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due in 1 day';
        if (diffDays < 7) return `Due in ${diffDays} days`;
        if (diffDays < 30) return `Due in ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
        return `Due in ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''}`;
    };

    return (
        <div>
            {/* Project Description */}
            <div className="border border-gray-200 rounded-md p-5 bg-white">
                <div className="mb-5">
                    <div className="text-2xl font-bold">Project Description</div>
                    <div className="text-sm text-gray-400">Detailed information about the project</div>
                </div>
                <div className="text-lg">
                    Project Title:{' '}
                    <span className="text-gray-600 text-md">{project?.project_name}</span>
                </div>
                <div className=" text-lg mt-2">
                    Project Description:{' '}
                    <span className="text-gray-600 text-md">{project?.project_description}</span>
                </div>
            </div>

            {/* Recent Activity + Milestones */}
            <div className="grid grid-cols-12 mt-8 gap-5">
                {/* Recent Activity */}
                <div className="col-span-12 md:col-span-6 border border-gray-200 rounded-md p-5 bg-white">
                    <div className="mb-5">
                        <div className="text-2xl font-bold">Recent Activity</div>
                        <div className="text-sm text-gray-400">Latest updates and changes</div>
                    </div>
                    <div className="text-gray-600 text-sm">No recent activity yet.</div>
                </div>

                {/* Upcoming Milestones */}
                <div className="col-span-12 md:col-span-6 border border-gray-200 rounded-md p-5 bg-white">
                    <div className="mb-5">
                        <div className="text-2xl font-bold">Upcoming Milestones</div>
                        <div className="text-sm text-gray-400 mb-3">Important project deadlines</div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div
                                    key={task.task_id}
                                    className="border-b border-gray-100 py-2 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-semibold">{task.title}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <div className={`p-1 rounded-md ${task.status === 'completed'
                                                ? 'bg-green-100'
                                                : task.status === 'in-progress'
                                                    ? 'bg-yellow-100 '
                                                    : 'bg-gray-100 '
                                            }`}><CiCalendar/></div>{getDueText(task.due_date)}
                                        </div>
                                    </div>
                                    <div
                                        className={`text-xs px-2 py-1 rounded ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-600'
                                                : task.status === 'in-progress'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {task.status}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">No upcoming tasks found.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Overview;
