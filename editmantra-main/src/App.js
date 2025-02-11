import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import NotFound from './pages/NotFound';
import LogIn from './pages/LogIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Profile from './pages/Profile';
import RealTimeCollaboration from './pages/RealTimeCollaboration.jsx';
import Gamification from './pages/Gamification.jsx';
import LearningResources from './pages/LearningResources.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import About from './pages/About.jsx';
import Feedback from './pages/Feedback.jsx';


function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/LogIn" element={<LogIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/RealTimeCollaboration" element={<RealTimeCollaboration />} />
                <Route path="/Gamification" element={<Gamification />} />
                <Route path="/LearningResources" element={<LearningResources />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/Feedback" element={<Feedback />} />
                <Route path="/About" element={<About />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/RealTimeCollaboration/editor/:roomId"element={<EditorPage />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
