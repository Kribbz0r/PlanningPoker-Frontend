import { useEffect, useState } from 'react'
import TaskColumn from './taskColumn/TaskColumn';
import "./tasks.css";

interface Props {
    projectSelected: string
}

interface Task {
    "_id": string,
    "task": string,
    "status": string,
    "estimatedtime": number,
    "finaltime": number,
    "votes": number,
    "approvalvotes": number,
    "suggestedtimes": number[],
    "userthathavevoted": string[],
    "disapproved": boolean
}

function Tasks(props: Props) {

    const [underVoteTasks , setUnderVoteTasks ] = useState<Task[]>([]);
    const [needAttentionTasks , setNeedAttentionTasks ] = useState<Task[]>([]);
    const [inProgressTasks , setInProgressTasks] = useState<Task[]>([]);
    const [completeTasks , setCompleteTasks] = useState<Task[]>([]);
    const [message, setMessage] = useState<string[]>([])
    const [jwtToken, setJwtToken] = useState<string>("");
    const [updatePage, setUpdatePage] = useState<boolean>(false)
    
    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
        getTasks();
    }, [jwtToken, props.projectSelected]);

    const getTasks = () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/user/tasks";
        fetch(fetchHTTP, {
            method: "GET",
            headers: {
                "Authorization": jwtToken,
                "projectName": props.projectSelected
            }
        }).then(res => {
            if(!res.ok) {
              new Error("Unable to retrieve tasks.");
            }
            return res.json()
        .then(data => {
            const underVoteList: Task[] = []; 
            const needAttentionList: Task[] = []; 
            const inProgressList: Task[] = []; 
            const completeList: Task[] = []; 
            const errorList: string[] = [];
            data.map((task: Task) => {
                if(task.status === "undervote") {
                    underVoteList.push(task);
                } else if (task.status === "needattention") {
                    needAttentionList.push(task);
                } else if (task.status === "inprogress") {
                    inProgressList.push(task);
                } else if (task.status === "complete"){
                    completeList.push(task);
                } else (
                    errorList.push(task.task + " with id: " + task._id + " has no current status")
                )
                setUnderVoteTasks(underVoteList);
                setNeedAttentionTasks(needAttentionList);
                setInProgressTasks(inProgressList);
                setCompleteTasks(completeList);
                setMessage(errorList);
            })
        })
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        console.log(underVoteTasks);
        console.log(needAttentionTasks);
        console.log(inProgressTasks);
        console.log(completeTasks);
        console.log(message);
    }, [underVoteTasks])

    const updateTaskView = () => {
        setUpdatePage(prevUpdatePage => !prevUpdatePage)
    }

    useEffect (() => {
        getTasks()
    }, [updatePage])

  return (
    <>
    <h2>{props.projectSelected}</h2>
    { message[0] !== null ? <p>{message}</p> : null}
    <div id='taskColumnsDiv'>
        <TaskColumn taskList={underVoteTasks} columnStatus="Under Vote" projectName={props.projectSelected} getTasks={updateTaskView}/>
        <TaskColumn taskList={needAttentionTasks} columnStatus="Needs Attention" projectName={props.projectSelected} getTasks={updateTaskView}/>
        <TaskColumn taskList={inProgressTasks} columnStatus="In Progress" projectName={props.projectSelected} getTasks={updateTaskView}/>
        <TaskColumn taskList={completeTasks} columnStatus="Complete" projectName={props.projectSelected} getTasks={updateTaskView}/>
    </div>
    </>
  )
}

export default Tasks