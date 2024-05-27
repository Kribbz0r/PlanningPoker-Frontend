import { useEffect, useState } from 'react';
import TaskColumn from './taskColumn/TaskColumn';
import "./tasks.css";
import TaskColumnUser from './taskColumnUser/TaskColumnUser';

interface Props {
    projectSelected: string;
    authority: string;
    setPage: () => void;
}

interface Task {
    "_id": string;
    "task": string;
    "status": string;
    "estimatedTime": number;
    "finalTime": number;
    "votes": number;
    "approvalvotes": number;
    "suggestedTimes": string[];
    "usersthathavevoted": string[];
    "disapproved": boolean;
    "usersthathaveapproved": string[];
}

function Tasks(props: Props) {

    const [underVoteTasks , setUnderVoteTasks ] = useState<Task[]>([]);
    const [needAttentionTasks , setNeedAttentionTasks ] = useState<Task[]>([]);
    const [inProgressTasks , setInProgressTasks] = useState<Task[]>([]);
    const [completeTasks , setCompleteTasks] = useState<Task[]>([]);
    const [message, setMessage] = useState<string[]>([]);
    const [jwtTokenTasks, setJwtToken] = useState<string>("");
    const [updatePage, setUpdatePage] = useState<boolean>(false);
    const [archived, setArchived] = useState<boolean>(false);
    const [totalVotes, setTotalVotes] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect(() => {
        const jsonwebtoken = localStorage.getItem("jsonwebtoken");
        if (jsonwebtoken) {
            setJwtToken(jsonwebtoken);
        }
    }, []);

    useEffect(() => {
        if (jwtTokenTasks) {
            getTasks();
        }
    }, [jwtTokenTasks, props.projectSelected, updatePage]);

    useEffect(() => {
        if (props.authority !== "") {
            getTotalVotes();
        } else {
            getUserInformation();
        }
    }, [jwtTokenTasks]);

    const getUserInformation = () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/user/get-user";
        fetch(fetchHTTP, {
          method: "GET",
          headers: {
            "Authorization": jwtTokenTasks
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
                "Authorization": jwtTokenTasks
            }
        }).then(res => res.text())
            .then(data => {
              setTotalVotes(data);
          });
    };

    const getTasks = () => {
        const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/get-tasks";
        fetch(fetchHTTP, {
            method: "GET",
            headers: {
                "Authorization": jwtTokenTasks,
                "projectName": props.projectSelected
            }
        }).then(res => {
            if(!res.ok) {
                throw new Error("Unable to retrieve tasks.");
            }
            return res.json();
        })
        .then(data => {
            const underVoteList: Task[] = []; 
            const needAttentionList: Task[] = []; 
            const inProgressList: Task[] = []; 
            const completeList: Task[] = []; 
            const errorList: string[] = [];
            data.forEach((task: Task) => {
                if(task.status === "undervote") {
                    underVoteList.push(task);
                } else if (task.status === "needattention") {
                    needAttentionList.push(task);
                } else if (task.status === "inprogress") {
                    inProgressList.push(task);
                } else if (task.status === "complete") {
                    completeList.push(task);
                } else {
                    errorList.push(task.task + " with id: " + task._id + " has no current status");
                }
            });
            setUnderVoteTasks(underVoteList);
            setNeedAttentionTasks(needAttentionList);
            setInProgressTasks(inProgressList);
            setCompleteTasks(completeList);
            setMessage(errorList);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            setMessage(["Error fetching tasks:", error.message]);
        });
    };

    const updateTaskView = () => {
        setUpdatePage(prevUpdatePage => !prevUpdatePage);
    };

    const handleArchiveProjectClick = (projectSelected: string) => {
        const confirmed = window.confirm(`Are you sure you want to archive the project "${projectSelected}"?`);
    
        if (confirmed) {
            const fetchHTTP: string = "https://goldfish-app-jlmay.ondigitalocean.app/tasks/archive-project";
            fetch(fetchHTTP, {
                method: "PATCH",
                headers: {
                    "Authorization": jwtTokenTasks,
                    "projectName": projectSelected
                }
            }).then(res => {
                if(!res.ok) {
                    throw new Error("Unable to retrieve tasks.");
                }
                return res.text();
            })
            .then(() => {
                setArchived(true);
                props.setPage();
            })
            .catch(error => {
                console.error('Error archiving project:', error);
                setMessage(["Error archiving project:", error.message]);
            });
        } 
    };

    return (
        <>
            <h2>{props.projectSelected}</h2>
            { message[0] !== null ? <p>{message}</p> : null}
            <div id='taskColumnsDiv'>
                {props.authority === "66446a0b97b346b20fd35b73" ? (
                    <TaskColumn
                        totalVotes={totalVotes}
                        taskList={underVoteTasks}
                        columnStatus="Under Vote"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                    />
                ) : (
                    <TaskColumnUser
                        totalVotes={totalVotes}
                        taskList={underVoteTasks}
                        columnStatus="Under Vote"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                        userEmail={userEmail}
                    />
                )}
                {props.authority === "66446a0b97b346b20fd35b73" ? (
                    <TaskColumn
                        totalVotes={totalVotes}
                        taskList={needAttentionTasks}
                        columnStatus="Needs Attention"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                    />
                ) : null }
                {props.authority === "66446a0b97b346b20fd35b73" ? (
                    <TaskColumn
                        totalVotes={totalVotes}
                        taskList={inProgressTasks}
                        columnStatus="In Progress"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                    />
                ) : (
                    <TaskColumnUser
                        totalVotes={totalVotes}
                        taskList={inProgressTasks}
                        columnStatus="In Progress"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                        userEmail={userEmail}
                    />
                )}
                {props.authority === "66446a0b97b346b20fd35b73" ? (
                    <TaskColumn
                        totalVotes={totalVotes}
                        taskList={completeTasks}
                        columnStatus="Complete"
                        projectName={props.projectSelected}
                        updateTaskView={updateTaskView}
                    />
                ) : (
                    <TaskColumnUser
                        totalVotes={totalVotes}
                        taskList={completeTasks}
                        columnStatus="Complete" 
                        projectName={props.projectSelected} 
                        updateTaskView={updateTaskView}
                        userEmail={userEmail}/>)}
                </div>
                {props.authority === "66446a0b97b346b20fd35b73" ? 
                    <button onClick={() => handleArchiveProjectClick(props.projectSelected)}>Archive Project</button> 
                    :
                    null }
                {archived === true ? <p>{props.projectSelected} has been arvhived.</p> : null}
        </>
  )
}

export default Tasks
