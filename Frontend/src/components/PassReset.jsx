import { Link } from 'react-router-dom'

function PassReset(){
    return(
        <div className="container">
            <h1>Password Reset</h1>
            <div className="login-box">
                <form>
                    <label htmlFor="email">Enter Email</label><br></br>
                    <input type="email" id="email" name="email"></input>

                    <br></br>
                    
                    <button className="form-btn" type="submit">Send</button>
                </form>
            </div>
            <Link to="/login" className='read-the-docs'>Return</Link>
        </div>

        
    )
}

export default PassReset