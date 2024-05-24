import {useEffect, useState } from 'react'
import Admin from './admin/Admin'
import Employee from './employee/Employee'

interface User {
  email: string,
  name: string,
  authorized: number,
  role: string
}

function User() {

    const [userAuthority, setUserAuthority] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [jwtToken, setJwtToken] = useState<string>("");
    

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
      getUserInformation();
    }, [jwtToken]);

    const getUserInformation = () => {
      const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/user/get-user";
      fetch(fetchHTTP, {
        method: "GET",
        headers: {
          "Authorization": jwtToken
        }
      }).then(res => res.json())
      .then(data => {
        setUserAuthority(data.role);
        setUsername(data.name);
      })
    }

  return (
    <div>
        <p>Hej {username}!</p>
        { userAuthority === "66446bd997b346b20fd35b74" ? <Employee /> : <Admin userAuthority={userAuthority}/> }
    </div>
  )
}

export default User
