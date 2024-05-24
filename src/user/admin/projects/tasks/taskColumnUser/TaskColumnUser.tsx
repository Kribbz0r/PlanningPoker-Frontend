import { useEffect, useState } from "react";
import "./taskColumnUser.css"


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
    "suggestedTimes": string[],
    "usersthathavevoted": string[],
    "disapproved": boolean,
    "usersthathaveapproved": string[]
}

function TaskColumnUser(props: Props) {
    const [jwtToken, setJwtToken] = useState<string>("");
    const [totalVotes, setTotalVotes] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    useEffect (() => {
        getTotalVotes();
        getUserInformation();
    }, [jwtToken])

    const getUserInformation = () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/user/get-user";
        fetch(fetchHTTP, {
          method: "GET",
          headers: {
            "Authorization": jwtToken
          }
        }).then(res => {
          if(!res.ok) {
            new Error("No user found!");
          }
          return res.json();
        }).then(data => {
          setUserEmail(data.email)
        });
      }
    
    const getTotalVotes = () => {
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
              setTotalVotes(data);
          });
    }

    const handleSelectedTimeClick = (task: Task, action: string) => {

        if (!task.usersthathavevoted) task.usersthathavevoted = [];
        if (!task.usersthathaveapproved) task.usersthathaveapproved = [];

        if (!task.usersthathavevoted.includes(userEmail)) {
            task.usersthathavevoted.push(userEmail);
            task.votes += 1;
            task.suggestedTimes.push(action);
        } else if (!task.usersthathaveapproved.includes(userEmail)) {
            task.usersthathaveapproved.push(userEmail);
            task.approvalvotes += 1;
            console.log(action);
            if (action === "true") {
                task.disapproved = true;
            } else if (task.disapproved === false && task.usersthathaveapproved.length === parseInt(totalVotes)) {
                task.estimatedTime = getAverageTime(task.suggestedTimes);
            }
        }
        
        console.log(task.usersthathaveapproved.length, totalVotes)
        console.log(task.approvalvotes, totalVotes);
        console.log(task.usersthathaveapproved);
        console.log(task.disapproved);

        const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/edit-task";
        fetch(fetchHTTP, {
            method: "PATCH",
            headers: {
                "Authorization": jwtToken,
                "projectName": props.projectName,
                "userEmail": userEmail,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "taskId": task._id,
                "task": task.task,
                "status": task.status,
                "estimatedTime": task.estimatedTime,
                "finalTime": task.finalTime,
                "votes": task.votes,
                "approvalvotes": task.approvalvotes,
                "suggestedTimes": task.suggestedTimes,
                "usersthathavevoted": task.usersthathavevoted,
                "disapproved": task.disapproved,
                "usersthathaveapproved": task.usersthathaveapproved
            })
        }).then(res => {
            if(!res.ok) {
              new Error("Unable to update estimated time");
              return res.text();
            } else {
                return res.json();
            }
        }).catch(() => {
            props.updateTaskView();
        });
    }

    function getAverageTime(suggestedTimes: string[]): number {

        if (suggestedTimes.length === 0) return 0;

        const numbers = suggestedTimes.map(str => parseInt(str));
        const sum = numbers.reduce((total, single) => total + single, 0);
        const averageTime = Math.round(sum / suggestedTimes.length);

        return averageTime;
    }

  return (
    <div id="taskColumnDiv">
        <h2>{props.columnStatus}</h2>
            {props.columnStatus === "Under Vote" ? 
            <table className="taskTables">
            <thead>
                <tr className="tasktTableRows">
                    <td>Task</td>
                    <td>Action Needed</td>
                </tr>
            </thead>
            {props.taskList.map((task: Task) => (
                <tbody key={task._id}>
                    <tr className="tasktTableRows">
                        <td>{task.task}</td>
                        <td>{task.usersthathaveapproved.includes(userEmail) && parseInt(totalVotes) !== task.approvalvotes ? (
                                "Waiting for approval votes"
                            ) : task.usersthathavevoted.includes(userEmail) && parseInt(totalVotes) === task.votes ? (
                                <>
                                    <span>Suggested Time: {getAverageTime(task.suggestedTimes)}</span>
                                    <button onClick={() => handleSelectedTimeClick(task, "false")}>Approve</button>
                                    <button onClick={() => handleSelectedTimeClick(task, "true")}>Disapprove</button>
                                </>
                            ) : task.usersthathavevoted.includes(userEmail) && parseInt(totalVotes) !== task.votes ? (
                                "Waiting for votes"
                            ) : (
                                <>
                                    <button onClick={() => handleSelectedTimeClick(task, "2")}>2 hours</button>
                                    <button onClick={() => handleSelectedTimeClick(task, "4")}>4 hours</button>
                                    <button onClick={() => handleSelectedTimeClick(task, "8")}>8 hours</button>
                                    <button onClick={() => handleSelectedTimeClick(task, "16")}>16 hours</button>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            ))}
        </table> : props.columnStatus === "In Progress" ? 
             <table className="taskTables">
                     <thead>
                         <tr className="tasktTableRows">
                             <td>Task</td>
                             <td>Estimated Time</td>
                         </tr>
                     </thead>
                 {props.taskList.map((task:Task) => (
                 <tbody>
                     <tr className="tasktTableRows">
                         <td>{task.task}</td>
                         <td>{task.estimatedTime} hours</td>
                     </tr>
                 </tbody>))}
             </table> : 
             props.columnStatus === "Complete" ? 
             <table className="taskTables">
                     <thead>
                         <tr className="tasktTableRows">
                             <td>Task</td>
                             <td>Estimated Time</td>
                             <td>Final Time</td>
                             <td>Time Difference</td>
                         </tr>
                     </thead>
                 {props.taskList.map((task:Task) => (
                 <tbody>
                     <tr className="tasktTableRows">
                         <td>{task.task}</td>
                         <td>{task.estimatedTime} hours</td>
                         <td>{task.finalTime} hours</td>
                         <td style={{ color: task.estimatedTime >= task.finalTime ? "green" : "red"}}>
                         {Math.round(((task.finalTime - task.estimatedTime) / task.estimatedTime) * 100)}%
                         </td>
                     </tr>
                 </tbody>))} 
                </table> : null}
    </div>
  )
}

export default TaskColumnUser