import { React, useState } from "react"
import './AllProjects.css';
import { api_url } from "../../resources/constants";
import { Link } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";
import AddProject from "./AddProject";
import ModifyItems from "../items/ModifyItems";
import { useLogin } from "../Login";

function AllProjects() {
    // Setting up state and variables
    const checkLogin = useLogin()
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
            setColumns(data['columns'].filter((col) => {return col !== 'Bill Of Materials Added'}));
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
        if (adding) {
            return (
                <div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <button onClick={() => {setAdding(false)}}>Back</button>
                    <div className="tableTitle">
                        <div className="projectTitle">{projectName}</div>
                    </div>
                    <AddProject changeAdding={() => {setAdding(false);projectsQuery.refetch()}}/>
                    <div style={{'height': '70px', 'width': '100%'}}></div>
                </div>
            )
        } else if (editting) {
            return (
                <div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <button onClick={() => {setEditting(false)}}>Back</button>
                    <div className="tableTitle">
                        <div className="projectTitle">{projectName}</div>
                    </div>
                    <ModifyItems
                        entries={entries.filter((proj) => {return !(proj['Project Name'] === 'Inventory')})}
                        columns={columns.concat(["Archive"])}
                        editting={() => {setEditting(false);projectsQuery.refetch()}}
                        editCols={{'Project Name': 'string'}}
                        url={'projects'}/>
                    <div style={{'height': '70px', 'width': '100%'}}></div>
                </div>
            )
        } else {
            return(
                <div>
                    <div style={{'height': '10px', 'width': '100%'}}/>
                    <div className="tableTitle">
                        <div className="projectTitle">{projectName}</div>
                        <div className="searchWrapper">
                                Search:
                            <input name="myInput" className="searchBox" onChange={(event) => {filterList(entries, setShown, event.target.value, columns)}}/>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => {checkLogin(); setAdding(true)}}>Add Projects</button>
                        <button onClick={() => {checkLogin(); setEditting(true)}}>Edit Projects</button>
                    </div>
                    <div style={{'height': '5px', 'width': '100%'}}/>
                    <Table
                        columns={columns}
                        shown={shown}
                        sorting={(col, desc) => sortList(shown, setShown, entries, setEntries, col, desc)}
                        cellFunc={cellFunc}/>
                    <div style={{'height': '70px', 'width': '100%'}}></div>
                </div>
            )
        }
    }
}

export default AllProjects