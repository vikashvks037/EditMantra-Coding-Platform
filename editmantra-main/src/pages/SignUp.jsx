import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from './Footer';
import Header from './Header';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      // Select the API endpoint based on the role
      const endpoint = role === 'admin' 
        ? 'http://localhost:5000/signup/admin' 
        : 'http://localhost:5000/signup/user';

      const response = await axios.post(endpoint, {
        name, username, email, password, role, // Send role to backend
      });
      
      setMessage(response.data.message); // Display success message
      setIsLoading(false);
      navigate('/'); // Navigate to home page after successful signup
    } catch (error) {
      setMessage('Error creating user: ' + (error.response?.data?.message || 'Server error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-200 to-pink-200"
       style={{ backgroundImage: 'url(/LogIn.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="relative z-10 rounded-lg p-5 w-full max-w-xl ml-auto mr-20 bg-slate-500 shadow-2xl shadow-gray-800">
          <h2 className="text-2xl font-bold text-cyan-300 text-center mb-6">SIGN UP</h2>
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="user">Student</option>
                <option value="admin">Educator</option>
              </select>
            </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="@Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="User@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password Must Be Greater Then 8 With Uppercase and Symbol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-200' : 'text-red-300'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-300 p-2 text-white rounded-lg text-xl hover:bg-purple-400 transition duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
          <div className="mt-6 text-center font-medium text-xl text-gray-100">
            Already have an account? &nbsp;
            <a href="/LogIn" className="text-white font-semibold hover:underline">Log In</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
