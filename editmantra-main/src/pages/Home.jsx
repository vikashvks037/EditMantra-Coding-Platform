import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Home() {
  const navigate = useNavigate();

  // Check if the user is logged in (i.e., if there's a token in localStorage)
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if not logged in
      return false; // User is not logged in
    }
    return true; // User is logged in
  };

  // Redirect to the specified path if the user is logged in, otherwise go to login page
  const handleRedirect = (path) => {
    if (!checkLoginStatus()) {
      return; // If not logged in, stop execution here
    }
    navigate(path); // Redirect to the desired path
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="flex-grow flex flex-col items-center justify-start relative bg-cover bg-center"
        style={{ backgroundImage: 'url(/Home.jpg)' }}
      >
        <div className="relative z-10 w-full text-center mt-10 mb-11">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-500 to-green-600 transition-all duration-500 ease-in-out transform hover:scale-105 hover:opacity-90 bg-gray-500 p-4 rounded-md border-4 border-gray-500 w-full hover:w-[90%] ml-auto mr-auto">
            Transform Your Coding
          </h2>
        </div>

        {/* Grid layout with borders on each card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-11 w-full max-w-6xl">
          {/* Real-Time Collaboration Card */}
          <div
            onClick={() => handleRedirect('/RealTimeCollaboration')}
            className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white border-2 border-gray-500"
          >
            <h3 className="text-2xl font-bold mb-2">Real-Time Collaboration</h3>
            <p>Work on coding projects together with your friends in real time.</p>
          </div>

          {/* Learning Resources Card */}
          <div
            onClick={() => handleRedirect('/LearningResources')}
            className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white border-2 border-gray-500"
          >
            <h3 className="text-2xl font-bold mb-2">Learning Resources</h3>
            <p>Access tutorials, documentation, and guides to enhance your coding skills.</p>
          </div>

          {/* Gamification Card */}
          <div
            onClick={() => handleRedirect('/Gamification')}
            className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white border-2 border-gray-500"
          >
            <h3 className="text-2xl font-bold mb-2">Gamification</h3>
            <p>Engage in real-time coding with interactive challenges.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
