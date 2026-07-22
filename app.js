// Embedded initial data based on Test1.xlsx
    const DEFAULT_ORDERS = [
      { "name": "-------[Gourmet M]피넛머드", "option": "[스무스]", "qty": 7 },
      { "name": "-------소분용 OPP 봉투 20매", "option": "[간식용]", "qty": 1 },
      { "name": "-------소분용 OPP 봉투 20매", "option": "[식사용]", "qty": 6 },
      { "name": "------YOF6팩", "option": null, "qty": 2 },
      { "name": "------요프 한 가지 맛", "option": "[ 말차]", "qty": 2 },
      { "name": "------요프 한 가지 맛", "option": "[ 쑥]", "qty": 1 },
      { "name": "------요프 한 가지 맛", "option": "[ 콩가루]", "qty": 1 },
      { "name": "-----[미니쉐이크]쑥인절미", "option": null, "qty": 5 },
      { "name": "-----[미니쉐이크]카카오파베", "option": null, "qty": 15 },
      { "name": "-----[하프팩]OXO미니큐브", "option": null, "qty": 9 },
      { "name": "-----[하프팩]귀초칩미니큐브", "option": null, "qty": 4 },
      { "name": "-----[하프팩]더티너티밤미니큐브", "option": null, "qty": 11 },
      { "name": "-----[하프팩]데솔오바미니큐브", "option": null, "qty": 7 },
      { "name": "-----[하프팩]데치미니큐브", "option": null, "qty": 1 },
      { "name": "-----[하프팩]말차오트초코칩미니큐브", "option": null, "qty": 5 },
      { "name": "-----[하프팩]바닐라피칸미니큐브", "option": null, "qty": 8 },
      { "name": "-----[하프팩]버터밀크비스킷미니큐브", "option": null, "qty": 5 },
      { "name": "-----[하프팩]배리초코칩미니큐브", "option": null, "qty": 6 },
      { "name": "-----[하프팩]순수오트미니큐브", "option": null, "qty": 1 },
      { "name": "-----[하프팩]카카오미니큐브", "option": null, "qty": 5 },
      { "name": "-----[하프팩]통밀츄러미니큐브", "option": null, "qty": 4 },
      { "name": "----[세트]OXO스틱 3팩", "option": null, "qty": 17 },
      { "name": "----[세트]더티너티밤스틱 3팩", "option": null, "qty": 34 },
      { "name": "----[세트]데치스틱 3팩", "option": null, "qty": 18 },
      { "name": "----[세트]바닐라피칸스틱 3팩", "option": null, "qty": 28 },
      { "name": "----[세트]버터밀크비스킷스틱 3팩", "option": null, "qty": 16 },
      { "name": "----[세트]카카오스틱 3팩", "option": null, "qty": 19 },
      { "name": "----[세트]통밀츄러스틱 3팩", "option": null, "qty": 8 },
      { "name": "---단호박스콘", "option": null, "qty": 238 },
      { "name": "---쑥스콘", "option": null, "qty": 140 },
      { "name": "---쑥인절미꿀호떡스콘", "option": null, "qty": 129 },
      { "name": "---흑미밤설기바스콘", "option": null, "qty": 103 },
      { "name": "---흑임자라떼스콘", "option": null, "qty": 100 },
      { "name": "-OXO스콘", "option": null, "qty": 393 },
      { "name": "-귀리초코칩스콘", "option": null, "qty": 219 },
      { "name": "-더티너티밤스콘", "option": null, "qty": 429 },
      { "name": "-데솔오트밀바", "option": null, "qty": 293 },
      { "name": "-데이츠치아씨드스콘", "option": null, "qty": 106 },
      { "name": "-말차오트초코칩스콘", "option": null, "qty": 109 },
      { "name": "-말차초코칩스콘", "option": null, "qty": 252 },
      { "name": "-바닐라피칸스콘", "option": null, "qty": 358 },
      { "name": "-버터밀크비스킷스콘", "option": null, "qty": 155 },
      { "name": "-배리초코칩스콘", "option": null, "qty": 137 },
      { "name": "-순수오트스콘", "option": null, "qty": 87 },
      { "name": "-카카오스콘", "option": null, "qty": 193 },
      { "name": "-통밀츄러스콘", "option": null, "qty": 250 },
      { "name": "서비스스콘", "option": null, "qty": 110 },
      { "name": "스타터팩", "option": null, "qty": 3 }
    ];

    // Main Configuration Object mapping Excel menu1 relations
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
        hasTri: true, triKey: "-귀리초코칩스콘", triYield: 8,
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
        name: "배리초코칩스콘",
        ovenTri: 7, ovenStickCube: 8,
        creamPerPan: 140,
        hasTri: true, triKey: "-배리초코칩스콘", triYield: 8,
        hasCube: true, cubeKey: "-----[하프팩]배리초코칩미니큐브", cubeYield: 2,
        hasStick: false
      }
    ];

    // Global State management
    let state = {
      orders: {},
      carryOverTri: {},      // S (Triangular Carry over)
      manualAdjustTri: {},   // triX_adj (Manual Triangular adjust)
      carryOverCube: {},     // Z (Mini Cube Carry over)
      productSequence: []    // Dynamic Array representing rows on screen
    };

    // Initialize inputs to 0 and default sequence
    PRODUCTS.forEach(p => {
      state.carryOverTri[p.name] = 0;
      state.manualAdjustTri[p.name] = 0;
      state.carryOverCube[p.name] = 0;
    });

    // Default Sequence Setup
    function initializeSequence() {
      state.productSequence = PRODUCTS.map(p => ({
        id: p.name,
        type: 'product',
        name: p.name
      }));
    }

    // Run when script loads
    document.addEventListener("DOMContentLoaded", () => {
      // Safety check for XLSX library load
      if (typeof XLSX === 'undefined') {
        console.error("SheetJS (XLSX) library failed to load.");
        alert("엑셀 라이브러리(SheetJS)가 정상적으로 로드되지 않았습니다. 인터넷 연결이 원활한지 확인해 주시거나 페이지를 새로고침(F5) 해보세요.");
      }
      initializeSequence();
      setupDragAndDrop();
      setupEventListeners();
      
      // Load sample data by default on load
      loadData(DEFAULT_ORDERS);
      
      // Update print dates
      const formattedDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      document.getElementById("printDate1").innerText = "출력일시: " + formattedDate;
      document.getElementById("printDate2").innerText = "출력일시: " + formattedDate;
    });

    // Specific page printing controller
    function printPage(mode) {
      if (mode === 'all') {
        document.body.removeAttribute("data-print-mode");
      } else {
        document.body.setAttribute("data-print-mode", mode);
      }
      
      window.print();
      
      // Reset layout after printing popup opens
      setTimeout(() => {
        document.body.removeAttribute("data-print-mode");
      }, 1000);
    }

    // Theme Selector toggle logic
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "light") {
        document.documentElement.removeAttribute("data-theme");
        themeToggle.innerHTML = "<span>🌙</span> Dark Theme";
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggle.innerHTML = "<span>☀️</span> Light Theme";
      }
    });

    // Setup input listeners to trigger live recalculation
    function setupEventListeners() {
      // Load sample data button
      document.getElementById("loadSampleBtn").addEventListener("click", () => {
        loadData(DEFAULT_ORDERS);
      });

      // Clear button
      document.getElementById("clearDataBtn").addEventListener("click", () => {
        loadData([]);
        document.getElementById("rawTextarea").value = "";
      });

      // Raw parse button
      document.getElementById("parseRawBtn").addEventListener("click", () => {
        const txt = document.getElementById("rawTextarea").value.trim();
        if (!txt) return;
        try {
          if (txt.startsWith("[") || txt.startsWith("{")) {
            const parsed = JSON.parse(txt);
            loadData(parsed);
          } else {
            const rows = txt.split("\n");
            const parsed = rows.map(r => {
              const parts = r.split(",");
              return {
                name: parts[0] ? parts[0].trim() : "",
                option: parts[1] ? parts[1].trim() : null,
                qty: parts[2] ? parseInt(parts[2].trim(), 10) || 0 : 0
              };
            }).filter(r => r.name);
            loadData(parsed);
          }
        } catch (e) {
          alert("데이터 형식 파싱 중 오류가 발생했습니다: " + e.message);
        }
      });

      // Add Spacer Button
      document.getElementById("addSpacerBtn").addEventListener("click", () => {
        state.productSequence.push({
          id: "spacer-" + Date.now(),
          type: "spacer",
          name: "--------------------"
        });
        calculateAndRender();
      });
    }

    // Drag & Drop logic for table rows
    let draggedIndex = null;

    function handleDragStart(e, index) {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = "move";
      const tr = e.currentTarget;
      tr.classList.add("dragging-row");
    }

    // Drag over
    function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }

    // Drag end
    function handleDragEnd(e) {
      const tr = e.currentTarget;
      tr.classList.remove("dragging-row");
      draggedIndex = null;
    }

    // Drop handler
    function handleDrop(e, index) {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const seq = state.productSequence;
      const draggedItem = seq[draggedIndex];

      seq.splice(draggedIndex, 1);
      seq.splice(index, 0, draggedItem);

      draggedIndex = null;
      calculateAndRender();
    }

    // Update spacer name
    function updateSpacerName(index, val) {
      state.productSequence[index].name = val;
      // Triggers oven table update dynamically
      renderOvenTable(state.lastComputedData || {});
    }

    // Delete spacer
    function deleteSpacer(index) {
      state.productSequence.splice(index, 1);
      calculateAndRender();
    }

    // Drop zone logic
    function setupDragAndDrop() {
      const dropZone = document.getElementById("dropZone");
      const fileInput = document.getElementById("fileInput");

      dropZone.addEventListener("click", () => fileInput.click());
      
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--border-focus)";
        dropZone.style.background = "var(--accent-glow)";
      });

      dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.background = "rgba(255, 255, 255, 0.01)";
      });

      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.background = "rgba(255, 255, 255, 0.01)";
        
        const files = e.dataTransfer.files;
        if (files.length) {
          handleExcelFile(files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files.length) {
          handleExcelFile(files[0]);
        }
      });
    }

    // Excel Parser using SheetJS (Safe with robust error detection)
    function handleExcelFile(file) {
      if (typeof XLSX === 'undefined') {
        alert("엑셀 라이브러리(SheetJS)가 누락되었습니다. 페이지를 새로고침 하거나 네트워크 연결을 확인하십시오.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          if (!workbook || !workbook.SheetNames.length) {
            throw new Error("엑셀 파일에 유효한 시트가 존재하지 않습니다.");
          }
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          if (!rows || rows.length === 0) {
            throw new Error("엑셀 시트 내용이 비어있습니다.");
          }
          
          const headers = rows[0] || [];
          let nameColIdx = headers.findIndex(h => String(h).includes("상품명"));
          let optionColIdx = headers.findIndex(h => String(h).includes("옵션"));
          let qtyColIdx = headers.findIndex(h => String(h).includes("수량"));

          if (nameColIdx === -1) nameColIdx = 4; // Col E
          if (optionColIdx === -1) optionColIdx = 12; // Col M
          if (qtyColIdx === -1) qtyColIdx = 16; // Col Q

          const parsed = [];
          for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            if (!row) continue; // Skip undefined rows safely
            const name = row[nameColIdx];
            const option = row[optionColIdx];
            const qty = parseInt(row[qtyColIdx] || 0, 10);
            if (name) {
              parsed.push({
                name: String(name).trim(),
                option: option ? String(option).trim() : null,
                qty: qty
              });
            }
          }
          
          loadData(parsed);
          document.getElementById("rawTextarea").value = JSON.stringify(parsed, null, 2);
        } catch (error) {
          console.error("Excel upload parsing exception:", error);
          alert("업로드하신 엑셀 파일을 해석하지 못했습니다.\n원인: " + error.message);
        }
      };
      reader.onerror = (err) => {
        console.error("File reader error:", err);
        alert("엑셀 파일을 읽는 과정에서 에러가 발생했습니다: " + err);
      };
      reader.readAsArrayBuffer(file);
    }

    // Populate data into reactive state and recalculate
    function loadData(parsedRecords) {
      state.orders = {};
      parsedRecords.forEach(rec => {
        const key = `${rec.name.trim()}${rec.option ? rec.option.trim() : ""}`;
        state.orders[key] = (state.orders[key] || 0) + rec.qty;
      });

      calculateAndRender();
    }

    // Lookup helper
    function getOrderQty(name, opt) {
      if (!name) return 0;
      const key = `${name.trim()}${opt ? opt.trim() : ""}`;
      return state.orders[key] || 0;
    }

    // Main Calculation and Rendering loop
    function calculateAndRender() {
      const starterPack = getOrderQty("스타터팩", null);
      const serviceScone = getOrderQty("서비스스콘", null);

      // Compute row values for all predefined products
      const computedData = {};
      PRODUCTS.forEach(prod => {
        const rowData = { ...prod };

        // A. Mini Cube Calculations
        if (prod.hasCube) {
          let ordersCube = getOrderQty(prod.cubeKey, null);
          if (prod.cubeStarter) {
            ordersCube += starterPack;
          }

          rowData.cubeOrders = ordersCube;
          rowData.cubeZ = state.carryOverCube[prod.name] || 0; // Carry-over Stock (Z)

          if (prod.cubeYield === 4) { // [미니쉐이크] products (yield = 4)
            rowData.cubeX = Math.ceil(ordersCube / 4);
            rowData.cubeAA = rowData.cubeX * 4 - ordersCube + rowData.cubeZ;
            if (rowData.cubeZ > 0 && rowData.cubeAA >= 4) {
              rowData.cubeY = rowData.cubeX - 1;
              rowData.cubeAB = rowData.cubeAA - 4;
            } else {
              rowData.cubeY = rowData.cubeX;
              rowData.cubeAB = rowData.cubeAA;
            }
          } else { // Normal mini cube (yield = 2)
            rowData.cubeX = Math.ceil(ordersCube / 2);
            rowData.cubeAA = rowData.cubeX * 2 - ordersCube;
            if (rowData.cubeAA === 1) {
              rowData.cubeY = rowData.cubeX - 0.5;
            } else {
              rowData.cubeY = rowData.cubeX;
            }
            rowData.cubeAB = 0; // Raw remaining handles it, final remainder effectively 0
          }
        } else {
          rowData.cubeOrders = 0;
          rowData.cubeX = 0;
          rowData.cubeY = 0;
          rowData.cubeZ = 0;
          rowData.cubeAA = 0;
          rowData.cubeAB = 0;
        }

        // B. Stick Scone Calculations
        if (prod.hasStick) {
          let ordersStick = getOrderQty(prod.stickKey, null);
          let starterStick = prod.stickStarter ? starterPack : 0;
          
          rowData.stickAC = Math.ceil((starterStick / 9) + (ordersStick / 3));
          rowData.stickAD = rowData.stickAC * 9 - (starterStick + ordersStick * 3);
        } else {
          rowData.stickAC = 0;
          rowData.stickAD = 0;
        }

        // C. Triangular Scone Calculations
        if (prod.hasTri) {
          let ordersTri = getOrderQty(prod.triKey, null);
          if (prod.triStarter) {
            ordersTri += starterPack;
          }
          rowData.triR = ordersTri;
          rowData.triS = state.carryOverTri[prod.name] || 0; // Carry-over Stock (S)
          rowData.triNet = Math.max(0, rowData.triR - rowData.triS);
          
          const yieldTri = prod.triYield;
          rowData.triT = Math.ceil(rowData.triNet / yieldTri);
          rowData.triV = rowData.triT * yieldTri - rowData.triNet;

          // Adjusted Pans (U) formula based on Mini Cube Raw Remaining AA
          const cubeAA = rowData.cubeAA || 0;
          if (cubeAA === 1 && rowData.triV >= (yieldTri / 2)) {
            rowData.triU_calc = rowData.triT - 0.5;
          } else if (cubeAA === 1) {
            rowData.triU_calc = rowData.triT + 0.5;
          } else {
            rowData.triU_calc = rowData.triT;
          }
          
          rowData.triX_adj = state.manualAdjustTri[prod.name] || 0;
          rowData.triU = rowData.triU_calc + rowData.triX_adj;

          // Final Remaining (W) - Manual adjustment increases leftover by yield * pans!
          const baseTriAA = rowData.triV + (yieldTri / 2) * cubeAA;
          const baseTriAA_wrapped = baseTriAA >= yieldTri ? baseTriAA - yieldTri : baseTriAA;
          rowData.triW = baseTriAA_wrapped + rowData.triX_adj * yieldTri;
        } else {
          rowData.triR = 0;
          rowData.triS = 0;
          rowData.triNet = 0;
          rowData.triT = 0;
          rowData.triU_calc = 0;
          rowData.triX_adj = 0;
          rowData.triU = 0;
          rowData.triV = 0;
          rowData.triW = 0;
        }

        // D. Totals
        rowData.totalQ = rowData.triU + rowData.stickAC + rowData.cubeY;
        rowData.creamAK = rowData.totalQ * prod.creamPerPan;

        computedData[prod.name] = rowData;
      });

      state.lastComputedData = computedData; // Cache to handle dynamic spacer input changes

      renderMainTable(computedData);
      renderOvenTable(computedData);
      renderSubMaterialsAndService(computedData, serviceScone, starterPack);
      renderKPIs(computedData, serviceScone);
    }

    // Render KPI Cards (Web Dashboard view)
    function renderKPIs(computedData, serviceSconeOrdered) {
      const rows = Object.values(computedData);
      
      // 1. Total Pans
      const totalPans = rows.reduce((sum, r) => sum + r.totalQ, 0);
      document.getElementById("kpiTotalPans").innerText = `${totalPans} 판`;

      // 2. Whipping Cream
      const sumCream = rows.reduce((sum, r) => sum + r.creamAK, 0);
      const creamLitres = Math.round(sumCream / 1000);
      document.getElementById("kpiCream").innerText = `${creamLitres} L`;
      document.getElementById("matCream").innerText = `${creamLitres} L`;

      // 3. Service Ratio & Shortage
      const sumTriW = rows.reduce((sum, r) => sum + r.triW, 0);
      const sumStickAD = rows.reduce((sum, r) => sum + r.stickAD, 0);
      const extraScones = sumTriW + sumStickAD;
      
      document.getElementById("kpiServiceRatio").innerText = `${serviceSconeOrdered} / ${extraScones}`;

      const shortage = serviceSconeOrdered - extraScones;
      if (shortage > 0) {
        document.getElementById("kpiServiceShortage").innerText = `${shortage} 개`;
        document.getElementById("kpiServiceShortage").parentElement.parentElement.style.borderColor = "var(--danger-color)";
        document.getElementById("alertBanner").style.display = "flex";
        document.getElementById("svcShortage").innerText = `${shortage} 개`;
        document.getElementById("svcLeftover").innerText = "없음";
      } else {
        document.getElementById("kpiServiceShortage").innerText = `0 개 (충분)`;
        document.getElementById("kpiServiceShortage").parentElement.parentElement.style.borderColor = "var(--border-color)";
        document.getElementById("alertBanner").style.display = "none";
        document.getElementById("svcShortage").innerText = "없음";
        document.getElementById("svcLeftover").innerText = `${Math.abs(shortage)} 개`;
      }
    }

    // Render Main Production Table (menu1 layout)
    function renderMainTable(computedData) {
      const tbody = document.getElementById("productionTableBody");
      tbody.innerHTML = "";

      let sumQ = 0, sumR = 0, sumU = 0, sumW = 0;
      let sumCubeY = 0, sumCubeAB = 0;
      let sumStickAC = 0, sumStickAD = 0;

      state.productSequence.forEach((item, index) => {
        const tr = document.createElement("tr");
        
        tr.setAttribute("draggable", "true");
        tr.addEventListener("dragstart", (e) => handleDragStart(e, index));
        tr.addEventListener("dragover", handleDragOver);
        tr.addEventListener("dragend", handleDragEnd);
        tr.addEventListener("drop", (e) => handleDrop(e, index));

        if (item.type === 'spacer') {
          // Spacer input is strictly limited to the "품명" (hl-name) column width
          tr.innerHTML = `
            <td class="no-print col-drag-handle" style="cursor: grab; text-align: center;">☰</td>
            <td class="hl-name" style="background: rgba(255,255,255,0.02);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="text" class="spacer-input-field" value="${item.name}" oninput="updateSpacerName(${index}, this.value)" placeholder="구분선/공백"/>
                <button onclick="deleteSpacer(${index})" class="btn btn-secondary no-print" style="padding: 2px 6px; font-size: 10px; line-height: 1; border-radius: 4px;">x</button>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="no-print col-drag-handle"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          `;
          tbody.appendChild(tr);
          return;
        }

        const r = computedData[item.name];
        if (!r) return;

        sumQ += r.totalQ;
        sumR += r.triR;
        sumU += r.triU;
        sumW += r.triW;
        sumCubeY += r.cubeY;
        sumCubeAB += (r.cubeYield === 4 ? r.cubeAB : r.cubeAA); // Show remaining bags
        sumStickAC += r.stickAC;
        sumStickAD += r.stickAD;

        const formatNum = (v) => v || "";
        const formatBadge = (v, cl) => v ? `<span class="badge-oven ${cl}">${v}</span>` : "";

        tr.innerHTML = `
          <td class="no-print col-drag-handle" style="cursor: grab; text-align: center;">☰</td>
          <td class="hl-name">${r.name}</td>
          <td>${formatBadge(r.ovenTri, 'badge-tri')}</td>
          <td>${formatBadge(r.ovenStickCube, 'badge-sc')}</td>
          <td class="hl-pans">${r.totalQ}</td>
          
          <!-- Tri -->
          <td>${formatNum(r.triR)}</td>
          <td>${r.hasTri ? `<input type="number" class="table-input no-print" data-name="${r.name}" data-field="carryOverTri" value="${r.triS}" min="0"/><span class="print-only">${r.triS || 0}</span>` : ""}</td>
          <td>${r.hasTri ? `<input type="number" class="table-input no-print" data-name="${r.name}" data-field="manualAdjustTri" value="${r.triX_adj}" min="-50" max="50"/><span class="print-only">${r.triX_adj || 0}</span>` : ""}</td>
          <td class="hl-adjusted-pans">${r.hasTri ? r.triU : ""}</td>
          <td>${r.hasTri ? r.triW : ""}</td>
          
          <!-- Cube -->
          <td>${r.hasCube ? `<input type="number" class="table-input no-print" data-name="${r.name}" data-field="carryOverCube" value="${r.cubeZ}" min="0"/><span class="print-only">${r.cubeZ || 0}</span>` : ""}</td>
          <td class="hl-adjusted-pans">${r.hasCube ? r.cubeY : ""}</td>
          <td class="hl-rem">${r.hasCube ? (r.cubeYield === 4 ? r.cubeAB : r.cubeAA) : ""}</td>
          
          <!-- Stick -->
          <td class="hl-adjusted-pans">${r.hasStick ? r.stickAC : ""}</td>
          <td class="hl-rem">${r.hasStick ? r.stickAD : ""}</td>
        `;
        tbody.appendChild(tr);
      });

      // Update footer sums
      document.getElementById("sumTotalPans").innerText = `총 ${sumQ}판`;
      document.getElementById("sumTriR").innerText = sumR;
      document.getElementById("sumTriU").innerText = sumU;
      document.getElementById("sumTriW").innerText = sumW;
      document.getElementById("sumCubeY").innerText = sumCubeY;
      document.getElementById("sumCubeAB").innerText = sumCubeAB;
      document.getElementById("sumStickAC").innerText = sumStickAC;
      document.getElementById("sumStickAD").innerText = sumStickAD;

      // Attach dynamic event listeners to inputs
      tbody.querySelectorAll("input.table-input").forEach(input => {
        input.addEventListener("input", (e) => {
          const name = e.target.getAttribute("data-name");
          const field = e.target.getAttribute("data-field");
          const val = parseInt(e.target.value, 10) || 0;
          
          state[field][name] = val;
          calculateAndRender();
        });
      });
    }

    // Render Sub-materials and Service Scones details
    function renderSubMaterialsAndService(computedData, serviceSconeOrdered, starterPack) {
      const rows = Object.values(computedData);
      const sumTriW = rows.reduce((sum, r) => sum + r.triW, 0);
      const sumStickAD = rows.reduce((sum, r) => sum + r.stickAD, 0);
      const totalExtra = sumTriW + sumStickAD;

      document.getElementById("svcOrdered").innerText = `${serviceSconeOrdered} 개`;
      document.getElementById("svcExtra").innerText = `${totalExtra} 개`;

      // Sub-materials Lookups (menu1)
      const matGreek = getOrderQty("-----GREEK YOGURT", null);
      const matSmooth = getOrderQty("-------[Gourmet M]피넛머드", "[스무스]");
      const matCrunch = getOrderQty("-------[Gourmet M]피넛머드", "[크런치]");
      const matGreen = getOrderQty("------대파분태", null);
      const matPave = getOrderQty("-----[미니쉐이크]카카오파베", null);
      const matInjeolmi = getOrderQty("-----[미니쉐이크]쑥인절미", null) + starterPack;
      const matStarter = starterPack;
      const matImagine = getOrderQty("이매진 머드", null);
      const matOpp = getOrderQty("-------소분용 OPP 봉투 20매", "[식사용]");

      document.getElementById("matGreek").innerText = `${matGreek} 개`;
      document.getElementById("matSmooth").innerText = `${matSmooth} 개`;
      document.getElementById("matCrunch").innerText = `${matCrunch} 개`;
      document.getElementById("matGreen").innerText = `${matGreen} 개`;
      document.getElementById("matPave").innerText = `${matPave} 개`;
      document.getElementById("matInjeolmi").innerText = `${matInjeolmi} 개`;
      document.getElementById("matStarter").innerText = `${matStarter} 개`;
      document.getElementById("matImagine").innerText = `${matImagine} 개`;
      document.getElementById("matOpp").innerText = `${matOpp} 개`;
    }

    // Render Oven Summary Table (Page 2) with synchronized spacer rows
    function renderOvenTable(computedData) {
      const tbody = document.getElementById("ovenTableBody");
      tbody.innerHTML = "";

      let sumAJ = 0, sumAK = 0, sumAL = 0, sumAN = 0;

      state.productSequence.forEach(item => {
        if (item.type === 'spacer') {
          // Render Spacer row in Oven Table
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td style="text-align: left; padding-left: 16px; font-weight: bold; background: rgba(255,255,255,0.02);">${item.name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          `;
          tbody.appendChild(tr);
          return;
        }

        const r = computedData[item.name];
        if (!r || !r.hasTri) return;

        const valAJ = r.triU; // Adjusted Triangular Pans (AJ)
        const valAK = Math.floor(valAJ / 3); // Full Pans (AK)
        const valAM = valAJ - (3 * valAK); // Remaining batter pans 1 (AM)
        
        let valAL = valAK; // Full pans 3-pans (AL)
        if (valAK > 0) {
          if (valAM > 0 && valAK > 1) {
            valAL = valAK - 1;
          }
        }
        
        const valAN = 3 * (valAK - valAL) + valAM; // Remaining batter pans 2 (AN)

        sumAJ += valAJ;
        sumAK += valAK;
        sumAL += valAL;
        sumAN += valAN;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="text-align: left; padding-left: 16px; font-weight: 500;">${r.name}</td>
          <td><span class="badge-oven badge-tri">오븐 ${r.ovenTri}</span></td>
          <td class="hl-pans">${valAJ}</td>
          <td>${valAK}</td>
          <td class="hl-adjusted-pans">${valAL}</td>
          <td class="hl-rem" style="font-weight: bold; background: rgba(245, 158, 11, 0.05);">${valAN}</td>
        `;
        tbody.appendChild(tr);
      });

      document.getElementById("ovenSumA").innerText = sumAJ;
      document.getElementById("ovenSumFull").innerText = sumAK;
      document.getElementById("ovenSumFull3").innerText = sumAL;
      document.getElementById("ovenSumRem2").innerText = sumAN;
    }