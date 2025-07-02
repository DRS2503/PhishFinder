
function CreateAccount(){
    return(
        <div className="container">
          <h1>Create Account</h1>
          <div className="login-box">
            <form>
              <label htmlFor="fname">First Name</label><br></br>
              <input type="text" id="fname" name="fname"></input>

              <br></br>

              <label htmlFor="lname">Last Name</label> <br></br>
              <input type="text" id="lname" name="lname"></input>

              <br></br>

              <label htmlFor="email">Email</label> <br></br>
              <input type="email" id="email" name="email"></input>
 
              <br></br>

              <label htmlFor="pwd">Password</label> <br></br>
              <input type="password" name="pwd"></input>

              <br></br>

              <div>
                <button className="form-btn" type="submit" >Create</button>
                <button className="form-btn" type="reset">Reset</button>
              </div>

            </form>
          </div>
        </div>
    )
}

export default CreateAccount