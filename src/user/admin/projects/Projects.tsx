import { useEffect, useState } from "react";
import Tasks from "./tasks/Tasks";

interface Projects {
  projects: string[];
}

interface Props {
  authority: string;
  setPage: () => void;
}

function Projects(props: Props) {
  const [projectList, setProjectList] = useState<string[]>([]);
  const [projectSelected, setProjectSelected] = useState<string>("");
  const [jwtTokenProjects, setJwtTokenProjects] = useState<string>("");

  useEffect(() => {
    const jsonwebtoken = localStorage.getItem("jsonwebtoken");
    if (jsonwebtoken) {
      setJwtTokenProjects(jsonwebtoken);
    }
  }, []);

  useEffect(() => {
    if (jwtTokenProjects) {
      getProjects();
    }
  }, [jwtTokenProjects]);

  const getProjects = async () => {
    try {
      const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/get-projects";
      const response = await fetch(fetchHTTP, {
        method: "GET",
        headers: {
          "Authorization": jwtTokenProjects,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to retrieve projects.");
      }
      const data = await response.json();
      setProjectList(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div>
      {projectList.map((project: string) => (
        <button key={project} onClick={() => setProjectSelected(project)}>
          {project}
        </button>
      ))}
      {projectSelected !== "" && (
        <Tasks
          projectSelected={projectSelected}
          authority={props.authority}
          setPage={props.setPage}
        />
      )}
    </div>
  );
}

export default Projects;
