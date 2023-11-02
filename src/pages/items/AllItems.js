import { React, useState } from "react"
import './AllItems.css';
import { api_url } from "../../resources/constants";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";
import ModifyItems from "./ModifyItems";

function AllItems() {
    // Setting up state and variables
    const [entries, setEntries] = useState([]);
    const [shown, setShown] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [columns, setColumns] = useState([]);
    const [editting, setEditting] = useState(false)

    // On opening page, run query to populate state with project info
    const itemsQuery = useRequest(
        String(api_url) + `/get_items`,
        undefined,
        Methods.Get,
        ['items'],
        // Data population function, called in query handler
        ((data) => {
            setEntries(data['entries']);
            setShown(data['entries'])
            setProjectName(data['projectName'])
            setColumns(data['columns']);
        })
    )

    // Rendering the page based on data
    if(itemsQuery.isLoading) {
        // If Loading:
        return (
            <div>
                Loading
            </div>
        )
    } else if (itemsQuery.isError) {
        // If Error Occurred:
        return (
            <div>
                {itemsQuery.error.message}
            </div>
        )
    } else if (itemsQuery.data !== undefined) {
        // If Successful:
        return (
            <div>
                {
                    editting ?
                    <div>
                        <div className="projectTitle">{projectName}</div>
                        <ModifyItems
                            entries={entries}
                            columns={columns}
                            editting={() => {setEditting(false);itemsQuery.refetch()}}
                            editCols={{'Barcode': 'string', 'Catalog': 'string'}}
                            url={'all_items'}/>
                        <div style={{'height': '70px', 'width': '100%'}}></div>
                    </div> :
                    <></>
                }
                <div className="tableTitle">
                    <div className="projectTitle">{projectName}</div>
                    <div className="searchWrapper">
                        Search:
                        <input name="myInput" className="searchBox" onChange={(event) => {filterList(entries, setShown, event.target.value)}}/>
                    </div>
                </div>
                <Table
                    columns={columns}
                    shown={shown}
                    sorting={(col, desc) => sortList(shown, setShown, entries, setEntries, col, desc)}/>
                {(editting) ? 
                <></> : 
                <>
                    <button onClick={() => setEditting(true)}>Edit Items</button>
                </>}
            </div>
        )
    }
}

export default AllItems