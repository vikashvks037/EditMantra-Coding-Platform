import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Pages/LogIn';
import SignUp from './components/Pages/SignUp';
import Home from './components/Pages/Home';
import Gamification from './components/Pages/Gamification';
import RealTimeCollaboration from './components/Pages/RealTimeCollaboration'
import Profile from './components/Pages/Profile';
import LearningResourse from './components/Pages/LearningResources';
import Feedback from './components/Pages/Feedback';
import About from './components/Pages/About'
import EditProfile from './components/Pages/EditProfile';
import EditorPage from './components/EditorPage';
import Leaderboard from './components/Pages/Leaderboard';

function App() {
  
  return (
    <>
    <Toaster position='top-right' toastOptions={{success:{theme:{primary:'#5dddd2'}}}}></Toaster>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/RealTimeCollaboration" element={<RealTimeCollaboration />} />
        <Route path="/RealTimeCollaboration/Editor/:roomId" element={<EditorPage />} />
        <Route path="/Gamification" element={<Gamification />} />
        <Route path="/LearningResources" element={<LearningResourse />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path='/EditProfile' element={<EditProfile/>}/>
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/About" element={<About />} />
        <Route path='/Leaderboard' element={<Leaderboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
