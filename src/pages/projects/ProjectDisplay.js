import { React, useState, useEffect } from "react"
import './ProjectDisplay.css';
import { useQuery } from "react-query";
import { api_url } from "../../resources/constants";
import { useLocation } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"
import Table from "../../components/Table";

function ProjectDisplay() {
    // Setting up state and variables
    const location = useLocation();
    const [entries, setEntries] = useState([]);
    const [shown, setShown] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectNumber, setProjectNumber] = useState((
        () => {
            var pathList = location.pathname.split('/')
            if(pathList.length > 2) {
                return pathList.at(2)
            }
            return ''
        }).apply());
    const [columns, setColumns] = useState([]);
    const [coloring, setColoring] = useState(false)

    // Sorting function
    const sortItems = (col, desc) => {
        if (shown.length > 0) {
            var isNumeric = typeof shown[0][col] == "number"
            var sortedShown = shown.slice().sort((a, b) =>
                a[col].toString().localeCompare(b[col].toString(), "en", {
                    numeric: isNumeric
                })
            )
            var sortedEntries = entries.slice().sort((a, b) =>
                a[col].toString().localeCompare(b[col].toString(), "en", {
                    numeric: isNumeric
                })
            )

            if (desc === true) {
                sortedShown = sortedShown.reverse()
                sortedEntries = sortedEntries.reverse()
            }
            setEntries(sortedEntries)
            setShown(sortedShown)
        }
    }
    
    // Filtering Function
    const searchBoxFilter = (event) => {
        var newShown = entries.slice().filter((item) => {
            var found = false
            var itemData = Object.values(item)
            for (let i = 0; i < itemData.length; i++) {
                found = found || itemData[i].toString().toLowerCase().includes(event.target.value.toLowerCase())
            }
            return found
        })
        setShown(newShown)
    }

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
                <div className="tableTitle">
                    <div className="projectTitle">{projectName}</div>
                    <div className="searchWrapper">
                        Search:
                        <input name="myInput" className="searchBox" onChange={searchBoxFilter} />
                    </div>
                </div>
                <Table columns={columns} shown={shown} sorting={sortItems} rowColoringLogic={rowColor}/>
                {projectName != "Inventory" ? (
                    <><input type="checkbox" id="colors" checked={coloring} onChange={(event) => {setColoring(event.target.checked)}}/>
                        <label htmlFor="colors">Show Colors?</label></>
                ): <></>}
            </div>
        )
    }    
}

export default ProjectDisplay