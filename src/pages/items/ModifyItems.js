import { React, useState } from "react"
import './ModifyItems.css'
import { useMutate, Methods } from "../../util/QueryHandler";
import Table from "../../components/Table";
import { api_url } from "../../resources/constants";
import { useLoggedIn } from "../Login";

function ModifyItems({ entries, columns, editting, editCols, url}) {
    const [changed, setChanged] = useState({})
    const [deleted, setDeleted] = useState([])
    const loggedIn = useLoggedIn()

    const modifyItems = useMutate(
        String(api_url) + '/modify_' + url,
        Methods.Post,
        ['items_modified'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
            editting()
        })
    )

    const deleteItems = useMutate(
        String(api_url) + '/delete_' + url,
        Methods.Post,
        ['items_deleted'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
        })
    )

    function updateChanged(value, item, col, index) {
        var changedCopy = { ...changed }
        var itemCopy = {...item}
        if (changedCopy[index]) {
            itemCopy = changedCopy[index]
        }
        var newVal = value
        if(editCols[col] === 'number') {
            newVal = Number(value)
        }
        if(editCols[col] === 'string') {
            newVal = String(value)
        }
        itemCopy[col] = newVal
        changedCopy[index] = itemCopy
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

    function cellFunc(item, col, index) {
        if (!deleted.includes(item)) {
            if(Object.keys(editCols).includes(col)) {
                return (
                    <td key={String(item[col]) + String(col)}>
                        <div className="delete-wrapper">
                            <input type={editCols[col]}
                                defaultValue={item[col]}
                                onChange={(event) => {event.preventDefault();updateChanged(event.target.value, item, col, index)}} 
                                className="input-box"></input>
                        </div>
                    </td>
                )
            } else if (col === "Delete") {
                return (
                    <td key={String(item[col]) + String(col)}>
                        <div className="delete-wrapper">
                            <button onClick={() => {setDeleted(deleted.concat([item]))}}>{col}</button>
                        </div>
                    </td>
                )
            } else if (col === "Archive") {
                return (
                    <td key={String(item[col]) + String(col)}>
                        <div className="delete-wrapper">
                            <button disabled={!loggedIn()} onClick={() => {setDeleted(deleted.concat([item]))}}>{col}</button>
                        </div>
                    </td>
                )
            }
        } else if (col === "Delete" || col === "Archive") {
            return (
                <td key={String(item[col]) + String(col)}>
                    <div className="delete-wrapper">
                        <button onClick={() => {setDeleted(deleted.filter((i) => {return i !== item}))}}>Undo</button>
                    </div>
                </td>)
        }
        return <td key={String(item[col]) + String(col)}>{item[col]}</td>
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
                    <button onClick={(event) => {modifyItems.mutate({'Entries': Object.values(changed)});deleteItems.mutate({'Entries': deleted})}}>Submit</button>
                    <Table
                        columns={columns}
                        shown={entries}
                        rowColoringLogic={rowColor}
                        cellFunc={cellFunc}/>
                </div>
            </div>
        )
    }
}

export default ModifyItems