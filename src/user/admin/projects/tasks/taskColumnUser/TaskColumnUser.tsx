import { useEffect, useState } from "react";
import "./taskColumnUser.css"
import greenTick from "./images/greenTick.png"
import redCross from "./images/redCross.png"
import twoHours from "./images/twoHours.png"
import fourHours from "./images/fourHours.png"
import eightHours from "./images/eightHours.png"
import sixteenHours from "./images/sixteenHours.png"


interface Props {
    taskList: Task[]
    columnStatus: string
    updateTaskView: () => void
    projectName: string
    totalVotes: string
    userEmail: string
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
    const [jwtTokenTaskColumnUser, setJwtToken] = useState<string>("");

    useEffect (() => {
        let jsonwebtoken: string | null = "";
        if(localStorage.getItem("jsonwebtoken") && jsonwebtoken !== null) {
            jsonwebtoken = localStorage.getItem("jsonwebtoken");
            setJwtToken(jsonwebtoken!);
        }
    }, []);

    const handleSelectedTimeClick = (task: Task, action: string) => {

        if (!task.usersthathavevoted) task.usersthathavevoted = [];
        if (!task.usersthathaveapproved) task.usersthathaveapproved = [];

        if (!task.usersthathavevoted.includes(props.userEmail)) {
            task.usersthathavevoted.push(props.userEmail);
            task.votes += 1;
            task.suggestedTimes.push(action);
        } else if (!task.usersthathaveapproved.includes(props.userEmail)) {
            task.usersthathaveapproved.push(props.userEmail);
            task.approvalvotes += 1;
            if (action === "true") {
                task.disapproved = true;
            } else if (task.disapproved === false && task.usersthathaveapproved.length === parseInt(props.totalVotes)) {
                task.estimatedTime = getAverageTime(task.suggestedTimes);
            }
        }

        const fetchHTTP = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/edit-task";
        fetch(fetchHTTP, {
            method: "PATCH",
            headers: {
                "Authorization": jwtTokenTaskColumnUser,
                "projectName": props.projectName,
                "userEmail": props.userEmail,
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
                    <td className="tdUnderVote">Action Needed</td>
                </tr>
            </thead>
            {props.taskList.map((task: Task) => (
                <tbody key={task._id}>
                    <tr className="tasktTableRows">
                        <td>{task.task}</td>
                        <td className="tdUnderVote">{task.usersthathaveapproved.includes(props.userEmail) && parseInt(props.totalVotes) !== task.approvalvotes ? (
                                "Waiting for approval votes"
                            ) : task.usersthathavevoted.includes(props.userEmail) && parseInt(props.totalVotes) === task.votes ? (
                                <>
                                    <span className="suggestedTimesSpan">Suggested Time: {getAverageTime(task.suggestedTimes)}</span>
                                    <img className="tickCross" src={greenTick} alt="Disapprove suggested time." title="Dispprove suggested time." onClick={() => handleSelectedTimeClick(task, "false")}/>
                                    <img className="tickCross" src={redCross} alt="Approve suggested time." title="Approve suggested time." onClick={() => handleSelectedTimeClick(task, "true")}/>
                                </>
                            ) : task.usersthathavevoted.includes(props.userEmail) && parseInt(props.totalVotes) !== task.votes ? (
                                "Waiting for votes"
                            ) : (
                                <div id="cardsDiv">
                                    <div className="cards">
                                        <img src={twoHours}/>
                                        <div className='hoverTextCard' onClick={() => handleSelectedTimeClick(task, "2")}>2 hours</div>
                                    </div>
                                    <div className="cards">
                                        <img src={fourHours}/>
                                        <div className='hoverTextCard' onClick={() => handleSelectedTimeClick(task, "4")}>4 hours</div>
                                    </div>
                                    <div className="cards">
                                        <img src={eightHours}/>
                                        <div className='hoverTextCard' onClick={() => handleSelectedTimeClick(task, "8")}>8 hours</div>
                                    </div>
                                    <div className="cards">
                                        <img src={sixteenHours}/>
                                        <div className='hoverTextCard' onClick={() => handleSelectedTimeClick(task, "16")}>16 hours</div>
                                    </div>
                                </div>
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
                         <td style={{ color: task.estimatedTime >= task.finalTime ? "lightgreen" : "red"}}>
                         {Math.round(((task.finalTime - task.estimatedTime) / task.estimatedTime) * 100)}%
                         </td>
                     </tr>
                 </tbody>))} 
                </table> : null}
    </div>
  )
}

export default TaskColumnUser