const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  const ws = wb.getWorksheet('생산량표') || wb.worksheets[0];

  let output = `Sheet Name: ${ws.name}\n`;
  output += `Dimensions: Rows: ${ws.rowCount}, Cols: ${ws.actualColumnCount}\n\n`;

  // Print first 5 rows to see headers
  output += "--- HEADERS (Rows 1-10) ---\n";
  for (let r = 1; r <= 10; r++) {
    const row = ws.getRow(r);
    const cells = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const colLetter = ws.getColumn(colNumber).letter;
      cells.push(`${colLetter}:${JSON.stringify(cell.value)}`);
    });
    output += `Row ${r}: ${cells.join(' | ')}\n`;
  }

  // Find all columns with non-empty cells
  output += "\n--- Column Names in Row 1, 2, 3 ---\n";
  for (let c = 1; c <= 50; c++) {
    const colLetter = ws.getColumn(c).letter;
    const r1 = ws.getRow(1).getCell(c).value;
    const r2 = ws.getRow(2).getCell(c).value;
    const r3 = ws.getRow(3).getCell(c).value;
    output += `Col ${colLetter} (${c}): R1=${JSON.stringify(r1)}, R2=${JSON.stringify(r2)}, R3=${JSON.stringify(r3)}\n`;
  }

  // Dump rows that contain product names or calculations
  output += "\n--- Rows with Data (selected columns) ---\n";
  for (let r = 1; r <= 120; r++) {
    const row = ws.getRow(r);
    // Print row if it has any cell value
    let hasVal = false;
    const vals = [];
    for (let c = 1; c <= 50; c++) {
      const val = row.getCell(c).value;
      if (val !== null && val !== undefined) {
        hasVal = true;
        const colLetter = ws.getColumn(c).letter;
        vals.push(`${colLetter}:${JSON.stringify(val)}`);
      }
    }
    if (hasVal) {
      output += `Row ${r}: ${vals.join(' | ')}\n`;
    }
  }

  fs.writeFileSync(path.join(__dirname, 'menu2_inspection.txt'), output);
  console.log("Inspection written to menu2_inspection.txt");
}

main().catch(console.error);
