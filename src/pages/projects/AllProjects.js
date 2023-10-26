import { React, useState } from "react"
import './ProjectDisplay.css';
import { api_url } from "../../resources/constants";
import { Link, useLocation } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";

function AllProjects() {
    // Setting up state and variables
    const location = useLocation();
    const [entries, setEntries] = useState([]);
    const [shown, setShown] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectNumber] = useState((
        () => {
            var pathList = location.pathname.split('/')
            if(pathList.length > 2) {
                return pathList.at(2)
            }
            return ''
        }).apply());
    const [columns, setColumns] = useState([]);
    const [coloring, setColoring] = useState(false)

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

    function cellFunc(item, col) {
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
            </div>
        )
    }
}

export default AllProjects