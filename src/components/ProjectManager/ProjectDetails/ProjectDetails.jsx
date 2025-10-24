import React from "react";
import { X } from "lucide-react";
import { CiCalendar } from "react-icons/ci";
import { BASE_URL } from "../../../config";
import proimg from "../../../assets/Profile.jpg";

const ProjectDetails = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 relative animate-fadeIn my-10 w-[95%] md:w-[80%] lg:w-[60%] md-h-[80%] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div
          className={`border-l-4 pl-3 pb-2 ${
            project.project_status === "inprogress"
              ? "border-yellow-500"
              : project.project_status === "completed"
              ? "border-green-500"
              : project.project_status === "planning"
              ? "border-blue-500"
              : project.project_status === "active"
              ? "border-orange-400"
              : "border-gray-300"
          }`}
        >
          <h1 className="font-bold text-2xl mb-1">{project.project_name}</h1>
          <p className="text-sm text-gray-600">
            {project.project_description || "No description available"}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                project.project_status === "completed"
                  ? "bg-green-100 text-green-700"
                  : project.project_status === "inprogress"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.project_status === "active"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.project_status}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                project.project_priority === "High"
                  ? "bg-red-100 text-red-700"
                  : project.project_priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {project.project_priority || "Normal"}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-sm text-gray-600">Progress</span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">
                {project.project_progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${project.project_progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-sm text-gray-600">Budget</span>
            <div className="text-lg font-bold text-gray-800 mt-1">
              ${project.project_budget}
            </div>
            <div className="text-sm text-gray-500">
              Owner: {project.project_owner_name}
            </div>
          </div>

          {/* Team */}
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-sm text-gray-600 mb-2 block">Team</span>
            <div className="flex -space-x-3 mb-2">
              {project.users && project.users.length > 0 ? (
                project.users.slice(0, 4).map((user) => (
                  <img
                    key={user.id}
                    src={user.image ? `${BASE_URL}/${user.image}` : proimg}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    alt={user.name}
                  />
                ))
              ) : (
                <img
                  src={proimg}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  alt="Default"
                />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {project.users?.length || 1} team member
              {project.users?.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-sm text-gray-600 mb-2 block">Dates</span>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CiCalendar className="text-gray-500" />
                <p>
                  <strong>Start:</strong>{" "}
                  {project.project_start_date
                    ? new Date(project.project_start_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CiCalendar className="text-gray-500" />
                <p>
                  <strong>Deadline:</strong>{" "}
                  {project.project_due_date
                    ? new Date(project.project_due_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
