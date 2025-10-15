import React from 'react'
import { X, UserPlus } from "lucide-react";


const ProjectActions = () => {
  return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        </div>
        </div>
  )
}

export default ProjectActions