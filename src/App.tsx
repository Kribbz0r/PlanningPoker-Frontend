import { useState } from 'react';
import './App.css';
import LoginPage from './Login/LoginPage';
import User from './user/User';


function App() {

  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  
  function handleLogOut(): void {
    localStorage.clear()
    setLoginStatus(false)
  }

  function handleLogin(): void {
    setLoginStatus(true);
  }

  return (
    <>
      <div className="header" >
        <div className="loggedInHeader">  
          <h1 className='loggedInHeaderText'>Planning Poker</h1> 
        {loginStatus === true ? 
          <button onClick={handleLogOut} title="Log out" className='logoutBtn'>Log out</button> : null }
        </div> 
      </div>
      <div className="body">
        {loginStatus === false ? <LoginPage onLogin={handleLogin} /> : null}
        {loginStatus === true ? <User /> : null}
      </div>
    </>
  )
}

export default App
