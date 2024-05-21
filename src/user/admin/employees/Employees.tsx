import React, { useEffect, useState } from 'react';


interface User {
    email: string,
    name: string,
    authorized: number,
    role: string
  }


function Employees() {
   const [employeesList, setEmployeesList] = useState<User[]>([])
   const [jwtToken, setJwtToken] = useState<string>("");
   
   useEffect (() => {
    let jsonwebtoken: string | null = "";
    if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
        jsonwebtoken = localStorage.getItem("jsonwebtoken");
        setJwtToken(jsonwebtoken!);
    }
}, []);

useEffect (() => {
  getUsers();
}, [jwtToken]);



   const getUsers= async()=>{
   await fetch("https://goldfish-app-jlmay.ondigitalocean.app/user/all-users", {
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
      const parsedData: User[]=data
      setEmployeesList(parsedData); 
      console.log(employeesList) 
      console.log("Hallåååå!!")
    }).catch((error) => {
      console.log(error)
    });
   }

   const handleClick= async(email:string)=>{
    await fetch ("https://goldfish-app-jlmay.ondigitalocean.app/user/change-access", {
        method: "PATCH",
        headers: {
            "Authorization": jwtToken,
            "userEmail": email
          }
           }).then(res => {
            if(!res.ok) {
              new Error("Unable to update user access!");
            }
            return res.text();
          }).then(data => {
            console.log(data)
            getUsers();
          }).catch((error) => {
            console.log(error)
          });
           
}



    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Name </td>
                        <td>Email </td>
                        <td>Access</td>
                    </tr>
                </thead>
                <tbody>
                    {employeesList?.map((user:User)=>(
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.authorized===0?<button onClick={()=>handleClick(user.email)}>Go</button>:
                            <button onClick={()=>handleClick(user.email)}>Stop</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Employees;