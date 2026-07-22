const ExcelJS = require('exceljs');
const path = require('path');

async function analyze() {
  console.log("Analyzing Excel files...");
  
  // 1. Analyze menu2.xlsx
  const menuWb = new ExcelJS.Workbook();
  await menuWb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  
  console.log("\n[menu2.xlsx Worksheets]");
  menuWb.worksheets.forEach((ws, index) => {
    console.log(`- Index ${index}: Name = "${ws.name}", RowCount = ${ws.rowCount}, ColCount = ${ws.actualColumnCount}`);
  });

  const prodSheet = menuWb.getWorksheet('생산량표') || menuWb.worksheets[0];
  console.log(`\nAnalyzing sheet: "${prodSheet.name}"`);
  
  // Print headers and some formulas from columns B, C, D, G, H, I, J, AL, AM, AN
  console.log("\n--- Top 35 Rows of '생산량표' (Selected Columns) ---");
  for (let r = 1; r <= 35; r++) {
    const row = prodSheet.getRow(r);
    const b = row.getCell('B').value;
    const c = row.getCell('C').value;
    const d = row.getCell('D').value;
    const g = row.getCell('G').value;
    const h = row.getCell('H').value;
    const i = row.getCell('I').value;
    const j = row.getCell('J').value;
    const al = row.getCell('AL').value;
    const am = row.getCell('AM').value;
    const an = row.getCell('AN').value;
    
    // We only print if there's any data in these columns
    if (b || c || d || g || h || i || j || al || am || an) {
      console.log(`Row ${r}:`);
      if (b || c || d) console.log(`  B-D: B=${JSON.stringify(b)}, C=${JSON.stringify(c)}, D=${JSON.stringify(d)}`);
      if (g || h || i || j) console.log(`  G-J: G=${JSON.stringify(g)}, H=${JSON.stringify(h)}, I=${JSON.stringify(i)}, J=${JSON.stringify(j)}`);
      if (al || am || an) console.log(`  AL-AN: AL=${JSON.stringify(al)}, AM=${JSON.stringify(am)}, AN=${JSON.stringify(an)}`);
    }
  }

  // Find where formula cells exist and print their formulas
  console.log("\n--- Scanning for formulas in sheet '생산량표' ---");
  const cols = ['B', 'C', 'D', 'G', 'H', 'I', 'J', 'AL', 'AM', 'AN'];
  for (let r = 1; r <= 100; r++) {
    const row = prodSheet.getRow(r);
    let rowHasFormula = false;
    let formulaDesc = [];
    cols.forEach(col => {
      const cell = row.getCell(col);
      if (cell.value && typeof cell.value === 'object' && cell.value.formula) {
        rowHasFormula = true;
        formulaDesc.push(`${col}: ${cell.value.formula} (Result: ${cell.value.result})`);
      }
    });
    if (rowHasFormula) {
      console.log(`Row ${r} Formulas: ${formulaDesc.join(' | ')}`);
    }
  }
  
  // 2. Analyze Test2.xlsx
  const testWb = new ExcelJS.Workbook();
  await testWb.xlsx.readFile(path.join(__dirname, 'Test2.xlsx'));
  console.log("\n[Test2.xlsx Worksheets]");
  testWb.worksheets.forEach((ws, index) => {
    console.log(`- Index ${index}: Name = "${ws.name}", RowCount = ${ws.rowCount}`);
  });
  
  const testSheet = testWb.worksheets[0];
  console.log(`\n--- Top 10 Rows of Test2.xlsx (${testSheet.name}) ---`);
  for (let r = 1; r <= 15; r++) {
    const row = testSheet.getRow(r);
    const values = [];
    for (let c = 1; c <= 15; c++) {
      values.push(`${c}:${JSON.stringify(row.getCell(c).value)}`);
    }
    console.log(`Row ${r}: ${values.join(' | ')}`);
  }
}

analyze().catch(err => console.error(err));
