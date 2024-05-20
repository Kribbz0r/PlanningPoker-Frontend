import { FormEvent, useEffect, useState } from 'react'
import './App.css'

interface User {
  "_id": string,
  "email": string,
  "name": string,
  "authorized": number,
  "role": string
}

function App() {
  const [username, setUsername] = useState<string>()
  const [testUsers, setTestUsers] = useState<[User]>()
  const [password, setPassword] = useState<string>()
  const frontPageImg = "https://cdn.pixabay.com/photo/2022/10/31/13/50/aces-7559882_960_720.png"

  useEffect(() => {
    fetch("https://goldfish-app-jlmay.ondigitalocean.app/test/test", {
      method: "GET",
      headers: {
        "Origin": "https://walrus-app-zcpnz.ondigitalocean.app/",
        "Content-Type": "application/json"
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(testUsers)
        setTestUsers(data)
      }
      )
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
   //fetch("https://goldfish-app-jlmay.ondigitalocean.app/test/test")
   alert("Jag är ett fromulär" + username + password)
  }

  return (
    <>
      <div className="header">
        <h1 className="header-text">Planning Poker</h1>
      </div>
    
      <div className="body"> 
      <img src={frontPageImg} className="frontPageImg"/>
        <form onSubmit ={handleSubmit} className="login" >
          <input type="text" value={username} onChange= {((e)=> setUsername(e.target.value))}></input>
          <input type="text" value={password} onChange= {((e)=> setPassword(e.target.value))}></input>
          <button type="submit">Logga in</button>
          
        </form>
      </div>
        
    </>
  )
}

export default App
