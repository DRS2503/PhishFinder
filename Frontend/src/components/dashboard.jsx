import { useState, useEffect } from 'react';
import Dropzone from '../components/Dropzone';
import { useAuth } from '../Context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function DashBoard() {
  const [error,setError] = useState("")
  const { currentUser, logout } = useAuth()
  const nav = useNavigate()

  async function handleLogout() {
    setError('')

    try{
      await logout()
      nav('/login')
    }catch{
      setError('Failed to log out')
    }

  }
  return (
    <div className='container'>
      <h1>Profile</h1>
      <div className="login-box">
        <div style={{marginBottom: '20px'}}>
          <strong style={{marginBottom: '20px'}}>Email: </strong> 
          {currentUser.email}
        </div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}
