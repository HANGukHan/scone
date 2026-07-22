const ExcelJS = require('exceljs');
const path = require('path');

async function inspect() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'menu1.xlsx'));
  const sheet = workbook.getWorksheet('생산량표') || workbook.worksheets[0];

  const cell = sheet.getCell('H28');
  console.log('H28 value:', JSON.stringify(cell.value));
}

inspect().catch(err => console.error(err));
