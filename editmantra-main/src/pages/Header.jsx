import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (route)

  // Check login status initially
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token !== null);
  }, []); // Only run on initial render

  const handleAuth = () => {
    if (isLoggedIn) {
      // Log the user out by removing the token
      localStorage.removeItem('token');
      setIsLoggedIn(false); // Update state to reflect logout
      navigate('/login'); // Redirect to the login page
    } else {
      // Navigate to the login page
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white w-full p-4 shadow-md flex justify-between items-center border-b-2 border-gray-500">
      <div className="flex items-center ml-6">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">
          EditMantra
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-10">
        <Link to="/" className={`text-xl font-semibold ${isActive('/') ? 'text-cyan-600' : 'text-[#8f238f] hover:text-cyan-600 hover:underline'}`}>
          Home
        </Link>
        <Link to="/leaderboard" className={`text-xl font-semibold ${isActive('/about') ? 'text-cyan-600' : 'text-[#8f238f] hover:text-cyan-600 hover:underline'}`}>
          Leaderboard
        </Link>
        <Link to="/about" className={`text-xl font-semibold ${isActive('/about') ? 'text-cyan-600' : 'text-[#8f238f] hover:text-cyan-600 hover:underline'}`}>
          About
        </Link>
        <Link to="/feedback" className={`text-xl font-semibold ${isActive('/feedback') ? 'text-cyan-600' : 'text-[#8f238f] hover:text-cyan-600 hover:underline'}`}>
          Feedback
        </Link>
      </nav>

      {/* Login/Logout Button and Profile */}
      <div className="flex items-center space-x-4 mr-4">
        <button onClick={handleAuth} className="bg-purple-600 text-white font-bold py-2 px-7 rounded-lg shadow-lg transform hover:translate-y-1 hover:bg-cyan-400 hover:shadow-md transition duration-150 ease-in-out mr-5">
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        <Link to="/profile" className="relative group w-11 h-11">
          <img src="./EditProfile.png" alt="Profile Logo" className="w-full h-full object-cover" />
          <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-700 text-white rounded-md text-sm py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Profile
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
