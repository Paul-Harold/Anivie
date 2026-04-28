import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  // 1. Using your exact existing Context logic
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. State for the Mobile Hamburger Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Keeping your Safety Net
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      setIsMobileMenuOpen(false); // Close menu on logout
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
          
          {/* DESKTOP LINKS (Hidden on mobile) */}
          <div className="hidden md:flex gap-6 font-bold text-sm">
            <Link to="/" className="text-ani-subtext hover:text-white transition-colors">Anime</Link>
            <Link to="/movies" className="text-ani-subtext hover:text-[#90cea1] transition-colors">Movies</Link>
          </div>
        </div>

        {/* RIGHT: DESKTOP Authentication Area (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-ani-subtext text-xs">
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
            <Link to="/auth" className="px-6 py-2 bg-ani-blue text-white text-xs font-bold rounded hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20">
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON (Visible only on mobile) */}
        <button 
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-7 h-7 text-ani-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 hover:text-ani-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 flex flex-col space-y-4 shadow-xl">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-ani-subtext hover:text-white font-bold transition-colors">Anime</Link>
          <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className="text-ani-subtext hover:text-[#90cea1] font-bold transition-colors">Movies</Link>
          
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-ani-subtext text-xs text-center mb-1">
                  Welcome back, <strong className="text-white">{user.username}</strong>
                </span>
                <Link to="/mylist" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded hover:bg-gray-700 transition-colors border border-gray-700">
                  My Library
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-center w-full px-6 py-2 bg-ani-blue text-white text-xs font-bold rounded hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;