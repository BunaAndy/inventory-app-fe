import './Table.css'

function defaultCellFunc(item, col, index) {
    return <td key={String(item[col]) + String(col)}>{item[col]}</td>
}

var defaultSorting = (col, bool) => {}
var handler = {
    get: function(target, name) {
        return target.hasOwnProperty(name) ? target[name] : {};
    }
};
var defaultwidths = new Proxy({}, handler);

function Table({columns, shown, sorting=defaultSorting, rowColoringLogic=((item) => {}), cellFunc=defaultCellFunc, columnwidths=defaultwidths}) {
    return (
        <div className='tableWrapper'>
            <table className='itemTable'>
                <thead>
                    <tr>
                        {columns.map(function (column) {
                            return (
                                <th key={column} style={columnwidths[column]}>
                                    <div className='headerWrapper'>
                                        <div className='columnName'>
                                            {column}
                                        </div>
                                        <div className='buttonWrapper'>
                                            <button className='upArrow' onClick={() => { sorting(column, false) }} />
                                            <button className='downArrow' onClick={() => { sorting(column, true) }} />
                                        </div>
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {shown.map((item, i) => {
                        return (
                            <tr key={i} style={rowColoringLogic(item)}>
                                {columns.map((col) => {
                                    return cellFunc(item, col, i)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Table