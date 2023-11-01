import { React, useState } from "react"
import './ModifyItems.css'
import { useMutate, Methods } from "../../util/QueryHandler";
import Table from "../../components/Table";
import { api_url } from "../../resources/constants";

function ModifyItems({ entries, columns, editting,  projectNumber, projectName }) {
    const [originalItems, setOriginalItems] = useState(entries)
    const [changed, setChanged] = useState({})
    const [deleted, setDeleted] = useState([])

    const modifyItems = useMutate(
        String(api_url) + `/modify_project_items?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items_modified'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
            editting()
        })
    )

    const deleteItems = useMutate(
        String(api_url) + `/delete_project_items?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items_deleted'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
        })
    )

    function updateChanged(value, item, col) {
        var changedCopy = { ...changed }
        var itemCopy = { ...item }
        itemCopy[col] = value
        changedCopy[item['Name']] = itemCopy
        setChanged(changedCopy)
    }

    // Row coloring function
    function rowColor(item) {
        if (deleted.includes(item)) {
            return {backgroundColor: "red"}
        } else {
            return {}
        }
    }

    function cellFunc(item, col) {
        if (!deleted.includes(item)) {
            switch(col) {
                case "Quantity Needed":
                case "Quantity":
                    return (
                        <td key={String(item[col]) + String(col)}>
                            <div className="delete-wrapper">
                                <input type="number" defaultValue={item[col]} onChange={(event) => {updateChanged(event.target.value, item, col)}} className="input-box"></input>
                            </div>
                        </td>
                    )
                case "Delete":
                    return (
                        <td key={String(item[col]) + String(col)}>
                            <div className="delete-wrapper">
                                <button onClick={() => {setDeleted(deleted.concat([item]))}}>Delete</button>
                            </div>
                        </td>
                    )
                default:
                    return <td key={String(item[col]) + String(col)}>{item[col]}</td>
            }
        } else if (col === "Delete") {
            return (
                <td key={String(item[col]) + String(col)}>
                    <div className="delete-wrapper">
                        <button onClick={() => {setDeleted(deleted.filter((i) => {return i !== item}))}}>Undo</button>
                    </div>
                </td>)
        } else {
            return <td key={String(item[col]) + String(col)}>{item[col]}</td>
        }
    }

    // Rendering the page based on data
    if (modifyItems.isError || deleteItems.isError) {
        // If Error Occurred:
        return (
            <div>
                {modifyItems.isError ? modifyItems.error.message : deleteItems.error.message}
            </div>
        )
    } else {
        // If Successful:
        return (
            <div>
                <div className="add-items-wrapper">
                    <div className="projectTitle">{projectName}</div>
                    <Table
                        columns={columns.concat(["Delete"])}
                        shown={entries}
                        rowColoringLogic={rowColor}
                        cellFunc={cellFunc}/>
                    <button onClick={(event) => {modifyItems.mutate({'Entries': Object.values(changed)});deleteItems.mutate({'Entries': deleted})}}>Submit</button>
                </div>
            </div>
        )
    }
}

export default ModifyItems