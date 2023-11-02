import { React, useState } from "react"
import Form from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { inventory_list_schema, items_schema } from "../../resources/schemas";
import './AddProjectItems.css'
import { api_url } from "../../resources/constants";
import { useMutate, Methods, useRequest } from "../../util/QueryHandler";

function AddProjectItems({ projectNumber, changeAdding }) {
    const [itemList, setItemList] = useState([])
    const validator = customizeValidator()
    const [scanned, setScanned] = useState('')
    const getBarcode = useRequest(
        String(api_url) + `/get_item?barcode=${scanned}&projectNumber=${projectNumber}`,
        undefined,
        Methods.Get,
        ['item'],
        // Data population function, called in query handler
        ((data) => {
            setItemList(itemList.concat(data['entries']))
            setScanned('')
        })
    )

    const addItems = useMutate(
        String(api_url) + `/add_project_items?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
        })
    )

    const incrementItems = useMutate(
        String(api_url) + `/increment_project_items?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
        })
    )

    function onBarcodeEnter(key) {
        if (key === 'Enter') {
            getBarcode.refetch()
        }
    }

    function onSubmit({ formData }) {
        formData['Entries'].forEach(element => {
            for (var col in element) {
                if(element[col] === undefined) {
                    element[col] = ''
                }   
            }
            if (element['Quantity Needed'] === undefined) {
                element['Quantity Needed'] = 0
            }
        });
        console.log(formData)
        incrementItems.mutate(formData)
        addItems.mutate(formData)
        changeAdding()
    }

    if(incrementItems.isLoading || addItems.isLoading) {
        // If Loading:
        return (
            <div>
                Loading
            </div>
        )
    } else if (incrementItems.isError || addItems.isError) {
        // If Error Occurred:
        return (
            <div>
                {incrementItems.isError ? incrementItems.error.message : addItems.error.message}
            </div>
        )
    } else {
        return (
            <div className="add-items-wrapper">
                <Form schema={projectNumber === 'Inventory' ? inventory_list_schema : items_schema} 
                    validator={validator}
                    onSubmit={onSubmit}
                    formData={{ 'Entries': itemList }}
                    onChange={({formData}) => {setItemList(formData["Entries"])}}
                    onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    <input
                        value={scanned}
                        type="text" 
                        onKeyDown={(event) => {onBarcodeEnter(event.key)}}
                        onChange= {(event) => {setScanned(event.target.value)}}>
                    </input>
            </div>
        )
    }
}

export default AddProjectItems