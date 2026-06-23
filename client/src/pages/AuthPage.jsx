import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setSuccessMsg('Email verified! You can now log in.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle Login
        const res = await axios.post('https://anivie-backend.vercel.app/api/auth/login', { username, password });
        login(res.data.token, res.data.user);
        navigate('/mylist'); // Send them to their library!
      } else {
        // Handle Registration
        await axios.post('https://anivie-backend.vercel.app/api/auth/register', { email, username, password });
        // Automatically switch back to login mode after successful registration
        setIsLogin(true);
        alert('Account created! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    finally {
    setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="relative bg-ani-card p-8 rounded-2xl border border-ani-border shadow-2xl w-full max-w-md animate-fade-in overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-ani-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black tracking-wider mb-4">
            <span className="text-white">Ani</span><span className="text-ani-blue">Vie</span>
          </Link>
          <h2 className="text-2xl font-black text-white">
            {isLogin ? 'Welcome Back' : 'Join AniVie'}
          </h2>
          <p className="text-ani-subtext text-sm mt-1">
            {isLogin ? 'Sign in to access your library' : 'Create an account to start tracking'}
          </p>
        </div>

        {successMsg && <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-3 rounded-lg mb-4 text-sm font-bold text-center" role="status">{successMsg}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg mb-4 text-sm font-bold text-center" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
            {!isLogin && (
            <div>
              <label className="text-ani-subtext text-xs font-bold mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
                autoComplete="email"
                className="w-full bg-ani-dark text-white p-3 rounded-lg outline-none border border-ani-border focus:border-ani-blue transition-colors"
              />
            </div>
          )}
          <div>
            <label className="text-ani-subtext text-xs font-bold mb-1.5 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required minLength="3"
              autoComplete="username"
              className="w-full bg-ani-dark text-white p-3 rounded-lg outline-none border border-ani-border focus:border-ani-blue transition-colors"
            />
          </div>

          <div>
            <label className="text-ani-subtext text-xs font-bold mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required minLength="6"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full bg-ani-dark text-white p-3 rounded-lg outline-none border border-ani-border focus:border-ani-blue transition-colors"
            />
          </div>

          <button
  type="submit"
  disabled={isLoading}
  className={`w-full py-3 mt-4 font-bold rounded-lg transition-colors shadow-lg shadow-ani-blue/20 flex items-center justify-center space-x-2 active:scale-[0.98] ${
    isLoading ? 'bg-blue-400 text-white cursor-not-allowed opacity-80' : 'bg-ani-blue text-ani-dark hover:bg-white'
  }`}
>
  {isLoading && (
    <svg 
      className="animate-spin h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )}
  <span>
    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
  </span>
</button>
        </form>

        <p className="text-center text-ani-subtext text-sm mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-white font-bold hover:text-ani-blue transition-colors">
            {isLogin ? 'Register Here' : 'Log In'}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;