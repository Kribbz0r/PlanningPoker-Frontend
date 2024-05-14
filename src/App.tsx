import { useEffect, useState } from 'react'
import './App.css'

interface User {
  "_id": string,
  "email": string,
  "name": string,
  "authorized": number,
  "role": string
}

function App() {
  const [testUsers, setTestUsers] = useState<[User]>()

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

  return (
    <>
      <h1>Hej {testUsers?.map(user => user.name).join(", ")}!</h1>
    </>
  )
}

export default App
