import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // This tells us what URL we are currently looking at

  return (
    <nav className="bg-ani-card px-6 py-4 shadow-md mb-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-ani-text tracking-wider">
          Ani<span className="text-ani-blue">Vie</span> 
        </Link>

        {/* Page Links */}
        <div className="flex gap-6 font-bold text-sm">
          <Link 
            to="/" 
            className={`transition-colors hover:text-ani-text ${location.pathname === '/' || location.pathname.includes('/category') ? 'text-ani-blue' : 'text-ani-subtext'}`}
          >
            Anime
          </Link>
          <Link 
            to="/movies" 
            className={`transition-colors hover:text-ani-text ${location.pathname === '/movies' ? 'text-[#90cea1]' : 'text-ani-subtext'}`}
          >
            Movies
          </Link>
          <Link 
            to="/mylist" 
            className={`transition-colors hover:text-ani-text ${location.pathname === '/mylist' ? 'text-ani-blue' : 'text-ani-subtext'}`}
          >
            My List
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;