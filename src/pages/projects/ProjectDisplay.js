import { React, useState, useEffect } from "react"
import './ProjectDisplay.css';
import { useQuery } from "react-query";
import { api_url } from "../../resources/constants";
import { useLocation } from "react-router-dom";
import { useRequest, Methods } from "../../util/QueryHandler"

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

            var projectTitle = data['projectNumber']
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
                {entries[0]['Barcode']}
            </div>
        )
    }    
}

export default ProjectDisplay