import { React, useState } from "react"
import {ExcelRenderer} from 'react-excel-renderer';
import { useMutate, Methods } from "../util/QueryHandler";
import { api_url } from "../resources/constants";

function CatalogImporter({ projectNumber }) {
    const [file, setFile] = useState()

    const uploadBOM = useMutate(
        String(api_url) + `/upload_catalog`,
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
                if (!file) {
                    return
                }
                var rs = resp.rows
                var items = []
                for (var row in rs) {
                    if (rs[row].length > 3 && rs[row][0] !== 'ITEMS' && rs[row][0] !== 'BILL OF MATERIAL') {
                        console.log(String(rs[row][5]).match(regex))
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
                    if (element['Quantity Needed'] === undefined) {
                        element['Quantity Needed'] = 0
                    }
                    for (var col in element) {
                        if(element[col] === undefined) {
                            element[col] = ''
                        }   
                    }
                });
                var data = {'Entries': items}
                uploadBOM.mutate(data)
                window.location.reload(false);
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

export default CatalogImporter