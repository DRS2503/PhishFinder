import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, Alert } from 'react';
import { useAuth } from '../Context/AuthContext';



export default function Login () {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loadng, setLoading] = useState(false);
    const nav = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        try{
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            nav('/dashboard')
        } catch (err){
            setError("Failed to sign in")
        }
        setLoading(false)

    }

    return (
        <>
            <div className="container">
                <h1>Login</h1>
                <div className="login-box">
                    {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red', marginBottom: '15px'}}>{error}</div>}
                    <form onSubmit={handleSubmit} className="login-form">

                        <label htmlFor="email">Email</label><br></br>
                        <input type="email" id="email"ref={emailRef} />
                        
                        <br></br>

                        <label htmlFor="pwd">Password</label><br></br>
                        <input type="password" id="pwd" ref={passwordRef} />

                        <br></br>
                        <button  type='submit' className='lbtn'>Login</button>
                    </form>
                </div>
                <Link to="/passreset" className='read-the-docs'>Forgot Password?</Link>
                <Link to="/signup" className='read-the-docs'>Need An Account?</Link>
            </div> 
        </>
    )
}