import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../index.css'

function Navbar() {

    return(
    <nav class="navbar">
      <div class="navbar-left">
        <img src='phishfinder.png' width="100px" height="100px"></img>
        <h2>PhishFinder</h2>
      </div>
      <ul>
        <Link to="/">Home</Link>
        <Link to="/">about</Link>
        <Link to="/">Create Account</Link>
        <Link to="/login">Login</Link>
      </ul>
    </nav> 
    );
}

export default Navbar