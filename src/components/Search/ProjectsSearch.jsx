import React from "react";
import { BASE_URL } from "../../config";
import projimg from '../../assets/project.jpg'

const ProjectsSearch = ({ projects }) => {
    if (!projects.length) {
        return <div className="text-gray-500 text-sm mt-2">No projects found.</div>;
    }

    return (
        <div className=" space-y-3">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <img
                                src={project.project_logo ? `${BASE_URL}/${project.project_logo}` : projimg}
                                alt={project.project_logo || "Project Logo"}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <h3 className="font-medium text-gray-800">{project.name}</h3>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${project.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : project.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : project.status === "active"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {project.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {project.description
                            || "No description available."}
                    </p>
                    {project.due_date && (
                        <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(project.due_date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProjectsSearch;
