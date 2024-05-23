import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./taskColumn.css";

interface Props {
    taskList: Task[]
    columnStatus: string
    updateTaskView: () => void
    projectName: string
}

interface Task {
    "_id": string,
    "task": string,
    "status": string,
    "estimatedTime": number,
    "finalTime": number,
    "votes": number,
    "approvalvotes": number,
    "suggestedTimes": number[],
    "userthathavevoted": string[],
    "disapproved": boolean
}

function TaskColumn(props: Props) {

    const [estimatedTime, setEstimatedTime] = useState<{[key: string]: string}>({});
    const [jwtToken, setJwtToken] = useState<string>("");
    const [finalTime, setFinalTime] = useState<{[key: string]: string}>({});
    const [totalVotes, setTotalVotes] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
        getTotalVotes();
    }, [jwtToken])
    
    const getTotalVotes = () => {
        console.log(jwtToken);
        const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/user/number-with-access";
        fetch(fetchHTTP, {
            method: "GET",
            headers: {
                "Authorization": jwtToken
            }
        }).then(res => {
            if(!res.ok) {
                new Error("Unable to update estimated time");
            }
            return res.text();
            }).then(data => {
              console.log(data);
              setTotalVotes(data);
          }).catch((error) => {
              console.log(error)
          });
    }

    const handleSetTimeClick = (task: Task, ) => {       
        // const id = task._id
        // if (task.estimatedTime !== null) {
        //     setEstimatedTime({id, value})
        // }

        console.log(estimatedTime[task._id])
    
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
        }).catch((error) => {
            props.updateTaskView();
            setEstimatedTime({})
            setFinalTime({});
            console.log(error)
        });
    }

    function handleInputChange(_id: string, value: string, setEstimatedTime: Dispatch<SetStateAction<{ [key: string]: string; }>>): void {
        setEstimatedTime((prevEstimatedTime) => ({
            ...prevEstimatedTime, [_id]: value
        }));
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
                        <td style={{color: task.votes.toString() !== totalVotes ? "red": "green"}}>{task.votes} / {totalVotes}</td>
                        <td style={{color: task.approvalvotes.toString() !== totalVotes ? "red": "green"}}>{task.approvalvotes} / {totalVotes}</td>
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
                            {task.suggestedTimes.map((time: number) => (
                                <span key={time}>{time} hours<br/></span>
                            ))}
                            </td>
                            <td>
                            {task.userthathavevoted.map((user: string) => (
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
                         {task.userthathavevoted.map((user: string) => (
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
                         {task.userthathavevoted.map((user: string) => (
                             <span key={user}>{user}<br/></span>
                         ))}
                         </td>
                         <td>{task.estimatedTime} hours</td>
                         <td>{task.finalTime} hours</td>
                         <td style={{ color: task.estimatedTime >= task.finalTime ? "green" : "red"}}>
                         {Math.round(((task.finalTime - task.estimatedTime) / task.estimatedTime) * 100)}%
                         </td>
                     </tr>
                 </tbody>))} 
                </table> : null}
            </>
    </div>
  )
}

export default TaskColumn