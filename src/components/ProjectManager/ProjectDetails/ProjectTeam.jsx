import React from "react";
import { BASE_URL } from "../../../config";
import proimg from "../../../assets/Profile.jpg"; // import default profile image

const ProjectTeam = ({ project }) => {
    return (
        <div>
            <div className="border border-gray-200 rounded-md p-5 bg-white">
                <div className="mb-5">
                    <div className="text-2xl font-bold">Team Members</div>
                    <div className="text-sm text-gray-400">
                        People working on this project
                    </div>
                </div>

                <div className="">
                    {project.users && project.users.length > 0 ? (
                        project.users.map((user) => (
                            <div key={user.id} className=" flex justify-between bg-gray-100 w-full p-3 rounded-md">
                                <div className="flex items-center">
                                <img
                                    src={user.image ? `${BASE_URL}/${user.image}` : ""}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    alt={user.name}
                                />
                                <div className="ml-2">
                                    <div className="text-md">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.role}</div>
                                </div>
                                </div>
                                <div>
                                    <button className="p-2 border border-gray-300 bg-white rounded-md">View Profile</button>
                                </div>


                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center">
                            <img
                                src={proimg}
                                className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
                                alt="Default"
                            />
                            <div className="text-sm mt-1">No team members</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectTeam;
