import { Link } from 'react-router-dom';

function Navbar() {

    return(
    <nav className="navbar">
      <div className="navbar-left">
        <img src='phishfinder.png' width="100px" height="100px"></img>
        <h2>PhishFinder</h2>
      </div>
      <ul>
        <Link to="/">Home</Link>
        <Link to="/">about</Link>
        <Link to="/createaccount">Create Account</Link>
        <Link to="/login">Login</Link>
      </ul>
    </nav> 
    );
}

export default Navbar