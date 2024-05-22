
interface Props {
    taskList: Task[]
    columnStatus: string
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
    "usersthathavevoted": string[],
    "disapproved": boolean
}

function TaskColumn(props: Props) {
  return (
    <div>
            <h2>{props.columnStatus}</h2>
            <>
            {props.columnStatus === "Under Vote" ? 
            <table>
                <thead>
                    <tr>
                        <td>Task</td>
                        <td>Votes</td>
                        <td>Approved Votes</td>
                    </tr>
                </thead>
                {props.taskList.map((task:Task) => (
                <tbody>
                    <tr>
                        <td>{task.task}</td>
                        <td>{task.votes}</td>
                        <td>{task.approvalvotes}</td>
                    </tr>
                </tbody>))}
            </table> : null }
            </>
    </div>
  )
}

export default TaskColumn