import { useState, useEffect } from "react";

function CreateNewProject() {

    const [jwtToken, setJwtToken] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [projectCreated, setProjectCreated] = useState<boolean>(false);
    const [taskName, setTaskName] = useState<string>("");
    const [taskList, setTaskList] = useState<string[]>([]);
   
   useEffect (() => {
    let jsonwebtoken: string | null = "";
    if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
        jsonwebtoken = localStorage.getItem("jsonwebtoken");
        setJwtToken(jsonwebtoken!);
    }
    }, []);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (projectCreated === true) {
            let updatedTaskList: string[] = taskList;
            updatedTaskList.push(taskName);
            setTaskList(updatedTaskList);
            setTaskName("");
        } else {
            setProjectCreated(true);
            setMessage("Project name " + projectName + " confirmed, now add your tasks.")
        }
    }

    const createNewProjectFetch = async () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/new-project";
        await fetch(fetchHTTP, {
            method: "PATCH",
            headers: {
                "Authorization": jwtToken,
                "projectName": projectName,
            }
        }).then(res => {
            if(!res.ok) {
              new Error("Unable to create project");
            }
            return res.text();
          }).catch((error) => {
            console.log(error)
          });
    }

    async function submitNewTaskFetch(taskName: string) {

        if (taskName.trim() !== "") {
            const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/new-task";
            await fetch(fetchHTTP, {
                method: "POST",
                headers: {
                    "Authorization": jwtToken,
                    "projectName": projectName,
                    "taskName": taskName
                }
            }).then(res => {
                if(!res.ok) {
                  new Error("Unable to submit task.");
                }
                return res.text();            
              }).catch((error) => {
                console.log(error)
              });
        }
    }

    async function handleReleaseProjectClick(): Promise<void> {
        await createNewProjectFetch();
        taskList.map((taskName: string) => (
            submitNewTaskFetch(taskName)
        ));
        setProjectCreated(false);
        setProjectName("");
        setTaskList([]);
        setTaskName("");
        setMessage("");
    }

    return (
        <>
            <p>{message}</p>
            {!projectCreated ? <form onSubmit={(e) => handleSubmit(e)}>
                <h3>Create New Project</h3>
                <input placeholder="Project Name" value={projectName} onChange={((e) => setProjectName(e.target.value))}/>
                <button type="submit">Submit</button>
            </form>  : 
            <form onSubmit={(e) => handleSubmit(e)}>
                <input className="taskInput" placeholder="task" value={taskName} onChange={((e) => setTaskName(e.target.value))}/>
                <button type="submit">Add task</button>
            </form>}
            <ul>
            { taskList.length > 0 ? taskList.map((taskName: string) => (
                <li key={taskName}>{taskName}</li>
            )) : null}
            </ul>
            { taskList.length > 0 ? <button type="button" onClick={handleReleaseProjectClick}>Release Project</button> : null}
            
        </>
    );
}

export default CreateNewProject;
