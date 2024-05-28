import { useEffect, useState } from 'react';
import greenChip from "./images/greenChip.png"
import redChip from "./images/redChip.png"
import "./employees.css"

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
    <div id='employeesTableDiv'>
      <h2 id='employeesHeader'>Employees</h2>
      <table id='employeesTable'>
        <thead id='tableHeadEmployees'>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Access</td>
          </tr>
        </thead>
        <tbody id='tableBodyEmployees'>
          {employeesList.map((user: User) => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.authorized === 0 ? (
                  <div className='chipImageDiv'>
                    <img className='chipImage' src={redChip}/>
                    <div className='hoverText' onClick={() => handleClick(user.email)}>Grant Access</div>
                  </div>
                ) : (
                  <div className='chipImageDiv'>
                    <img className='chipImage' src={greenChip}/>
                    <div className='hoverText' onClick={() => handleClick(user.email)}>Remove Access</div>
                  </div>
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
