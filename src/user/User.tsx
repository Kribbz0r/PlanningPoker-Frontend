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
    const [jwtToken, setJwtToken] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    

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
      }).then(res => {
        if(!res.ok) {
          new Error("No user found!");
        }
        return res.json();
      }).then(data => {
        setUserAuthority(data.role);
        setUsername(data.name);
      }).catch((error) => {
        console.log(error)
      });
    }

  return (
    <div>
        <p>Hej {username}!</p>
        { userAuthority === "66446a0b97b346b20fd35b73" ? <Admin /> : <Employee /> }
    </div>
  )
}

export default User
