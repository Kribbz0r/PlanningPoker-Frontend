import { useEffect, useState } from "react";
import "./taskColumn.css";

interface Props {
    taskList: Task[]
    columnStatus: string
    getTasks: () => void
    projectName: string
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

function TaskColumn(props: Props) {

    const [estimatedTime, setEstimatedTime] = useState<string>("")
    const [jwtToken, setJwtToken] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    const handleSetTimeClick = (task: Task) => {       
    
        const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/edit-task";
        fetch(fetchHTTP, {
            method: "PATCH",
            headers: {
                "Authorization": jwtToken,
                "projectName": props.projectName,
                "userEmail": "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "taskId": task._id,
                "task": task.task,
                "status": task.status,
                "estimatedTime": estimatedTime,
                "finalTime": task.finaltime,
                "votes": task.votes,
                "approvalvotes": task.approvalvotes,
                "suggestedTimes": task.suggestedtimes,
                "usersthathavevoted": task.userthathavevoted,
                "disapproved": task.disapproved
            })
        }).then(res => {
            if(!res.ok) {
              new Error("Unable to update estimated time");
              return res.text();
            } else {
                return res.json();
            }
          }).then(data => {
            console.log(data);
            props.getTasks();
          }).catch((error) => {
            console.log(error)
          });
    }

  return (
    <div id="taskColumnDiv">
            <h2>{props.columnStatus}</h2>
            <>
            {props.columnStatus === "Under Vote" ? 
            <table className="taskTables">
                
                    <thead>
                        <tr className="tasktTableRows">
                            <td>Task</td>
                            <td>Votes</td>
                            <td>Approved Votes</td>
                        </tr>
                    </thead>
                
                {props.taskList.map((task:Task) => (
                <tbody>
                    <tr className="tasktTableRows">
                        <td>{task.task}</td>
                        <td>{task.votes}</td>
                        <td>{task.approvalvotes}</td>
                    </tr>
                </tbody>))}
            </table> :
            props.columnStatus === "Needs Attention" ? 
            <table className="taskTables">
                    <thead>
                        <tr className="tasktTableRows">
                            <td>Task</td>
                            <td>Suggested Times</td>
                            <td>Users</td>
                            <td>Enter Estimated Time</td>
                        </tr>
                    </thead>
                    <tbody>
                    {props.taskList.map((task:Task) => (
                        <tr className="tasktTableRows">
                            <td>{task.task}</td>
                            <td>
                            {task.suggestedtimes.map((time: number) => (
                                <span key={time}>{time} hours<br/></span>
                            ))}
                            </td>
                            <td>
                            {task.userthathavevoted.map((user: string) => (
                                <span key={user}>{user}<br/></span>
                            ))}
                            </td>
                            <td>
                                <input placeholder="set estimated time" value={estimatedTime} onChange={(e)=> setEstimatedTime(e.target.value)}/>
                                <button type="button" onClick={() => handleSetTimeClick(task)}>Set</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> :
             props.columnStatus === "In Progress" ? 
             <table className="taskTables">
                     <thead>
                         <tr className="tasktTableRows">
                             <td>Task</td>
                             <td>Suggested Times</td>
                             <td>Users</td>
                         </tr>
                     </thead>
                 {props.taskList.map((task:Task) => (
                 <tbody>
                     <tr className="tasktTableRows">
                         <td>{task.task}</td>
                         <td>
                         {task.suggestedtimes.map((time: number) => (
                             <span key={time}>{time} hours<br/></span>
                         ))}
                         </td>
                         <td>
                         {task.userthathavevoted.map((user: string) => (
                             <span key={user}>{user}<br/></span>
                         ))}
                         </td>
                         <td>{task.estimatedtime}</td>
                     </tr>
                 </tbody>))}
             </table> : null }
            </>
    </div>
  )
}

export default TaskColumn