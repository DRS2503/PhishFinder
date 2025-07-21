import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import './App.css'
import LandingPage from './pages/LandingPage'
import Signup from './pages/SignUpPage'
import DashBoardPage from './pages/DashBoardPage'
import Navbar from './components/Navbar'
import CreateAccount from './pages/CreateAccount'
import PassReset from './pages/PassReset';
import { AuthProvider } from './Context/AuthContext';



function App() {
  return (
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path='/passreset' element={<PassReset />} />
        </Routes> 
      </AuthProvider>

    
  )
}

export default App
