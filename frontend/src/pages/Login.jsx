import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', creds);
      localStorage.setItem('username', res.data.username);
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-r from-blue-900 to-blue-600">

      {/* Left Branding Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-white px-10">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">PancreaScan AI</h1>
        <p className="text-lg text-blue-200 text-center leading-relaxed">
          Secure medical access for doctors.<br />
          Login to access patient diagnostics powered by AI.
        </p>
      </div>

      {/* Login Card */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-slate-100">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 border border-gray-200">
          
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Medical Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              />
            </div>

            <button className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg font-semibold text-lg transition">
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            New system user?{" "}
            <Link to="/signup" className="text-blue-700 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
