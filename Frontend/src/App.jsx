import { Routes,Route } from 'react-router-dom'
import '/index.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashBoardPage from './pages/DashBoardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashBoardPage />} />
    </Routes> 
  )
}

export default App
