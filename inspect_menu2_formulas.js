const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  const ws = wb.getWorksheet('생산량표') || wb.worksheets[0];

  let output = "";
  for (let r = 4; r <= 31; r++) {
    const row = ws.getRow(r);
    output += `Row ${r}: P="${row.getCell('P').value || ''}"\n`;
    const cols = ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AJ', 'AK'];
    cols.forEach(col => {
      const cell = row.getCell(col);
      let cellStr = "";
      if (cell.value && typeof cell.value === 'object' && cell.value.formula) {
        cellStr = `Formula: ${cell.value.formula} (Result: ${cell.value.result})`;
      } else {
        cellStr = `Value: ${JSON.stringify(cell.value)}`;
      }
      output += `  ${col}: ${cellStr}\n`;
    });
    output += "\n";
  }

  // Also print lookup table columns G-J for rows 4 to 60
  output += "--- LOOKUP TABLE (Columns G-J) ---\n";
  for (let r = 4; r <= 60; r++) {
    const row = ws.getRow(r);
    const g = row.getCell('G').value;
    const h = row.getCell('H').value;
    const i = row.getCell('I').value;
    const j = row.getCell('J').value;
    let jStr = "";
    if (j && typeof j === 'object' && j.formula) {
      jStr = `Formula: ${j.formula} (Result: ${j.result})`;
    } else {
      jStr = `Value: ${JSON.stringify(j)}`;
    }
    output += `Row ${r}: G=${JSON.stringify(g)}, H=${JSON.stringify(h)}, I=${JSON.stringify(i)}, J=${jStr}\n`;
  }

  fs.writeFileSync(path.join(__dirname, 'menu2_table_details.txt'), output);
  console.log("Inspection written to menu2_table_details.txt");
}

main().catch(console.error);
