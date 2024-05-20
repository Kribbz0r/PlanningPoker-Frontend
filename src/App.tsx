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
  const [email, setEmail] = useState<string>('')
  const [testUsers, setTestUsers] = useState<[User]>()
  const [password, setPassword] = useState<string>('')
  const frontPageImg = "https://cdn.pixabay.com/photo/2022/10/31/13/50/aces-7559882_960_720.png"

  /*useEffect(() => {
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
*/
  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>, email: string, password: string): void {
    e.preventDefault();
   

    fetch("https://goldfish-app-jlmay.ondigitalocean.app/security/login", { 
      method: "POST",
      headers: {"content-type": "application/json",
      "Origin":"*"
      }, 
      body: JSON.stringify({"email": email, "password":password})
    })
    .then(res=>{
      if (res.ok){
      res.json()
        .then(data=>{   
        console.log(data.token)
        
          console.log("Hejsan data.token")
          const token = data.token
          localStorage.setItem('jsonwebtoken', token)
        

        })
    
        } else {
          console.log("res är =" + res)
        }
})
  }

  return (
    <>
      <div className="header">
        <h1 className="header-text">Planning Poker</h1>
      </div>
    
      <div className="body"> 
      <img src={frontPageImg} className="frontPageImg"/>
       <div className="login"> 
          <input type="text" value={email} onChange= {((e)=> setEmail(e.target.value))}></input>
          <input type="text" value={password} onChange= {((e)=> setPassword(e.target.value))}></input>
          <button type="submit" onClick={(e)=> handleSubmit(e, email, password)}>Logga in</button>
          </div> 
          </div>
    
        
    </>
  )
}

export default App
