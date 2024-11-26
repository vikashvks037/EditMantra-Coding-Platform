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
        className="flex-grow flex flex-col items-center justify-center p-8 relative bg-cover bg-center"
        style={{backgroundImage: 'url(./public/Home.jpg)',}}>
        <div className="relative z-10 text-center">
        <h2 className="text-5xl font-extrabold mb-6 relative text-center">
          <span className="relative z-10 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">Explore Yourself with EditMantra</span>
        </h2>
          <p className="text-center font-bold text-red-400 mb-14 text-lg max-w-full leading-relaxed relative">
            <span className="relative z-10 text-shadow-lg">Explore coding challenges, collaborate with peers, and engage with gamified experiences.</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Real-Time Collaboration Card */}
            <div
              onClick={() => handleRedirect('/RealTimeCollaboration')}className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white">
              <h3 className="text-2xl font-bold mb-2">Real-Time Collaboration</h3>
              <p>Work on coding projects together with your friends in real time.</p>
            </div>

            {/* Learning Resources Card */}
            <div
              onClick={() => handleRedirect('/LearningResources')}className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white">
              <h3 className="text-2xl font-bold mb-2">Learning Resources</h3>
              <p>Access tutorials, documentation, and guides to enhance your coding skills.</p>
            </div>

            {/* Gamification Card */}
            <div
              onClick={() => handleRedirect('/Gamification')}className="bg-purple-50 text-cyan-400 shadow-xl rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:bg-cyan-500 hover:text-white">
              <h3 className="text-2xl font-bold mb-2">Gamification</h3>
              <p>Engage in real-time coding with interactive challenges.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
