import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MovieDashboard from './pages/MovieDashboard';
import CategoryPage from './pages/CategoryPage';
import MyWatchlist from './pages/MyWatchlist';
import MovieCategoryPage from './pages/MovieCategoryPage';
import ItemDetails from './pages/ItemDetails';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="font-sans min-h-screen bg-ani-dark">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<MovieDashboard />} />
            <Route path="/category/:type" element={<CategoryPage />} />
            <Route path="/mylist" element={<MyWatchlist />} />
            <Route path="/details/:type/:id" element={<ItemDetails />} />
            <Route path="/movies/category/:type" element={<MovieCategoryPage />} />
            <Route path="/auth" element={<AuthPage />} />

            
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;