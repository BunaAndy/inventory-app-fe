// Sorting function
export const sortList = (shown, setShown, entries, setEntries, col, desc) => {
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
export function filterList(entries, setShown, string) {
    var newShown = entries.slice().filter((item) => {
        var found = false
        var itemData = Object.values(item)
        for (let i = 0; i < itemData.length; i++) {
            console.log(itemData)
            var hasString = itemData[i].toString().toLowerCase().includes(string.toLowerCase())
            found = found || hasString
        }
        return found
    })
    setShown(newShown)
}