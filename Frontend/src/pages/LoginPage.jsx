import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <h1>Login</h1>
      <div className="login-box">
        <form action="" className="login-form">

          <label htmlFor="email">Email</label><br></br>
          <input type="email" id="email" name="email"></input>
          
          <br></br>

          <label htmlFor="pwd">Password</label><br></br>
          <input type="password" id="pwd" name="pwd"></input>

          <br></br>
          <button className='lbtn' onClick={() => navigate('/dashboard')}>Login</button>
        </form>
      </div>
      <Link className="password-reset" to='/passreset'>Forgot Password?</Link>
    </div>
  )
}

export default Login
