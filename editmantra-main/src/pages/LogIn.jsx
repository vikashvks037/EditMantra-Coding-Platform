import { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Reset any previous message

    try {
      const response = await axios.post('http://localhost:5000/login', {  // Changed to '/login' 
        email,
        password,
        role,
      });

      // Store the JWT token in localStorage (or sessionStorage)
      localStorage.setItem('token', response.data.token);

      // Optionally, store role and other user data in localStorage or state
      localStorage.setItem('role', response.data.role);

      setMessage('Login successful!');
      // Redirect to the appropriate page after login (e.g., dashboard)
      window.location.href = '/'; // Change this to your dashboard route
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className="relative flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/LogIn.jpg)' }}
      >
        <div className="relative z-10 rounded-lg p-8 w-full max-w-xl ml-auto mr-20 bg-slate-500 shadow-2xl shadow-gray-800">
          <h2 className="text-2xl font-bold text-cyan-400 text-center mb-6">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role selection */}
            <div className="flex justify-center gap-8 mb-6">
              <label className="text-white font-semibold flex items-center">
                <input
                  type="radio"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="mr-2"
                />
                User
              </label>
              <label className="text-white font-semibold flex items-center">
                <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="mr-2"
                />
                Admin
              </label>
            </div>

            {/* Email input */}
            <div>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password input */}
            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Error or success message */}
            {message && (
              <p
                className={`text-center ${message.includes('successful') ? 'text-green-200' : 'text-red-300'}`}
              >
                {message}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-cyan-300 text-white p-2 rounded-lg hover:bg-purple-400 text-xl transition duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-white font-bold text-xl">
            Don’t have an account? &nbsp;
            <a href="/signup" className="text-purple-200 font-bold hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
