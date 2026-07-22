const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'Test2.xlsx'));
  const ws = wb.worksheets[0];

  const records = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const name = row.getCell(5).value;
    const option = row.getCell(13).value;
    const qty = parseInt(row.getCell(17).value || 0, 10);
    if (name) {
      records.push({ name: name.trim(), option: option ? option.trim() : null, qty });
    }
  }

  fs.writeFileSync(path.join(__dirname, 'sample_data.json'), JSON.stringify(records, null, 2));
  console.log(`Dumped ${records.length} records to sample_data.json`);
}

main().catch(console.error);
