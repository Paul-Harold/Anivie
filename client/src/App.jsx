import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MovieDashboard from './pages/MovieDashboard';
import CategoryPage from './pages/CategoryPage';
import MyWatchlist from './pages/MyWatchlist';
import MovieCategoryPage from './pages/MovieCategoryPage';

function App() {
  return (
    <Router>
      <div className="font-sans min-h-screen bg-ani-dark">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<MovieDashboard />} />
            <Route path="/category/:type" element={<CategoryPage />} />
            <Route path="/mylist" element={<MyWatchlist />} />
            <Route path="/movies/category/:type" element={<MovieCategoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;