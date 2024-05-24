import { useEffect, useState } from "react";
import Tasks from "./tasks/Tasks";

interface Projects {
    projects: string[]
}

function Projects() {
    
    const [projectList, setProjectList] = useState<string[]>([]);
    const [projectSelected, setProjectSelected] = useState<string>("");
    const [jwtToken, setJwtToken] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
        getProjects();
    }, [jwtToken]);

    const getProjects = () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/get-projects";
        fetch(fetchHTTP, {
            method: "GET",
            headers: {
                "Authorization": jwtToken
            }
        }).then(res => {
            if(!res.ok) {
              new Error("Unable to retrieve projects.");
            }
            return res.json()
        .then(data => {
            setProjectList(data.projects);
        })
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect (() => {
        console.log(projectList)
    }, [projectList]);

    return (
        <div>
            { projectList?.map((project: string) => (
                <button key={project} onClick={() => setProjectSelected(project)}>{project}</button>
            ))
            }
            { projectSelected !== "" ? <Tasks projectSelected={projectSelected}/> : null}
        </div>
    );
}

export default Projects;