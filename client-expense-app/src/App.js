import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './Components/Index/Index';
import SignupLogin from './Components/Signup-Login';
import UserHome from './Components/User/UserHome';
import Statatics from './Components/User/Statatics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignupLogin />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/statistics" element={<Statatics />} />
      </Routes>
    </Router>
  );
}

export default App;
