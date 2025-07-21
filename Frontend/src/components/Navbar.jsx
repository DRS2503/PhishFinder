import { Link } from 'react-router-dom';

function Navbar() {

    return(
    <nav className="navbar">
      <div className="navbar-left">
        <img src='phishfinder.png' width="75px" height="75px"></img>
        <h2>PhishFinder</h2>
      </div>
      <ul>
        <Link to="/">Home</Link>
        <Link to="/">About</Link>
        <Link to="/createaccount">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </ul>
    </nav> 
    );
}

export default Navbar