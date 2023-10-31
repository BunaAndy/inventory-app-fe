import { React, useState } from "react"
import './ProjectDisplay.css';
import { api_url } from "../../resources/constants";
import { useLocation } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";
import AddProjectItems from "./AddProjectItems";

function ProjectDisplay() {
    // Setting up state and variables
    const location = useLocation();
    const [adding, setAdding] = useState(false)
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

    // Row coloring function
    function rowColor(item) {
        if (!coloring) {
            return {}
        }
        if (item['Quantity'] >= item['Quantity Needed']) {
            return {backgroundColor: "palegreen"}
        } else {
            return {backgroundColor: "palevioletred"}
        }
    }

    function coloringEnable() {
        if (projectName !== "Inventory") {
            return (<>
                <input type="checkbox" id="colors" checked={coloring} onChange={(event) => {setColoring(event.target.checked)}}/>
                <label htmlFor="colors">Show Colors?</label>
            </>)
        } else {
            return <></>
        }
    }

    // On opening page, run query to populate state with project info
    const projectQuery = useRequest(
        String(api_url) + `/get_project_items?projectNumber=${projectNumber}`,
        undefined,
        Methods.Get,
        ['items'],
        // Data Population function, called in query handler
        ((data) => {
            setEntries(data['entries']);
            setShown(data['entries'])

            var projectTitle = data['projectNumber'] + " " + data['projectName']
            if (projectTitle.includes("Inventory")) {
                projectTitle = "Inventory"
            }
            setProjectName(projectTitle)

            var cols = data['columns']
            cols = cols.filter((col) => {return col !== 'Project'})
            if (projectTitle === "Inventory") {
                cols = cols.filter((col) => {return col !== 'Quantity Needed'})
            }
            setColumns(cols);
        })
    )
    
    // Rendering the page based on data
    if(projectQuery.isLoading) {
        // If Loading:
        return (
            <div>
                Loading
            </div>
        )
    } else if (projectQuery.isError) {
        // If Error Occurred:
        return (
            <div>
                {projectQuery.error.message}
            </div>
        )
    } else if (projectQuery.data !== undefined) {
        // If Successful:
        return (
            <div>
                {
                    adding ?
                    <div>
                        <AddProjectItems projectName={projectName} projectNumber={projectNumber} changeAdding={() => setAdding(false)}/>
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
                    rowColoringLogic={rowColor}/>
                <button onClick={() => setAdding(true)}>Add Items</button>
                {coloringEnable()}
                <div style={{'height': '70px', 'width': '100%'}}></div>
            </div>
        )
    }    
}

export default ProjectDisplay