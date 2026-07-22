const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const menuWb = new ExcelJS.Workbook();
  await menuWb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  const menuWs = menuWb.getWorksheet('생산량표') || menuWb.worksheets[0];

  const testWb = new ExcelJS.Workbook();
  await testWb.xlsx.readFile(path.join(__dirname, 'Test2.xlsx'));
  const testWs = testWb.worksheets[0];

  console.log("Comparing menu2.xlsx (B:D) with Test2.xlsx...");
  console.log(`Test2 rows: ${testWs.rowCount}, menu2 rows: ${menuWs.rowCount}`);

  // Gather Test2 records
  const testRecords = [];
  for (let r = 2; r <= testWs.rowCount; r++) {
    const row = testWs.getRow(r);
    const name = row.getCell(5).value;
    const option = row.getCell(13).value;
    const qty = row.getCell(17).value;
    if (name) {
      testRecords.push({ name, option, qty });
    }
  }

  // Gather menu2 records in A-D
  const menuRecords = [];
  for (let r = 4; r <= 150; r++) {
    const row = menuWs.getRow(r);
    const name = row.getCell('B').value;
    const option = row.getCell('C').value;
    const qty = row.getCell('D').value;
    if (name) {
      menuRecords.push({ name, option, qty });
    }
  }

  console.log(`Test2 parsed records: ${testRecords.length}`);
  console.log(`menu2 parsed records: ${menuRecords.length}`);

  let matchCount = 0;
  for (let i = 0; i < Math.max(testRecords.length, menuRecords.length); i++) {
    const tr = testRecords[i] || {};
    const mr = menuRecords[i] || {};
    const match = tr.name === mr.name && tr.option === mr.option && tr.qty === mr.qty;
    if (match) matchCount++;
    console.log(`Row ${i+4}: Match=${match} | Test2: ${tr.name}/${tr.option}/${tr.qty} | menu2: ${mr.name}/${mr.option}/${mr.qty}`);
  }
  console.log(`Total Matches: ${matchCount} out of ${Math.max(testRecords.length, menuRecords.length)}`);
}

main().catch(console.error);
