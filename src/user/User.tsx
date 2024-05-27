import { useEffect, useState } from 'react';
import Admin from './admin/Admin';
import Employee from './employee/Employee';

interface User {
  email: string;
  name: string;
  authorized: number;
  role: string;
}

function User() {
  const [userAuthority, setUserAuthority] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [jwtToken, setJwtToken] = useState<string>("");

  useEffect(() => {
    const jsonwebtoken = localStorage.getItem("jsonwebtoken");
    if (jsonwebtoken) {
      setJwtToken(jsonwebtoken);
    }
  }, []);

  useEffect(() => {
    if (jwtToken) {
      getUserInformation();
    }
  }, [jwtToken]);

  const getUserInformation = async () => {
    try {
      const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/user/get-user";
      const response = await fetch(fetchHTTP, {
        method: "GET",
        headers: {
          "Authorization": jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to retrieve user information.");
      }
      const data = await response.json();
      setUserAuthority(data.role);
      setUsername(data.name);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  return (
    <div>
      <p>Hej {username}!</p>
      {userAuthority === "66446bd997b346b20fd35b74" ? (
        <Employee />
      ) : (
        <Admin userAuthority={userAuthority} />
      )}
    </div>
  );
}

export default User;
