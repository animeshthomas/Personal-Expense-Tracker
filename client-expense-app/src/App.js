import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './Components/Index/Index';
import SignupLogin from './Components/Signup-Login';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignupLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
