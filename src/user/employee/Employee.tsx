import { useState, useEffect } from "react";
import Projects from "../admin/projects/Projects"

function Employee() {

  const [jwtToken, setJwtToken] = useState<string>("");
    

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
      
    }, [jwtToken]);


  return (
    <div>
      <Projects authority={""} setPage={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  )
}

export default Employee