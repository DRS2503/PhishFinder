import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src='phishfinder.png' className='logo' width="300px" height="300px"></img>
      <h1>Welcome to PhishFinder</h1>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <p className="read-the-docs">
        PhishFinder is a phishing-email detector for students and small teams. It inspects email
  headers, URLs, and language cues, then classifies each message as Safe, Suspicious, or
  Malicious. You’ll also see the top factors that influenced the decision so you can learn
  what to watch for in the future. Files are processed on our server and deleted right after
  analysis.
      </p>
    </div>
  )
}

export default LandingPage