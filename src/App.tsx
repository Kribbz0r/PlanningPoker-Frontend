import { FormEvent, useEffect, useState } from 'react'
import './App.css'
// import LoginPage from './Bodies/loginPage'

interface User {
  "_id": string,
  "email": string,
  "name": string,
  "authorized": number,
  "role": string
}



function App() {
  const [email, setEmail] = useState<string>('')
  const [loginStatus, setLoginStatus] = useState<boolean>(true)
  // const [testUsers, setTestUsers] = useState<[User]>()
  const [password, setPassword] = useState<string>('')
  const frontPageImg = "https://cdn.pixabay.com/photo/2022/10/31/13/50/aces-7559882_960_720.png"

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>, email: string, password: string): void {
    e.preventDefault();


    fetch("https://goldfish-app-jlmay.ondigitalocean.app/security/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Origin": "*"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.ok) {
          res.text()
            .then(data => {
              console.log(data)
              const token = data
              localStorage.setItem('jsonwebtoken', token)
              setLoginStatus(true)
              setEmail("")
              setPassword("")
            })
        } else {
          console.log("The server could not return a string for you");
        }
      })
  }


  function handleLogOut(): void {
    localStorage.clear()
    setLoginStatus(false)
  }


  return (
    <>

      <div className="header" >
        {loginStatus === true ? <div className="loggedInHeader">  <h1 className='loggedInHeaderText'>Planning Poker</h1> <button onClick={handleLogOut} className='logoutBtn'>Logga ut</button> </div> :
          <div className='loggedOutHeader'> <h1 className="loggedOutHeaderText">Planning Poker</h1></div>}
      </div>

      <div className="body">
        <img src={frontPageImg} className="frontPageImg" />
        <div className="loginForm">
          <input type="text" value={email} onChange={((e) => setEmail(e.target.value))}></input>
          <input type="text" value={password} onChange={((e) => setPassword(e.target.value))}></input>
          <button type="submit" onClick={(e) => handleSubmit(e, email, password)}>Logga in</button>
        </div>
        <img src={frontPageImg} className="frontPageImg" />
      </div>

      {/* <div>
        {loginStatus === false ? <LoginPage/> :null}
      </div>
       */}


    </>
  )
}

export default App
