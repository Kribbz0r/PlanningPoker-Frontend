import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./taskColumn.css";

interface Props {
    taskList: Task[]
    columnStatus: string
    updateTaskView: () => void
    projectName: string
    totalVotes: string
}

interface Task {
    "_id": string,
    "task": string,
    "status": string,
    "estimatedTime": number,
    "finalTime": number,
    "votes": number,
    "approvalvotes": number,
    "suggestedTimes": string[],
    "usersthathavevoted": string[],
    "disapproved": boolean,
    "usersthathaveapproved": string[]
}

function TaskColumn(props: Props) {

    const [estimatedTime, setEstimatedTime] = useState<{[key: string]: string}>({});
    const [finalTime, setFinalTime] = useState<{[key: string]: string}>({});
    const [jwtToken, setJwtToken] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    const handleSetTimeClick = (task: Task, ) => {  

        const numberPattern = /^(?:[1-9]|[1-3][0-9])$/;

        if (numberPattern.test(estimatedTime[task._id]) || numberPattern.test(finalTime[task._id])) {
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
                    "estimatedTime": task.estimatedTime !== null ? task.estimatedTime : estimatedTime[task._id],
                    "finalTime": finalTime === null ? task.finalTime : finalTime[task._id],
                    "votes": task.votes,
                    "approvalvotes": task.approvalvotes,
                    "suggestedTimes": task.suggestedTimes,
                    "usersthathavevoted": task.usersthathavevoted,
                    "disapproved": task.disapproved,
                    "usersthathaveapproved": task.usersthathaveapproved
                })
            }).then(res => {
                if(!res.ok) {
                  return res.text();
                } else {
                    return res.json();
                }
            }).catch(() => {
                props.updateTaskView();
                setEstimatedTime({})
                setFinalTime({});
    
            })
        } else {
            alert("Only numbers 1 - 40 may be entered as estimated or final time")
        }
    }

    function handleInputChange(_id: string, value: string, setEstimatedTime: Dispatch<SetStateAction<{ [key: string]: string; }>>): void {
        setEstimatedTime((prevEstimatedTime) => ({
            ...prevEstimatedTime, [_id]: value
        }));
    }

  return (
    <div id="taskColumnDiv">
            <h2>{props.columnStatus}</h2>
            {props.columnStatus === "Under Vote" ? 
            <table className="taskTables">
                    <thead>
                        <tr className="tasktTableRows">
                            <td>Task</td>
                            <td>Votes</td>
                            <td>Approved Votes</td>
                        </tr>
                    </thead>
                <tbody>
                {props.taskList.map((task:Task) => (
                    <tr key={task._id} className="tasktTableRows">
                        <td>{task.task}</td>
                        <td style={{color: task.votes.toString() !== props.totalVotes ? "red": "lightgreen"}}>{task.votes} / {props.totalVotes}</td>
                        <td style={{color: task.approvalvotes.toString() !== props.totalVotes ? "red": "lightgreen"}}>{task.approvalvotes} / {props.totalVotes}</td>
                    </tr>
                ))}
                </tbody>
            </table> :
            props.columnStatus === "Needs Attention" ? 
            <table className="taskTables">
                    <thead>
                        <tr className="taskTableRows" style={{borderBottom:"solid 1px gold"}}>
                            <td>Task</td>
                            <td>Suggested Times</td>
                            <td>Users</td>
                            <td>Enter Estimated Time</td>
                        </tr>
                    </thead>
                    <tbody>
                    {props.taskList.map((task:Task) => (
                        <tr className="taskTableRows">
                            <td>{task.task}</td>
                            <td>
                            {task.suggestedTimes.map((time: string) => (
                                <span key={time}>{time} hours<br/></span>
                            ))}
                            </td>
                            <td>
                            {task.usersthathavevoted?.map((user: string) => (
                                <span key={user}>{user}<br/></span>
                            ))}
                            </td>
                            <td>
                                <input placeholder="set estimated time" value={estimatedTime[task._id] || ""} onChange={(e)=> handleInputChange(task._id, e.target.value, setEstimatedTime)}/>
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
                             <td>Users</td>
                             <td>Estimated Time</td>
                         </tr>
                     </thead>
                 {props.taskList.map((task:Task) => (
                 <tbody>
                     <tr className="tasktTableRows">
                         <td>{task.task}</td>
                         <td>
                         {task.usersthathavevoted?.map((user: string) => (
                             <span key={user}>{user}<br/></span>
                         ))}
                         </td>
                         <td>{task.estimatedTime} hours</td>
                         <td>
                            <input placeholder="set final time" value={finalTime[task._id]} onChange={(e)=> handleInputChange(task._id, e.target.value, setFinalTime)}/>
                            <button type="button" onClick={() => handleSetTimeClick(task)}>Set</button>
                        </td>
                     </tr>
                 </tbody>))}
             </table> : 
             props.columnStatus === "Complete" ? 
             <table className="taskTables">
                     <thead>
                         <tr className="tasktTableRows">
                             <td>Task</td>
                             <td>Users</td>
                             <td>Estimated Time</td>
                             <td>Final Time</td>
                             <td>Time Difference</td>
                         </tr>
                     </thead>
                 {props.taskList.map((task:Task) => (
                 <tbody>
                     <tr className="tasktTableRows">
                         <td>{task.task}</td>
                         <td>
                         {task.usersthathavevoted?.map((user: string) => (
                             <span key={user}>{user}<br/></span>
                         ))}
                         </td>
                         <td>{task.estimatedTime} hours</td>
                         <td>{task.finalTime} hours</td>
                         <td style={{ color: task.estimatedTime >= task.finalTime ? "lightgreen" : "red"}}>
                         {Math.round(((task.finalTime - task.estimatedTime) / task.estimatedTime) * 100)}%
                         </td>
                     </tr>
                 </tbody>))} 
                </table> : null}
    </div>
  )
}

export default TaskColumn