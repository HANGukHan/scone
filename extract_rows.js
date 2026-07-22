const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'menu2.xlsx'));
  const ws = wb.getWorksheet('생산량표') || wb.worksheets[0];

  console.log("Row | P (품명) | N (삼각오븐) | O (스큐오븐) | Q (총판수) | R (주문량) | S (추가숨김) | T (추가량) | U (이월) | V (생산량) | W (판수) | X (조정판수) | Y (남는량) | Z (Z) | AA (남는량) | AB (판수) | AC (미니판수) | AD (미니이월) | AE (미니남는봉) | AF (미니남는봉) | AG (스틱판수) | AH (스틱남는팩) | AJ (생크림/판) | AK (생크림총)");
  console.log("-".repeat(220));

  for (let r = 4; r <= 31; r++) {
    const row = ws.getRow(r);
    const getVal = (col) => {
      const val = row.getCell(col).value;
      if (val === null || val === undefined) return "";
      if (typeof val === 'object' && val.formula) {
        return `F:${val.formula} [R:${val.result}]`;
      }
      return JSON.stringify(val);
    };

    console.log(`${r.toString().padStart(3)} | ${getVal('P')} | ${getVal('N')} | ${getVal('O')} | ${getVal('Q')} | ${getVal('R')} | ${getVal('S')} | ${getVal('T')} | ${getVal('U')} | ${getVal('V')} | ${getVal('W')} | ${getVal('X')} | ${getVal('Y')} | ${getVal('Z')} | ${getVal('AA')} | ${getVal('AB')} | ${getVal('AC')} | ${getVal('AD')} | ${getVal('AE')} | ${getVal('AF')} | ${getVal('AG')} | ${getVal('AH')} | ${getVal('AJ')} | ${getVal('AK')}`);
  }
}

main().catch(console.error);
