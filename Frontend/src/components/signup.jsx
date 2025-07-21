import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword} from 'firebase/auth' 
import { useRef, useState, Alert } from 'react';
import { useAuth } from '../Context/AuthContext';



export const Auth = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loadng, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Password do not match")
        }

        if (passwordRef.current.value.length < 6){
            return setError("Password must be 6 characters or more")
        }

        try{
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
        } catch (err){
            console.error("Signup error:",err)
            setError("Failed to create an account")
        }
        setLoading(false)

    }

    return (
        <>
            <div className="container">
                <h1>Sign up</h1>
                <div className="login-box">
                    {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red', marginBottom: '15px'}}>{error}</div>}
                    <form onSubmit={handleSubmit} className="login-form">

                        <label htmlFor="email">Email</label><br></br>
                        <input type="email" id="email"ref={emailRef} />
                        
                        <br></br>

                        <label htmlFor="pwd">Password</label><br></br>
                        <input type="password" id="pwd" ref={passwordRef} />

                        <br></br>

                        <label htmlFor="confpwd">Re-Enter Password</label><br></br>
                        <input type="password" id="confpwd" ref={passwordConfirmRef} />

                        <br></br>
                        <button  type='submit' className='lbtn'>Submit</button>
                    </form>
                </div>
            </div> 
        </>
    )
}