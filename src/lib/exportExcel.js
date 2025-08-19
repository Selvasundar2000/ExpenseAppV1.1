import * as XLSX from "xlsx";

function renameAndRemoveColumns(data, columnMap, removeKeys = []) {
    return data.map(item => {
        const newItem = {};
        for (const key in item) {
            if (!removeKeys.includes(key)) {
                newItem[columnMap[key] || key] = item[key];
            }
        }
        return newItem;
    });
}

function stringifyValues(data) {
    return data.map(row =>
        Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, String(value)])
        )
    );
}

export default function generateExportExcel(
    Data,
    removeKeys,
    columnMap,
    FileFullName = "",
    orderedKeys = []
) {
    // Step 1: Clean and transform data
    const cleanedData = renameAndRemoveColumns(Data, columnMap, removeKeys);

    const reorderedData = orderedKeys.length > 0
        ? cleanedData.map(item => {
            const orderedItem = {};
            orderedKeys.forEach(key => {
                orderedItem[key] = item[key] || "";
            });
            return orderedItem;
        })
        : cleanedData;

    // Step 3: Convert all values to strings
    const stringifiedData = stringifyValues(reorderedData);
    // Step 4: Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(stringifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Step 5: Set equal column widths
    const columnCount = Object.keys(stringifiedData[0] || {}).length;
    worksheet["!cols"] = Array(columnCount).fill({ wch: 20 });
    // Step 6: Generate file name with current date & time
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

    const filename = `${FileFullName}_${formattedDate}.xlsx`;

    // Step 7: Export as .xlsx
    XLSX.writeFile(workbook, filename);
}
