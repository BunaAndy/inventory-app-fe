import { React, useState } from "react"
import {ExcelRenderer} from 'react-excel-renderer';
import Table from "./Table";

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

    var regex = /^[^\d]*(\d+)/

    if (rows && columns) {
        var cols = ['Barcode', 'Name', 'Quantity', 'Quantity Needed', 'Catalog']
        var items = []
        for (var row in rows) {
            if (rows[row][0] !== 'ITEMS' && rows[row][0] !== 'BILL OF MATERIAL') {
                items = items.concat([{
                    'Barcode': '', 
                    'Name': rows[row][2],
                    'Quantity': 0,
                    'Quantity Needed': String(rows[row][5]).match(regex)[0],
                    'Catalog': rows[row][4]
                }])
            }
        }
        console.log(items)
        return (
            <span>
                <div style={{'height': '10px', 'width': '100%'}}></div>
                <Table columns={cols} shown={items}/>
            </span>
        )
    }

    return (
        <div>
            <span>
                <div style={{'height': '10px', 'width': '100%'}}></div>
                <div>Upload Excel file for viewing:</div>
                <div style={{'height': '10px', 'width': '100%'}}></div>
                <input type="file"
                    name="myFile"
                    onChange={(event) => uploadFile(event)}
                    accept=".xls,.xlsx"/>
            </span>
        </div>
    )
}

export default ExcelViewer