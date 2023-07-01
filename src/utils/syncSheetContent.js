export async function buildWordBook(id, key) {
  try {
    const fulfilledValue = await handleFetchGoogleSheetData(id, key);
    const wordsSheet = fulfilledValue.sheets[0];
    return buildDataWithFirstRowAsKey(wordsSheet.data);
  }
  catch (err) {
    console.log(err)
  }
}

function buildDataWithFirstRowAsKey(arr) {
  const { rowData } = arr[0];
  const keys = rowData[0].values.map(child => child.formattedValue);
  const result = [];
  rowData.forEach((row, rowIndex) => {
    if (rowIndex !== 0) {
      const word = {};
      row.values.forEach((column, columnIndex) => {
        word[keys[columnIndex]] = column.formattedValue;
      });
      result.push(word);
    }
  })

  return result;
}

function handleFetchGoogleSheetData(id, key) {
  return new Promise((resolve, reject) => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/?key=${key}&includeGridData=true`, {
      headers: { "Referer": "https://localhost:3000" },
    })
    .then( res => resolve(res.json()) )
    .catch( err => reject(err) )
  })
}
