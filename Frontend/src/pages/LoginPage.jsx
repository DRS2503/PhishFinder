import { useNavigate } from 'react-router-dom';
import './LoginPage.css'

function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="App">
      <h1>Login</h1>
      <div className="login_box">
        <form action="" className="login-form">
          <label for="email">Email:</label><br></br>
          <input type="email" id="email" name="email"></input><br></br>
          <label for="pwd">Password</label><br></br>
          <input type="password" id="pwd" name="pwd"></input><br></br>
        </form>
      </div>

      <a className="password-reset">
        Forgot Password? 
      </a>
    </div>
  )
}

export default Login
