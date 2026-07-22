const ExcelJS = require('exceljs');
const path = require('path');

async function inspect() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'Test1.xlsx'));
  const sheet = workbook.worksheets[0];
  
  console.log(`--- Sheet: ${sheet.name} (Cols 11-20) ---`);
  for (let i = 1; i <= Math.min(sheet.rowCount, 5); i++) {
    const row = sheet.getRow(i);
    const values = [];
    for (let col = 11; col <= 20; col++) {
      const cell = row.getCell(col);
      values.push(`${col}: ${JSON.stringify(cell.value)}`);
    }
    console.log(`Row ${i}:`, values.join(' | '));
  }
}

inspect().catch(err => console.error(err));
