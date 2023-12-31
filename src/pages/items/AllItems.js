import { React, useState } from "react"
import './AllItems.css';
import { api_url } from "../../resources/constants";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";
import ModifyItems from "./ModifyItems";
import CatalogImporter from "../../components/CatalogImporter";

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

    const columnWidths = {
        'Barcode': {
            'width': '17%'
        },
        'Name': {
            'width': '50%'
        },
        'Catalog': {
            'width': '17%'
        },
        'Manufacturer': {
            'width': '16%'
        }
    }

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
        if (editting) {
            return (
                <div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <button onClick={() => setEditting(false)}>Back</button>
                    <div style={{'height': '70px', 'width': '100%'}}/>
                    <div className="tableTitle">
                        <div className="projectTitle">{projectName}</div>
                    </div>
                    <ModifyItems
                        entries={entries}
                        columns={columns.concat(["Delete"])}
                        editting={() => {setEditting(false);itemsQuery.refetch()}}
                        editCols={{'Barcode': 'string', 'Catalog': 'string'}}
                        url={'all_items'}/>
                    <div style={{'height': '70px', 'width': '100%'}}></div>
                </div>
            )
        } else {
            return (
                <div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <div className="tableTitle">
                        <div className="projectTitle">{projectName}</div>
                        <div className="searchWrapper">
                            Search:
                            <input name="myInput" className="searchBox" onChange={(event) => {filterList(entries, setShown, event.target.value, columns)}}/>
                        </div>
                    </div>
                    <div className="tableButtons">
                        <div className="edittingButtons">
                            <button onClick={() => {setEditting(true)}}>Edit Items</button>
                        </div>
                        <div className="exportButtons">
                            <CatalogImporter/>
                        </div>
                    </div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <Table
                        columns={columns}
                        shown={shown}
                        sorting={(col, desc) => sortList(shown, setShown, entries, setEntries, col, desc)}
                        columnwidths={columnWidths}/>
                </div>
            )
        }
    }
}

export default AllItems