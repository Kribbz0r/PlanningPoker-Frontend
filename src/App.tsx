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
        {loginStatus === true ? 
        <div className="loggedInHeader">  
          <h1 className='loggedInHeaderText'>Planning Poker</h1> 
          <button onClick={handleLogOut} className='logoutBtn'>Logga ut</button> 
        </div> 
        :
        <div className='loggedOutHeader'> 
          <h1 className="loggedOutHeaderText">Planning Poker</h1>
        </div>
        }
      </div>
      <div className="body">
        {loginStatus === false ? <LoginPage onLogin={handleLogin} /> : null}
        {loginStatus === true ? <User /> : null}
      </div>
    </>
  )
}

export default App
