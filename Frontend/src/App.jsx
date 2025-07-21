import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import './App.css'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignUpPage'
import DashBoardPage from './pages/DashBoardPage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import PassResetPage from './pages/PassResetPage';
import { AuthProvider } from './Context/AuthContext';


function App() {
  return (
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route exact path="/dashboard" element={<DashBoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/passreset' element={<PassResetPage />} />
        </Routes> 
      </AuthProvider>

    
  )
}

export default App
