const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'Test2.xlsx'));
  const ws = wb.worksheets[0];

  console.log(`Sheet Name: ${ws.name}, Rows: ${ws.rowCount}`);
  const row1 = ws.getRow(1);
  const row2 = ws.getRow(2);
  for (let c = 1; c <= ws.actualColumnCount; c++) {
    console.log(`Col ${c}: Header="${row1.getCell(c).value}" | Row2="${row2.getCell(c).value}"`);
  }
}

main().catch(console.error);
