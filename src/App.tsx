import { useState } from 'react';
import './App.css';
import LoginPage from './Login/LoginPage';


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
      </div>

    </>
  )
}

export default App
