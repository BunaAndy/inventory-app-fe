import { React, useState } from "react"
import {ExcelRenderer} from 'react-excel-renderer';
import { useMutate, Methods } from "../util/QueryHandler";
import { api_url } from "../resources/constants";

function BOMImporter({ projectNumber, refresh}) {
    const [file, setFile] = useState()

    const uploadBOM = useMutate(
        String(api_url) + `/upload_BOM?projectNumber=${projectNumber}`,
        Methods.Post,
        ['items'],
        ((data) => {
            console.log(data)
        })
    )

    function uploadFile() {
        ExcelRenderer(file, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                var rs = resp.rows
                var items = []
                for (var row in rs.slice(2)) {
                    if (rs[row][0] !== 'ITEMS' && rs[row][0] !== 'BILL OF MATERIAL') {
                        items = items.concat([{
                            'Barcode': '', 
                            'Name': String(rs[row][2]),
                            'Quantity': 0,
                            'Quantity Needed': Number(String(rs[row][5]).match(regex)[0]),
                            'Catalog': String(rs[row][4]),
                            'Manufacturer': String(rs[row][3])
                        }])
                    }
                }
                items.forEach(element => {
                    for (var col in element) {
                        if(element[col] === undefined) {
                            element[col] = ''
                        }   
                    }
                    if (element['Quantity Needed'] === undefined) {
                        element['Quantity Needed'] = 0
                    }
                });
                var data = {'Entries': items}
                uploadBOM.mutate(data)
                refresh()
            }
        });
    }

    var regex = /^[^\d]*(\d+)/

    return (
        <div>
            <span>
                <div style={{'height': '10px', 'width': '100%'}}></div>
                <div>Upload BOM as Excel file:</div>
                
                <input type="file"
                    name="myFile"
                    onChange={(event) => {let f = event.target.files[0]; setFile(f)}}
                    accept=".xls,.xlsx"/>
            </span>
            <div style={{'height': '10px', 'width': '100%'}}></div>
            <button onClick={(event) => {uploadFile()}}>Upload</button>
        </div>
    )
}

export default BOMImporter