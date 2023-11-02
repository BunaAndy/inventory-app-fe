import { React, useState } from "react"
import './AllProjects.css';
import { api_url } from "../../resources/constants";
import { Link } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";
import AddProject from "./AddProject";
import ModifyItems from "../items/ModifyItems";

function AllProjects() {
    // Setting up state and variables
    const [adding, setAdding] = useState(false)
    const [editting, setEditting] = useState(false)
    const [entries, setEntries] = useState([]);
    const [shown, setShown] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [columns, setColumns] = useState([]);

    // On opening page, run query to populate state with project info
    const projectsQuery = useRequest(
        String(api_url) + `/get_projects`,
        undefined,
        Methods.Get,
        ['projects'],
        // Data population function, called in query handler
        ((data) => {
            setEntries(data['entries']);
            setShown(data['entries'])
            setProjectName(data['projectName'])
            setColumns(data['columns']);
        })
    )

    function cellFunc(item, col, index) {
        return (
            <td key={String(item[col]) + String(col)} className="clickableCell">
                <Link to={`/projects/${item['Project Number']}`}>
                    <div style={{width: "100%", height: "100%"}}>
                        {item[col]}
                    </div>
                </Link>
            </td>
        )
    }

    // Rendering the page based on data
    if(projectsQuery.isLoading) {
        // If Loading:
        return (
            <div>
                Loading
            </div>
        )
    } else if (projectsQuery.isError) {
        // If Error Occurred:
        return (
            <div>
                {projectsQuery.error.message}
            </div>
        )
    } else if (projectsQuery.data !== undefined) {
        // If Successful:
        return (
            <div>
                {adding ? <><AddProject changeAdding={() => {setAdding(false);projectsQuery.refetch()}}/>
                            <div style={{'height': '70px', 'width': '100%'}}></div></> : <></>}
                {
                    editting ?
                    <div>
                        <div className="projectTitle">{projectName}</div>
                        <ModifyItems
                            entries={entries.filter((proj) => {return !(proj['Project Name'] === 'Inventory')})}
                            columns={columns}
                            editting={() => {setEditting(false);projectsQuery.refetch()}}
                            editCols={{'Project Name': 'string'}}
                            url={'projects'}/>
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
                    sorting={(col, desc) => sortList(shown, setShown, entries, setEntries, col, desc)}
                    cellFunc={cellFunc}/>
                {(adding || editting) ? 
                <></> : 
                <>
                    <button onClick={() => setAdding(true)}>Add Projects</button>
                    <button onClick={() => setEditting(true)}>Edit Projects</button>
                </>}
                <div style={{'height': '70px', 'width': '100%'}}></div>
            </div>
        )
    }
}

export default AllProjects