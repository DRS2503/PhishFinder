import '../App.css'
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <img src='phishfinder.png' className='logo' width="300px" height="300px"></img>
      <h1>Welcome to PhishFinder</h1>
      <button onClick={() => navigate('/login')}>Login</button>
      <p className="read-the-docs">
        Put a bunch of stuff down here about our project
      </p>
    </div>
  )
}

export default LandingPage