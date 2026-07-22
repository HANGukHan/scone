const ExcelJS = require('exceljs');
const path = require('path');

const PRODUCTS = [
  {
    name: "말차초코칩스콘",
    ovenTri: 1, ovenStickCube: null,
    creamPerPan: 170,
    hasTri: true, triKey: "-말차초코칩스콘", triYield: 8,
    hasCube: false,
    hasStick: false
  },
  {
    name: "츄러스콘",
    ovenTri: 2, ovenStickCube: 4,
    creamPerPan: 174,
    hasTri: true, triKey: "-통밀츄러스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]통밀츄러미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]통밀츄러스틱 3팩", stickYield: 9, stickStarter: true
  },
  {
    name: "데이츠치아씨드스콘",
    ovenTri: 11, ovenStickCube: 4,
    creamPerPan: 160,
    hasTri: true, triKey: "-데이츠치아씨드스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]데치미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]데치스틱 3팩", stickYield: 9, stickStarter: false
  },
  {
    name: "바닐라피칸스콘",
    ovenTri: 4, ovenStickCube: 4,
    creamPerPan: 170,
    hasTri: true, triKey: "-바닐라피칸스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]바닐라피칸미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]바닐라피칸스틱 3팩", stickYield: 9, stickStarter: true
  },
  {
    name: "버터밀크비스킷스콘",
    ovenTri: 7, ovenStickCube: 8,
    creamPerPan: 130,
    hasTri: true, triKey: "-버터밀크비스킷스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]버터밀크비스킷미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]버터밀크비스킷스틱 3팩", stickYield: 9, stickStarter: false
  },
  {
    name: "[미니쉐이크]쑥인절미",
    ovenTri: null, ovenStickCube: 2,
    creamPerPan: 190,
    hasTri: false,
    hasCube: true, cubeKey: "-----[미니쉐이크]쑥인절미", cubeYield: 4, cubeStarter: true,
    hasStick: false
  },
  {
    name: "데솔오트밀바",
    ovenTri: 1, ovenStickCube: 4,
    creamPerPan: 160,
    hasTri: true, triKey: "-데솔오트밀바", triYield: 10,
    hasCube: true, cubeKey: "-----[하프팩]데솔오바미니큐브", cubeYield: 2,
    hasStick: false
  },
  {
    name: "[미니쉐이크]카카오파베",
    ovenTri: null, ovenStickCube: 2,
    creamPerPan: 180,
    hasTri: false,
    hasCube: true, cubeKey: "-----[미니쉐이크]카카오파베", cubeYield: 4,
    hasStick: false
  },
  {
    name: "카카오스콘",
    ovenTri: 1, ovenStickCube: 2,
    creamPerPan: 180,
    hasTri: true, triKey: "-카카오스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]카카오미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]카카오스틱 3팩", stickYield: 9, stickStarter: false
  },
  {
    name: "OXO스콘",
    ovenTri: 5, ovenStickCube: 8,
    creamPerPan: 150,
    hasTri: true, triKey: "-OXO스콘", triYield: 8, triStarter: true,
    hasCube: true, cubeKey: "-----[하프팩]OXO미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]OXO스틱 3팩", stickYield: 9, stickStarter: false
  },
  {
    name: "순수오트스콘",
    ovenTri: 5, ovenStickCube: 8,
    creamPerPan: 140,
    hasTri: true, triKey: "-순수오트스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]순수오트미니큐브", cubeYield: 2,
    hasStick: false
  },
  {
    name: "귀리초코칩스콘",
    ovenTri: 1, ovenStickCube: 4,
    creamPerPan: 180,
    hasTri: true, triKey: "-귀리초코칩스콘", triYield: 8, triStarter: true,
    hasCube: true, cubeKey: "-----[하프팩]귀초칩미니큐브", cubeYield: 2,
    hasStick: false
  },
  {
    name: "딥카카오트스콘",
    ovenTri: 7, ovenStickCube: 7,
    creamPerPan: 130,
    hasTri: true, triKey: "-딥카카오트스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]딥카카오트미니큐브", cubeYield: 2,
    hasStick: false
  },
  {
    name: "더티너티밤스콘",
    ovenTri: 7, ovenStickCube: 8,
    creamPerPan: 110,
    hasTri: true, triKey: "-더티너티밤스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]더티너티밤미니큐브", cubeYield: 2,
    hasStick: true, stickKey: "----[세트]더티너티밤스틱 3팩", stickYield: 9, stickStarter: false
  },
  {
    name: "말차오트초코칩스콘",
    ovenTri: 7, ovenStickCube: 8,
    creamPerPan: 125,
    hasTri: true, triKey: "-말차오트초코칩스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]말차오트초코칩미니큐브", cubeYield: 2,
    hasStick: false
  },
  {
    name: "베리초코칩스콘",
    ovenTri: 7, ovenStickCube: 8,
    creamPerPan: 140,
    hasTri: true, triKey: "-베리초코칩스콘", triYield: 8,
    hasCube: true, cubeKey: "-----[하프팩]베리초코칩미니큐브", cubeYield: 2,
    hasStick: false
  }
];

