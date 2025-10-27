import React from "react";
import { BASE_URL } from "../../config";

const PeopleSearch = ({ people }) => {
  if (!people.length) {
    return <div className="text-gray-500 text-sm ">No people found.</div>;
  }

  return (
    <div className=" gap-3">
      {people.map((person) => (
        <div
          key={person.id}
          className="p-3  rounded-lg flex items-center gap-3 hover:bg-gray-50 transition"
        >
          <img
            src={`${BASE_URL}/${person.image}` || ""}
            alt={person.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-800">{person.name}</h4>
            <p className="text-sm text-gray-500">{person.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeopleSearch;
