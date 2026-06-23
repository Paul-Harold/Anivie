import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Shared active-state styling for the primary nav links
const navLinkClass = (accent) => ({ isActive }) =>
  `relative font-bold text-sm transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${
    isActive
      ? `text-white ${accent} after:w-full`
      : 'text-ani-subtext hover:text-white after:w-0'
  }`;

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
    <nav className="bg-ani-dark/80 backdrop-blur-md border-b border-ani-border sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT: Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-wider hover:opacity-90 transition-opacity">
            <span className="text-white">Ani</span><span className="text-ani-blue">Vie</span>
          </Link>

          {/* DESKTOP LINKS (Hidden on mobile) */}
          <div className="hidden md:flex gap-6">
            <NavLink to="/" end className={navLinkClass('after:bg-ani-blue')}>Anime</NavLink>
            <NavLink to="/movies" className={navLinkClass('after:bg-ani-movie')}>Movies</NavLink>
          </div>
        </div>

        {/* RIGHT: DESKTOP Authentication Area (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-ani-subtext text-xs">
                Welcome back, <strong className="text-white">{user.username}</strong>
              </span>

              <Link to="/mylist" className="px-4 py-2 bg-ani-elevated text-white text-xs font-bold rounded-lg hover:bg-ani-blue hover:text-ani-dark transition-colors border border-ani-border active:scale-95">
                My Library
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/30 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="px-6 py-2 bg-ani-blue text-ani-dark text-xs font-bold rounded-lg hover:bg-white transition-colors shadow-lg shadow-ani-blue/20 active:scale-95">
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON (Visible only on mobile) */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
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
        <div className="md:hidden bg-ani-card/95 backdrop-blur-md border-t border-ani-border p-4 flex flex-col space-y-2 shadow-xl animate-fade-in">
          <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `px-3 py-2.5 rounded-lg font-bold transition-colors ${isActive ? 'bg-ani-blue/10 text-ani-blue' : 'text-ani-subtext hover:text-white hover:bg-white/5'}`}>Anime</NavLink>
          <NavLink to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `px-3 py-2.5 rounded-lg font-bold transition-colors ${isActive ? 'bg-ani-movie/10 text-ani-movie' : 'text-ani-subtext hover:text-white hover:bg-white/5'}`}>Movies</NavLink>

          <div className="pt-4 mt-2 border-t border-ani-border flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-ani-subtext text-xs text-center mb-1">
                  Welcome back, <strong className="text-white">{user.username}</strong>
                </span>
                <Link to="/mylist" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-2.5 bg-ani-elevated text-white text-xs font-bold rounded-lg hover:bg-ani-blue hover:text-ani-dark transition-colors border border-ani-border">
                  My Library
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-center w-full px-6 py-2.5 bg-ani-blue text-ani-dark text-xs font-bold rounded-lg hover:bg-white transition-colors shadow-lg shadow-ani-blue/20">
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