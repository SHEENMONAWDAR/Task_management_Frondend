import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
    const formRef = useRef();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = new FormData(formRef.current);

            const res = await API.post("/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(res.data.message);
            formRef.current.reset();
            navigate('/login')
        } catch (err) {
            setMessage(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Create an Account
                </h2>

                {message && (
                    <div
                        className={`mb-4 text-center text-sm font-medium ${message.includes("failed") ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    encType="multipart/form-data"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter Your Phone number"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>


                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 text-white font-medium rounded-lg transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Submitting..." : "Register"}
                    </button>
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
