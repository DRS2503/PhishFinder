import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuth } from '../Context/AuthContext';


export default function PassReset () {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [loadng, setLoading] = useState(false);
    const [message, setMessage] = useState()

    async function handleSubmit(e) {
        e.preventDefault()

        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError("Failed to reset")
        }
        setLoading(false)

    }

    return (
        <>
            <div className="container">
                <h1>Password Password</h1>
                <div className="login-box">
                    {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red', marginBottom: '15px'}}>{error}</div>}
                    {message && <div style={{ color: 'green', padding: '10px', border: '1px solid green', marginBottom: '15px'}}>{message}</div>}
                    <form onSubmit={handleSubmit} className="login-form">

                        <label htmlFor="email">Email</label><br></br>
                        <input type="email" id="email"ref={emailRef} />

                        <br></br>
                        <button  type='submit' className='lbtn'>Submit</button>
                    </form>
                </div>
                <Link to="/login" className='read-the-docs'>Login</Link>
            </div> 
        </>
    )
}