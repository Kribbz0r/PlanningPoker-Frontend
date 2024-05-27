import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  authorized: number;
  role: string;
}

function Employees() {
  const [employeesList, setEmployeesList] = useState<User[]>([]);
  const [jwtTokenEmployees, setJwtTokenAdmin] = useState<string>('');

  useEffect(() => {
    const jsonwebtoken = localStorage.getItem('jsonwebtoken');
    if (jsonwebtoken) {
      setJwtTokenAdmin(jsonwebtoken);
    }
  }, []);

  useEffect(() => {
    if (jwtTokenEmployees) {
      getUsers();
    }
  }, [jwtTokenEmployees]);

  const getUsers = async () => {
    try {
      const response = await fetch("https://goldfish-app-jlmay.ondigitalocean.app/user/all-users", {
        method: "GET",
        headers: {
          "Authorization": jwtTokenEmployees,
        },
      });
      if (!response.ok) {
        throw new Error("No user found!");
      }
      const data = await response.json();
      setEmployeesList(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleClick = async (email: string) => {
    try {
      const response = await fetch("https://goldfish-app-jlmay.ondigitalocean.app/user/change-access", {
        method: "PATCH",
        headers: {
          "Authorization": jwtTokenEmployees,
          "userEmail": email,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to update user access!");
      }
      await response.text();
      getUsers();
    } catch (error) {
      console.error('Error updating user access:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Access</td>
          </tr>
        </thead>
        <tbody>
          {employeesList.map((user: User) => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.authorized === 0 ? (
                  <button onClick={() => handleClick(user.email)}>Go</button>
                ) : (
                  <button onClick={() => handleClick(user.email)}>Stop</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
