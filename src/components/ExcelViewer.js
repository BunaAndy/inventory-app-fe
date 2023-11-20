import { React, useState } from "react"
import {ExcelRenderer, OutTable} from 'react-excel-renderer';

function ExcelViewer() {
    const [rows, setRows] = useState()
    const [columns, setColumns] = useState()

    function uploadFile(event) {
        let file = event.target.files[0];
        console.log(file);

        ExcelRenderer(file, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                setColumns(resp.cols)
                setRows(resp.rows)
            }
        });
    }


    if (rows && columns) {
        console.log(rows)
        console.log(columns)
        return (
            <OutTable data={rows} columns={columns} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
        )
    }

    return (
        <div>
            <span>
                <input type="file"
                    name="myFile"
                    onChange={(event) => uploadFile(event)}
                    accept=".xls,.xlsx"/>
            </span>
        </div>
    )
}

export default ExcelViewer