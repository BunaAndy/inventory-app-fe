import { React, useState } from "react"
import {ExcelRenderer} from 'react-excel-renderer';
import { useMutate, Methods } from "../util/QueryHandler";
import { api_url } from "../resources/constants";
import { toast, ToastContainer } from 'react-toastify';
import { useLoggedIn } from "../pages/Login";

function CatalogImporter({ projectNumber }) {
    const [file, setFile] = useState()
    const checkLogin = useLoggedIn()

    const uploadCatalog = useMutate(
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
                toast.error(String(err))
                return
            }
            else {
                if (!file) {
                    toast.warning('Please select a file to upload')
                    return
                }
                var test = ''
                var rs = resp.rows
                var items = []
                for (var row in rs) {
                    if (rs[row].length > 3 && rs[row][0].toLowerCase() !== 'barcode' && rs[row][0].toLowerCase() !== 'catalog') {
                        items = items.concat([{
                            'Barcode': String(rs[row][0]), 
                            'Name': String(rs[row][1]),
                            'Catalog': String(rs[row][2]),
                            'Manufacturer': String(rs[row][3]),
                        }])
                    }
                }
                items.forEach(element => {
                    for (var col in element) {
                        if(element[col] === undefined) {
                            element[col] = ''
                        }   
                    }
                });
                var data = {'Entries': items}
                console.log(data)
                uploadCatalog.mutate(data)
                window.location.reload(false);
            }
        });
    }

    var regex = /^[^\d]*(\d+)/
    if (checkLogin()) {
        return (
            <div>
                <span>
                    <div>Upload Catalog as Excel file:</div>
                    <input type="file"
                        name="myFile"
                        onChange={(event) => {let f = event.target.files[0]; setFile(f)}}
                        accept=".xls,.xlsx"/>
                </span>
                <div style={{'height': '10px', 'width': '100%'}}></div>
                <button onClick={(event) => {uploadFile()}}>Upload</button>
                <ToastContainer/>
            </div>
        )
    } else {
        <></>
    }
}

export default CatalogImporter