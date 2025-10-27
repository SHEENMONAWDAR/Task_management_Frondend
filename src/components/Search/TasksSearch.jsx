import React from "react";

const TasksSearch = ({ tasks }) => {
  if (!tasks.length) {
    return (
      <div className="text-gray-500 text-sm mt-2">
        No tasks found.
      </div>
    );
  }

  return (
    <div className=" space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                task.status === "done"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status === "done" ? "Completed" : task.status}
            </span>
          </div>
          <span className="text-sm text-blue-800 mt-1 p-1 bg-blue-200 rounded-lg">
            🎨 {task.Project_types|| "No Project Types available."}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TasksSearch;
