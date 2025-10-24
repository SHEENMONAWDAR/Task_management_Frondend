// NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom"; // if you're using React Router

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Oops! Page not found</h2>
      <p className="mb-8 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back To Login
      </Link>
    </div>
  );
}
