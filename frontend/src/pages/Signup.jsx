import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', creds);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('User already exists or error occurred');
    }
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600">

      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-white px-10">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
          PancreaScan AI
        </h1>

        <p className="text-lg text-sky-100 text-center leading-relaxed max-w-md">
          AI-powered pancreatic cancer detection platform.
          <br />
          Join us in enabling early diagnosis and saving lives.
        </p>

        {/* Accent Line */}
        <div className="mt-6 h-1 w-20 bg-red-400 rounded-full"></div>
      </div>

      {/* Signup Card */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-sky-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-sky-100">

          <h2 className="text-3xl font-bold mb-6 text-center text-sky-700">
            Doctor Registration
          </h2>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              />
            </div>

            {/* Button */}
            <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold text-lg transition shadow-md">
              Sign Up
            </button>

          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="text-sky-600 font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;