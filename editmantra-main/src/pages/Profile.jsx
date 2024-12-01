import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      Axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError('An error occurred while fetching your profile.');
          }
        });
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [token, navigate]);

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-8 flex gap-8">
        {/* Left Column: Profile Card */}
        <div className="w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg rounded-lg p-6 text-white relative">
          <Link to="/EditProfile" className="absolute top-4 right-4 group w-9 h-9">
            <img src="/Profile.png"alt="Profile Logo"className="object-cover w-full h-full"/><span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-700 text-white rounded-md text-sm py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Edit</span>
          </Link>

          {/* Profile Picture */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-gray-800 text-3xl font-semibold">
            {userData?.name.charAt(0)}
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{userData?.name}</h2>
          <p className="text-lg font-medium text-center mb-1 text-gray-800"><span className="font-semibold">Username:</span> {userData?.username}</p>
          <p className="text-md text-gray-800 mb-1 text-center"><span className="font-semibold">Email:</span> {userData?.email}</p>

          {/* Achievements Card Inside */}
          <div className="bg-white shadow-lg rounded-lg p-4 mt-8 text-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center bg-green-100 p-3 rounded-md">
                <span className="text-green-600 font-semibold mr-2">🏆</span>Completed 1 Challenges
              </div>
              <div className="flex items-center bg-blue-100 p-3 rounded-md">
                <span className="text-blue-600 font-semibold mr-2">🎓</span>Finished Tutorial
              </div>
              <div className="flex items-center bg-yellow-100 p-3 rounded-md">
                <span className="text-yellow-600 font-semibold mr-2">🌟</span>Top 20% in leaderboard
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress and Activities */}
        <div className="w-2/3">
          {/* Progress Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Progress</h3>
            <div>
              <div className="flex justify-between mb-2">
                <span>Experience Points</span>
                <span>{userData?.experiencePoints || 0} / 1000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-indigo-500 h-4 rounded-full"
                  style={{ width: `${(userData?.experiencePoints / 1000) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Recent Activities</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm mr-4">1</span>
                  <span>Logged in</span>
                </div>
                <span className="text-sm text-gray-500">30 min ago</span>
              </li>
              <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm mr-4">2</span>
                  <span>Completed challenge 1</span>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
