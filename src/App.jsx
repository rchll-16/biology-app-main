import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Main Pages
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import LessonPage from './pages/LessonPage';
import Activity from './pages/Activity';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

// Activity Pages
import Activity1 from './pages/activity/Activity1';
import Activity2 from './pages/activity/Activity2';
import Activity3 from './pages/activity/Activity3';
import Activity4 from './pages/activity/Activity4';
import Activity5 from './pages/activity/Activity5';

//Admin
import AdminLogin from './pages/admin/adminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Lessons */}
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/lesson/:id" element={<LessonPage />} />

        {/* Activities */}
        <Route path="/activity1" element={<Activity1 />} />
        <Route path="/activity2" element={<Activity2 />} />
        <Route path="/activity3" element={<Activity3 />} />
        <Route path="/activity4" element={<Activity4 />} />
        <Route path="/activity5" element={<Activity5 />} />
        <Route path="/activity/:id" element={<Activity />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
