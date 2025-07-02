import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import './App.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashBoardPage from './pages/DashBoardPage'
import Navbar from './components/Navbar'
import CreateAccount from './pages/CreateAccount'
import PassReset from './pages/PassReset';


function App() {
  return (
    <>
    <Navbar />
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashBoardPage />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path='/passreset' element={<PassReset />} />
    </Routes> 

    </>
  )
}

export default App
