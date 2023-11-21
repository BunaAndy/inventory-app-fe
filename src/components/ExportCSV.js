function ExportCSV({ entries, columns, tableName }) {
    function downloadCSVFile() {
        const element = document.createElement("a");
        var str = expCSV(entries, columns)
        console.log(str)
        console.log("strung")
        const file = new Blob([str], {type: 'text/csv'});
        element.href = URL.createObjectURL(file);
        element.download = String(tableName) + ".csv";
        console.log(str)
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    return (
        <div>
            <button onClick={() => {downloadCSVFile()}}>Download CSV</button>
        </div>
    )
}

function expCSV(entries, columns) {
    var csv = ""
    var colStr = ""
    for (var col in columns) {
        colStr = colStr + String(columns[col]) + ","
    }

    colStr = colStr.substring(0, colStr.length - 1)
    csv = colStr + "\n" 
    for (var entry in entries) {
        csv = csv + String(entryCSV(entries[entry], columns)) + "\n"
    }
    csv = csv.substring(0, csv.length - 1)
    console.log(csv)
    return csv
}

function entryCSV(entry, columns) {
    var str = ""
    for (var col in columns) {
        str = str + String(entry[columns[col]]) + ","
    }
    return str.substring(0, str.length - 1)
}

export default ExportCSV