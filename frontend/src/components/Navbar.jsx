import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, History, Activity, PlusSquare } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-sky-500 to-sky-700 text-white py-4 shadow-lg border-b border-sky-300">
      <div className="container mx-auto flex justify-between items-center px-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide flex items-center gap-2 hover:text-sky-100 transition"
        >
          <Activity className="text-red-200" />
          <span className="text-white">PancreaScan AI</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6">

          {/* Username */}
          <span className="text-sm text-sky-100 font-medium hidden md:block">
            Dr. {username}
          </span>

          {/* New Scan */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sky-600 transition font-medium"
          >
            <PlusSquare size={18} />
            <span className="hidden sm:inline">New Scan</span>
          </Link>

          {/* History */}
          <Link
            to="/history"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sky-600 transition font-medium"
          >
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 transition font-medium shadow-md"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;