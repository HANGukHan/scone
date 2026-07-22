const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  const ws = wb.getWorksheet('생산량표') || wb.worksheets[0];

  console.log("Searching for references to 요프 or rows 28-31...");
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (cell.value && typeof cell.value === 'object' && cell.value.formula) {
        const formula = cell.value.formula;
        if (formula.includes("28") || formula.includes("29") || formula.includes("30") || formula.includes("31") || formula.includes("H28") || formula.includes("J28") || formula.includes("J29") || formula.includes("J30") || formula.includes("J31")) {
          const colLetter = ws.getColumn(colNumber).letter;
          console.log(`Cell ${colLetter}${r} formula: "${formula}" (Result: ${cell.value.result})`);
        }
      }
    });
  }
}

main().catch(console.error);
