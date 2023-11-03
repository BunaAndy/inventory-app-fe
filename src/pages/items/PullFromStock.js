import { React, useState } from "react"
import './ModifyItems.css'
import { useRequest, useMutate, Methods } from "../../util/QueryHandler";
import Table from "../../components/Table";
import { api_url } from "../../resources/constants";

function PullFromStock({ entries, columns, pulling, projectNumber }) {
    const [changed, setChanged] = useState({})
    const [inventoryStock, setInventoryStock] = useState({})

    const pullStock = useMutate(
        String(api_url) + `/pull_from_stock?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items_pulled'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
            pulling()
        })
    )

    const inventoryQuery = useRequest(
        String(api_url) + `/get_project_items?projectNumber=Inventory`,
        undefined,
        Methods.Get,
        ['stock'],
        // Data Population function, called in query handler
        ((data) => {
            var stock = {}
            data['entries'].forEach((item) => {
                var id = String(item['Barcode']) + String(item['Name']) + String(item['Catalog'])
                stock[id] = item['Quantity']
            })
            setInventoryStock(stock)
        })
    )

    function updateChanged(value, item, index) {
        var changedCopy = { ...changed }
        var itemCopy = {...item}
        if (value < 0) {
            itemCopy["Quantity"] = -1 * value
        } else {
            itemCopy["Quantity"] = value
        }
        changedCopy[index] = itemCopy
        setChanged(changedCopy)
    }
    
    const getID = (item) => {
        return String(item['Barcode']) + String(item['Name']) + String(item['Catalog'])
    }

    // Row coloring function
    function rowColor(item) {
        if (item['Quantity'] >= item['Quantity Needed']) {
            return {backgroundColor: "palegreen"}
        } else if (item['Quantity'] + inventoryStock[getID(item)] >= item['Quantity Needed']) {
            return {backgroundColor: "palegoldenrod"}
        } else {
            return {backgroundColor: "palevioletred"}
        }
    }

    function cellFunc(item, col, index) {
        var amount = inventoryStock[getID(item)]
        if (col === "Quantity to Pull") {
            if (!amount || amount <= 0) {
                return <td key={String(index) + String(col)}>No stock to pull</td>
            }
            return (
                <td key={String(item[col]) + String(col)}>
                    <div className="delete-wrapper">
                        <input type='number'
                            defaultValue={0}
                            onChange={(event) => {event.preventDefault();updateChanged(event.target.value, item, index)}} 
                            className="input-box"></input>
                    </div>
                </td>
            )
        } else if (col === "Quantity in Stock") {
            return <td key={String(index) + String(col)}>{amount || 0}</td>
        }
        return <td key={String(item[col]) + String(col)}>{item[col]}</td>
    }

    // Rendering the page based on data
    if (pullStock.isError || inventoryQuery.isError) {
        // If Error Occurred:
        return (
            <div>
                {pullStock.isError ? pullStock.error.message : inventoryQuery.error.message}
            </div>
        )
    } else {
        // If Successful:
        return (
            <div>
                <div className="add-items-wrapper">
                    <Table
                        columns={columns.concat(["Quantity in Stock", "Quantity to Pull"])}
                        shown={entries}
                        rowColoringLogic={rowColor}
                        cellFunc={cellFunc}/>
                    <button onClick={(event) => {
                            console.log(Object.values(changed));
                            pullStock.mutate({'Entries': Object.values(changed)});
                        }}>Submit</button>
                </div>
            </div>
        )
    }
}

export default PullFromStock