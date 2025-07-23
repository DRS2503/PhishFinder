import { Link } from 'react-router-dom';

function Navbar() {

    return(
    <nav className="navbar">
      <div className="navbar-left">
        <img src='phishfinder.png' width="75px" height="75px"></img>
        <h2>PhishFinder</h2>
      </div>
      <ul style={{marginRight:'5px'}}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </ul>
    </nav> 
    );
}

export default Navbar