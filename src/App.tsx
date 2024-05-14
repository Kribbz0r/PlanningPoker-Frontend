import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [testUsers, setTestUsers] = useState<[string]>()

  useEffect(() => {
    fetch("http://localhost:8080/test/test", {
      method: "GET",
      headers: {
        "Origin": "*",
        "Content-Type": "application/json"
        //"Access-Control-Allow-Origin": "*"
      },
    })
      .then(res => res.json())
      .then(data => setTestUsers(data)
      )
  }, [])

  return (
    <>
      <h1>{testUsers}</h1>



    </>
  )
}

export default App
