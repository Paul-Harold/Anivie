import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🚨 NEW: The Safety Net
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate('/'); 
    }
  };

  return (
    <nav className="bg-ani-dark border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-wider">
            <span className="text-white">Ani</span><span className="text-ani-blue">Vie</span>
          </Link>
          
          <div className="hidden md:flex gap-6 font-bold text-sm">
            <Link to="/" className="text-ani-subtext hover:text-white transition-colors">Anime</Link>
            <Link to="/movies" className="text-ani-subtext hover:text-[#90cea1] transition-colors">Movies</Link>
          </div>
        </div>

        {/* RIGHT: Authentication & User Area */}
        <div className="flex items-center gap-4">
          {user ? (
            // 🚨 WHAT LOGGED-IN USERS SEE
            <>
              <span className="hidden md:inline text-ani-subtext text-xs">
                Welcome back, <strong className="text-white">{user.username}</strong>
              </span>
              
              <Link to="/mylist" className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded hover:bg-gray-700 transition-colors border border-gray-700">
                My Library
              </Link>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
              >
                Logout
              </button>
            </>
          ) : (
            // 🚨 WHAT GUESTS SEE
            <Link to="/auth" className="px-6 py-2 bg-ani-blue text-white text-xs font-bold rounded hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;