import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import TasksSearch from "./TasksSearch";
import ProjectsSearch from "./ProjectsSearch";
import PeopleSearch from "./PeopleSearch";
import API from "../../api";
import { LuSquareCheckBig } from "react-icons/lu";
import { FaRegFolderOpen } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";

export default function Page({ onClose }) {
    const [activeTab, setActiveTab] = useState("tasks");
    const [searchQuery, setSearchQuery] = useState("");
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res;
                if (activeTab === "tasks") {
                    res = await API.get("/tasks", {
                        params: searchQuery ? { q: searchQuery } : {},
                    });
                    
                    setTasks(res.data || []);
                } else if (activeTab === "projects") {
                    res = await API.get("/projects/all", {
                        params: searchQuery ? { q: searchQuery } : {},
                    });
                    console.log(res)
                    setProjects(res.data || []);
                } else if (activeTab === "people") {
                    res = await API.get("/users", {
                        params: searchQuery ? { q: searchQuery } : {},
                    });
                    setPeople(res.data || []);
                }
            } catch (err) {
                if (err.name !== "CanceledError") console.error(err);
            }
        };

        fetchData()
    }, [activeTab, searchQuery]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >

                <h2 className="text-xl font-semibold mb-4">Search</h2>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <input
                        type="text"
                        value={searchQuery}
                        autoFocus
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search here..."
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>

                <div className="mt-4 flex gap-10 pb-2">
                    <div
                        className={`cursor-pointer  flex items-center gap-2 pb-1 border-b-2 ${activeTab === "tasks"
                            ? "border-blue-500 text-blue-600 font-medium"
                            : "border-transparent text-gray-600 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("tasks")}
                    >
                        <LuSquareCheckBig size={20} /> Tasks
                    </div>

                    <div
                        className={`cursor-pointer  flex items-center gap-2 pb-1 border-b-2 ${activeTab === "projects"
                            ? "border-blue-500 text-blue-600 font-medium"
                            : "border-transparent text-gray-600 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("projects")}
                    >
                        <FaRegFolderOpen /> Projects
                    </div>

                    <div
                        className={`cursor-pointer flex items-center gap-2 pb-1 border-b-2 ${activeTab === "people"
                            ? "border-blue-500 text-blue-600 font-medium"
                            : "border-transparent text-gray-600 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("people")}
                    >
                        <GoPeople size={20} /> People
                    </div>
                </div>

                <div className="mt-3 max-h-[400px] overflow-y-auto">
                    {activeTab === "tasks" && <TasksSearch tasks={tasks} />}
                    {activeTab === "projects" && <ProjectsSearch projects={projects} />}
                    {activeTab === "people" && <PeopleSearch people={people} />}
                </div>
                <div className="mt-3">
                    <hr />
                    <div className="">
                        <button
                            onClick={onClose}
                            className=" cursor-pointer  hover:bg-slate-300 flex px-4 py-2 shadow mt-3 rounded items-center gap-2"
                        >
                          <X size={20} />  Return 
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
