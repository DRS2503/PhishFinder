import { useState } from 'react'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <img src='phishfinder.png' width="300px" height="300px"></img>
      <h1>Welcome to PhishFinder</h1>
      <button onClick={() => navigate('/login')}>Login</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default LandingPage