import { useState } from "react";
import Employees from "./employees/Employees";
import Projects from "./projects/Projects";
import CreateNewProject from "./createNewProject/CreateNewProject";
import "./admin.css"

interface Props {
  userAuthority: string
}


function Admin(props: Props) {
  
 const [page, setPage] = useState<string>("employees")

 const updatePageFromArchive = () => {
  setPage("employees");
 }

  return (
    <div id="adminContentDiv">
      <div className="adminButtonDiv">
        <button className="adminButton" onClick={() => setPage("employees")}>Employees</button>
        <button className="adminButton" onClick={() => setPage("projects")}>Projects</button>
        <button onClick={() => setPage("createNewProject")}>Create Project</button>
      </div>
      <div className="adminBody">
        {page === "employees" ? <Employees/> : page === "projects" ? <Projects authority={props.userAuthority} setPage={updatePageFromArchive}/> : <CreateNewProject/>  }
      </div>
    </div>
  
  )
}

export default Admin