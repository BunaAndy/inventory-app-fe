import { React, useState } from "react"
import './ArchivedProjects.css';
import { api_url } from "../../resources/constants";
import { useRequest, Methods, useMutate } from "../../util/QueryHandler"
import Table from "../../components/Table";
import { filterList, sortList } from "../../util/ListFunctions";

function ArchivedProjects() {
    // Setting up state and variables
    const [entries, setEntries] = useState([]);
    const [shown, setShown] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [columns, setColumns] = useState([]);

    // On opening page, run query to populate state with project info
    const projectsQuery = useRequest(
        String(api_url) + `/get_archived_projects`,
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
    const downloadQuery = useMutate(
        String(api_url) + `/download_archived_csv`,
        undefined,
        Methods.Post,
        ['download'],
        ((data) => {
            console.log(data)
        })
    )

    function downloadLink(item) {
        var data = {
            'Project Name': item['Project Name'],
            'Project Number': item['Project Number']
        }
        downloadQuery.mutate(data)
    }

    function cellFunc(item, col) {
        return (
            <td key={String(item[col]) + String(col)} className="clickableCell">
                <div style={{width: "100%", height: "100%"}} onClick={() => {console.log('click');downloadLink(item)}}>
                    {item[col]}
                </div>
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

export default ArchivedProjects