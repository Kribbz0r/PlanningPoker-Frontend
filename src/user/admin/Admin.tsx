import { useState } from "react";
import Employees from "./employees/Employees";
import Projects from "./projects/Projects";
import CreateNewProject from "./createNewProject/CreateNewProject";

interface Props {
  userAuthority: string
}


function Admin(props: Props) {
  
 const [page, setPage] = useState<string>("employees")

  return (
    <div>
      <div className="adminButtonDiv">
        <button onClick={() => setPage("employees")}>Employees</button>
        <button onClick={() => setPage("projects")}>Projects</button>
        <button onClick={() => setPage("createNewProject")}>Create Project</button>
      </div>
      <div className="adminBody">
        {page === "employees" ? <Employees/> : page === "projects" ? <Projects authority={props.userAuthority}/> : <CreateNewProject/>  }
      </div>
    </div>
  
  )
}

export default Admin