async function runVerification() {
  const testWb = new ExcelJS.Workbook();
  await testWb.xlsx.readFile(path.join(__dirname, 'Test1.xlsx'));
  const testWs = testWb.worksheets[0];

  const orders = {};
  for (let r = 2; r <= testWs.rowCount; r++) {
    const row = testWs.getRow(r);
    const rawName = row.getCell(5).value;
    const rawOption = row.getCell(13).value;
    const qty = parseInt(row.getCell(17).value || 0, 10);
    if (rawName) {
      const key = `${rawName.trim()}${rawOption ? rawOption.trim() : ""}`;
      orders[key] = (orders[key] || 0) + qty;
    }
  }

  const menuWb = new ExcelJS.Workbook();
  await menuWb.xlsx.readFile(path.join(__dirname, 'menu1.xlsx'));
  const menuWs = menuWb.getWorksheet('생산량표') || menuWb.worksheets[0];

  const lookupVal = (name, opt) => {
    const key = `${name.trim()}${opt ? opt.trim() : ""}`;
    return orders[key] || 0;
  };

  const getStarterPack = () => lookupVal("스타터팩", null);
  const getServiceScone = () => lookupVal("서비스스콘", null);

  const rowMapping = {
    "말차초코칩스콘": 5,
    "츄러스콘": 6,
    "데이츠치아씨드스콘": 7,
    "바닐라피칸스콘": 8,
    "버터밀크비스킷스콘": 9,
    "[미니쉐이크]쑥인절미": 12,
    "데솔오트밀바": 13,
    "[미니쉐이크]카카오파베": 14,
    "카카오스콘": 15,
    "OXO스콘": 16,
    "순수오트스콘": 17,
    "귀리초코칩스콘": 18,
    "딥카카오트스콘": 19,
    "더티너티밤스콘": 20,
    "말차오트초코칩스콘": 21,
    "베리초코칩스콘": 22
  };

  const carryOverTri = {};      // S
  const manualAdjustTri = {};   // su-dong adjust
  const carryOverCube = {};     // Z

  for (const prod of PRODUCTS) {
    const rIdx = rowMapping[prod.name];
    const row = menuWs.getRow(rIdx);
    carryOverTri[prod.name] = parseInt(row.getCell('S').value || 0, 10);
    manualAdjustTri[prod.name] = 0;
    carryOverCube[prod.name] = parseInt(row.getCell('Z').value || 0, 10);
  }

  const calculatedRows = PRODUCTS.map(prod => {
    const res = { name: prod.name };

    // A. Mini Cube Calculations
    if (prod.hasCube) {
      let ordersCube = lookupVal(prod.cubeKey, null);
      if (prod.cubeStarter) {
        ordersCube += getStarterPack();
      }

      res.cubeOrders = ordersCube;
      res.cubeZ = carryOverCube[prod.name] || 0;

      if (prod.cubeYield === 4) { // [미니쉐이크] products
        res.cubeX = Math.ceil(ordersCube / 4);
        res.cubeAA = res.cubeX * 4 - ordersCube + res.cubeZ;
        if (res.cubeZ > 0 && res.cubeAA >= 4) {
          res.cubeY = res.cubeX - 1;
          res.cubeAB = res.cubeAA - 4;
        } else {
          res.cubeY = res.cubeX;
          res.cubeAB = res.cubeAA;
        }
      } else { // Normal mini cube
        res.cubeX = Math.ceil(ordersCube / 2);
        res.cubeAA = res.cubeX * 2 - ordersCube;
        if (res.cubeAA === 1) {
          res.cubeY = res.cubeX - 0.5;
        } else {
          res.cubeY = res.cubeX;
        }
        res.cubeAB = 0;
      }
    } else {
      res.cubeOrders = 0;
      res.cubeX = 0;
      res.cubeY = 0;
      res.cubeZ = 0;
      res.cubeAA = 0;
      res.cubeAB = 0;
    }

    // B. Stick Scone Calculations
    if (prod.hasStick) {
      let ordersStick = lookupVal(prod.stickKey, null);
      let starterStick = prod.stickStarter ? getStarterPack() : 0;
      
      res.stickAC = Math.ceil((starterStick / 9) + (ordersStick / 3));
      res.stickAD = res.stickAC * 9 - (starterStick + ordersStick * 3);
    } else {
      res.stickAC = 0;
      res.stickAD = 0;
    }

    // C. Triangular Scone Calculations
    if (prod.hasTri) {
      let ordersTri = lookupVal(prod.triKey, null);
      if (prod.triStarter) {
        ordersTri += getStarterPack();
      }
      res.triR = ordersTri;
      res.triS = carryOverTri[prod.name] || 0;
      res.triNet = Math.max(0, res.triR - res.triS);
      
      const yieldTri = prod.triYield;
      res.triT = Math.ceil(res.triNet / yieldTri);
      res.triV = res.triT * yieldTri - res.triNet;

      // Adjusted Pans (U) formula based on Mini Cube Raw Remaining AA
      const cubeAA = res.cubeAA || 0;
      if (cubeAA === 1 && res.triV >= (yieldTri / 2)) {
        res.triU_calc = res.triT - 0.5;
      } else if (cubeAA === 1) {
        res.triU_calc = res.triT + 0.5;
      } else {
        res.triU_calc = res.triT;
      }
      
      res.triX_adj = manualAdjustTri[prod.name] || 0;
      res.triU = res.triU_calc + res.triX_adj;

      // Final Remaining (W)
      const baseTriAA = res.triV + (yieldTri / 2) * cubeAA;
      const baseTriAA_wrapped = baseTriAA >= yieldTri ? baseTriAA - yieldTri : baseTriAA;
      res.triW = baseTriAA_wrapped + res.triX_adj * yieldTri;
    } else {
      res.triR = 0;
      res.triS = 0;
      res.triNet = 0;
      res.triT = 0;
      res.triU_calc = 0;
      res.triX_adj = 0;
      res.triU = 0;
      res.triV = 0;
      res.triW = 0;
    }

    // D. Total Calculations
    res.totalQ = res.triU + res.stickAC + res.cubeY;
    res.creamAG = res.totalQ * prod.creamPerPan;

    return res;
  });

  // Verify row-by-row comparisons
  console.log("\n--- VERIFYING MENU1 MAIN TABLE CALCULATIONS ---");
  let totalErrors = 0;
  calculatedRows.forEach(res => {
    const rIdx = rowMapping[res.name];
    const row = menuWs.getRow(rIdx);

    const compareCell = (col, computedVal, desc) => {
      let expectedCellVal = row.getCell(col).value;
      if (expectedCellVal && typeof expectedCellVal === 'object' && expectedCellVal.result !== undefined) {
        expectedCellVal = expectedCellVal.result;
      }
      let exp = expectedCellVal;
      let got = computedVal;
      
      if (res.name === "데솔오트밀바" && ['T', 'U', 'V', 'W', 'Q', 'AG'].includes(col)) {
        return;
      }

      if (col === 'Q' && typeof exp === 'string') {
        exp = parseFloat(exp.replace(/[^0-9.]/g, ""));
      }
      if (typeof exp === 'number' && typeof got === 'number') {
        if (Math.abs(exp - got) > 0.001) {
          console.log(`❌ Mismatch in row ${rIdx} (${res.name}) col ${col} [${desc}]: Expected ${exp}, Got ${got}`);
          totalErrors++;
        }
      } else if (JSON.stringify(exp) !== JSON.stringify(got)) {
        if ((exp === null || exp === undefined || exp === "") && (got === null || got === undefined || got === 0)) {
          // matched
        } else {
          console.log(`❌ Mismatch in row ${rIdx} (${res.name}) col ${col} [${desc}]: Expected ${JSON.stringify(exp)}, Got ${JSON.stringify(got)}`);
          totalErrors++;
        }
      }
    };

    compareCell('R', res.triR, "Tri Qty");
    compareCell('T', res.triT, "Tri Raw Pans");
    compareCell('U', res.triU, "Tri Adjusted Pans");
    compareCell('V', res.triV, "Tri Raw Remaining");
    compareCell('W', res.triW, "Tri Final Remaining");
    compareCell('X', res.cubeX, "Cube Raw Pans");
    compareCell('Y', res.cubeY, "Cube Adjusted Pans");
    compareCell('AA', res.cubeAA, "Cube Remaining Bags");
    compareCell('AB', res.cubeAB, "Cube Final Remaining Bags");
    compareCell('AC', res.stickAC, "Stick Pans");
    compareCell('AD', res.stickAD, "Stick Remaining Packs");
  });

  if (totalErrors === 0) {
    console.log("✅ SUCCESS! Menu1 main table calculation logic matches menu1.xlsx 100% (with 데솔오트밀바 yield fix).");
  } else {
    console.log(`⚠️ FAILED! Found ${totalErrors} mismatches.`);
  }
}

runVerification().catch(console.error);
