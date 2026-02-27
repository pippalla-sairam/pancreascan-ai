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
    <nav className="bg-blue-900/95 backdrop-blur-md text-white py-4 shadow-xl border-b border-blue-700">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* Logo Section */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide flex items-center gap-2 hover:text-blue-200 transition"
        >
          <Activity className="text-blue-300" /> PancreaScan AI
        </Link>

        {/* Menu Section */}
        <div className="flex items-center gap-8">
          
          {/* Username */}
          <span className="text-sm text-blue-200 font-medium hidden md:block">
            Dr. {username}
          </span>

          {/* New Scan */}
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-100 hover:text-white transition font-medium"
          >
            <PlusSquare size={18} />
            <span className="hidden sm:inline">New Scan</span>
          </Link>

          {/* History */}
          <Link
            to="/history"
            className="flex items-center gap-2 text-blue-100 hover:text-white transition font-medium"
          >
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-300 transition font-medium"
          >
            <LogOut size={18} /> Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
