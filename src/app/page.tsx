'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { supabase, hasValidSupabaseConfig } from '../lib/supabase';
import { Product, OrderWithProduct, CalculatedRow, OvenBatch } from '../lib/types';

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

// Main Predefined Products
const PRODUCTS_MOCK = [
  { name: "말차초코칩스콘", ovenTri: 1, ovenStickCube: null, creamPerPan: 170, hasTri: true, triKey: "-말차초코칩스콘", triYield: 8, hasCube: false, hasStick: false },
  { name: "츄러스콘", ovenTri: 2, ovenStickCube: 4, creamPerPan: 174, hasTri: true, triKey: "-통밀츄러스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]통밀츄러미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]통밀츄러스틱 3팩", stickYield: 9, stickStarter: true },
  { name: "데이츠치아씨드스콘", ovenTri: 11, ovenStickCube: 4, creamPerPan: 160, hasTri: true, triKey: "-데이츠치아씨드스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]데치미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]데치스틱 3팩", stickYield: 9, stickStarter: false },
  { name: "바닐라피칸스콘", ovenTri: 4, ovenStickCube: 4, creamPerPan: 170, hasTri: true, triKey: "-바닐라피칸스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]바닐라피칸미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]바닐라피칸스틱 3팩", stickYield: 9, stickStarter: true },
  { name: "버터밀크비스킷스콘", ovenTri: 7, ovenStickCube: 8, creamPerPan: 130, hasTri: true, triKey: "-버터밀크비스킷스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]버터밀크비스킷미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]버터밀크비스킷스틱 3팩", stickYield: 9, stickStarter: false },
  { name: "[미니쉐이크]쑥인절미", ovenTri: null, ovenStickCube: 2, creamPerPan: 190, hasTri: false, hasCube: true, cubeKey: "-----[미니쉐이크]쑥인절미", cubeYield: 4, cubeStarter: true, hasStick: false },
  { name: "데솔오트밀바", ovenTri: 1, ovenStickCube: 4, creamPerPan: 160, hasTri: true, triKey: "-데솔오트밀바", triYield: 10, hasCube: true, cubeKey: "-----[하프팩]데솔오바미니큐브", cubeYield: 2, hasStick: false },
  { name: "[미니쉐이크]카카오파베", ovenTri: null, ovenStickCube: 2, creamPerPan: 180, hasTri: false, hasCube: true, cubeKey: "-----[미니쉐이크]카카오파베", cubeYield: 4, hasStick: false },
  { name: "카카오스콘", ovenTri: 1, ovenStickCube: 2, creamPerPan: 180, hasTri: true, triKey: "-카카오스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]카카오미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]카카오스틱 3팩", stickYield: 9, stickStarter: false },
  { name: "OXO스콘", ovenTri: 5, ovenStickCube: 8, creamPerPan: 150, hasTri: true, triKey: "-OXO스콘", triYield: 8, triStarter: true, hasCube: true, cubeKey: "-----[하프팩]OXO미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]OXO스틱 3팩", stickYield: 9, stickStarter: false },
  { name: "순수오트스콘", ovenTri: 5, ovenStickCube: 8, creamPerPan: 140, hasTri: true, triKey: "-순수오트스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]순수오트미니큐브", cubeYield: 2, hasStick: false },
  { name: "귀리초코칩스콘", ovenTri: 1, ovenStickCube: 4, creamPerPan: 180, hasTri: true, triKey: "-귀리초코칩스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]귀초칩미니큐브", cubeYield: 2, hasStick: false },
  { name: "딥카카오트스콘", ovenTri: 7, ovenStickCube: 7, creamPerPan: 130, hasTri: true, triKey: "-딥카카오트스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]딥카카오트미니큐브", cubeYield: 2, hasStick: false },
  { name: "더티너티밤스콘", ovenTri: 7, ovenStickCube: 8, creamPerPan: 110, hasTri: true, triKey: "-더티너티밤스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]더티너티밤미니큐브", cubeYield: 2, hasStick: true, stickKey: "----[세트]더티너티밤스틱 3팩", stickYield: 9, stickStarter: false },
  { name: "말차오트초코칩스콘", ovenTri: 7, ovenStickCube: 8, creamPerPan: 125, hasTri: true, triKey: "-말차오트초코칩스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]말차오트초코칩미니큐브", cubeYield: 2, hasStick: false },
  { name: "배리초코칩스콘", ovenTri: 7, ovenStickCube: 8, creamPerPan: 140, hasTri: true, triKey: "-배리초코칩스콘", triYield: 8, hasCube: true, cubeKey: "-----[하프팩]배리초코칩미니큐브", cubeYield: 2, hasStick: false }
];

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [rawText, setRawText] = useState<string>('');
  
  // App States
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [carryOverTri, setCarryOverTri] = useState<Record<string, number>>({});
  const [manualAdjustTri, setManualAdjustTri] = useState<Record<string, number>>({});
  const [carryOverCube, setCarryOverCube] = useState<Record<string, number>>({});
  const [productSequence, setProductSequence] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIdxRef = useRef<number | null>(null);

  // Initialize
  useEffect(() => {
    // Sequence setup
    const seq = PRODUCTS_MOCK.map(p => ({
      id: p.name,
      type: 'product',
      name: p.name
    }));
    setProductSequence(seq);

    // Initial Carryovers & adjust
    const initC: Record<string, number> = {};
    const initM: Record<string, number> = {};
    PRODUCTS_MOCK.forEach(p => {
      initC[p.name] = 0;
      initM[p.name] = 0;
    });
    setCarryOverTri(initC);
    setManualAdjustTri(initM);
    setCarryOverCube(initC);

    // Load initial default dataset
    loadData(DEFAULT_ORDERS);

    // Set document print dates
    const formatted = new Date().toLocaleDateString('ko-KR', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const print1 = document.getElementById("printDate1");
    const print2 = document.getElementById("printDate2");
    if (print1) print1.innerText = "출력일시: " + formatted;
    if (print2) print2.innerText = "출력일시: " + formatted;
  }, []);

  // Theme Sync
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Load raw array parsed from Excel or Textarea
  function loadData(records: Array<{ name: string; option: string | null; qty: number }>) {
    const nextOrders: Record<string, number> = {};
    records.forEach(rec => {
      const key = `${rec.name.trim()}${rec.option ? rec.option.trim() : ""}`;
      nextOrders[key] = (nextOrders[key] || 0) + rec.qty;
    });
    setOrders(nextOrders);
    setRawText(JSON.stringify(records, null, 2));
  }

  // Lookup helper
  function getOrderQty(name: string, opt: string | null = null) {
    if (!name) return 0;
    const key = `${name.trim()}${opt ? opt.trim() : ""}`;
    return orders[key] || 0;
  }

  // Calculate live outputs reactively
  const computedData = useMemo(() => {
    const starterPack = getOrderQty("스타터팩", null);
    const serviceScone = getOrderQty("서비스스콘", null);

    const data: Record<string, any> = {};

    PRODUCTS_MOCK.forEach(prod => {
      const r: any = { ...prod };

      // A. Mini Cube Calculations
      if (prod.hasCube) {
        let ordersCube = getOrderQty(prod.cubeKey!, null);
        if (prod.cubeStarter) {
          ordersCube += starterPack;
        }

        r.cubeOrders = ordersCube;
        r.cubeZ = carryOverCube[prod.name] || 0;

        if (prod.cubeYield === 4) { // [미니쉐이크] products (yield = 4)
          r.cubeX = Math.ceil(ordersCube / 4);
          r.cubeAA = r.cubeX * 4 - ordersCube + r.cubeZ;
          if (r.cubeZ > 0 && r.cubeAA >= 4) {
            r.cubeY = r.cubeX - 1;
            r.cubeAB = r.cubeAA - 4;
          } else {
            r.cubeY = r.cubeX;
            r.cubeAB = r.cubeAA;
          }
        } else { // Normal mini cube (yield = 2)
          r.cubeX = Math.ceil(ordersCube / 2);
          r.cubeAA = r.cubeX * 2 - ordersCube;
          if (r.cubeAA === 1) {
            r.cubeY = r.cubeX - 0.5;
          } else {
            r.cubeY = r.cubeX;
          }
          r.cubeAB = 0;
        }
      } else {
        r.cubeOrders = 0;
        r.cubeX = 0;
        r.cubeY = 0;
        r.cubeZ = 0;
        r.cubeAA = 0;
        r.cubeAB = 0;
      }

      // B. Stick Scone Calculations
      if (prod.hasStick) {
        let ordersStick = getOrderQty(prod.stickKey!, null);
        let starterStick = prod.stickStarter ? starterPack : 0;
        
        r.stickAC = Math.ceil((starterStick / 9) + (ordersStick / 3));
        r.stickAD = r.stickAC * 9 - (starterStick + ordersStick * 3);
      } else {
        r.stickAC = 0;
        r.stickAD = 0;
      }

      // C. Triangular Scone Calculations
      if (prod.hasTri) {
        let ordersTri = getOrderQty(prod.triKey!, null);
        if (prod.triStarter) {
          ordersTri += starterPack;
        }
        r.triR = ordersTri;
        r.triS = carryOverTri[prod.name] || 0;
        r.triNet = Math.max(0, r.triR - r.triS);
        
        const yieldTri = prod.triYield!;
        r.triT = Math.ceil(r.triNet / yieldTri);
        r.triV = r.triT * yieldTri - r.triNet;

        const cubeAA = r.cubeAA || 0;
        if (cubeAA === 1 && r.triV >= (yieldTri / 2)) {
          r.triU_calc = r.triT - 0.5;
        } else if (cubeAA === 1) {
          r.triU_calc = r.triT + 0.5;
        } else {
          r.triU_calc = r.triT;
        }
        
        r.triX_adj = manualAdjustTri[prod.name] || 0;
        r.triU = r.triU_calc + r.triX_adj;

        const baseTriAA = r.triV + (yieldTri / 2) * cubeAA;
        const baseTriAA_wrapped = baseTriAA >= yieldTri ? baseTriAA - yieldTri : baseTriAA;
        r.triW = baseTriAA_wrapped + r.triX_adj * yieldTri;
      } else {
        r.triR = 0;
        r.triS = 0;
        r.triNet = 0;
        r.triT = 0;
        r.triU_calc = 0;
        r.triX_adj = 0;
        r.triU = 0;
        r.triV = 0;
        r.triW = 0;
      }

      // D. Totals
      r.totalQ = r.triU + r.stickAC + r.cubeY;
      r.creamAK = r.totalQ * prod.creamPerPan;

      data[prod.name] = r;
    });

    return data;
  }, [orders, carryOverTri, manualAdjustTri, carryOverCube]);

  // Overall summary indicators
  const totals = useMemo(() => {
    const serviceSconeOrdered = getOrderQty("서비스스콘", null);
    const rows = Object.values(computedData);
    
    const totalPans = rows.reduce((sum, r) => sum + r.totalQ, 0);
    const sumCream = rows.reduce((sum, r) => sum + r.creamAK, 0);
    const creamLitres = Math.round(sumCream / 1000);

    const sumTriW = rows.reduce((sum, r) => sum + r.triW, 0);
    const sumStickAD = rows.reduce((sum, r) => sum + r.stickAD, 0);
    const extraScones = sumTriW + sumStickAD;

    const shortage = serviceSconeOrdered - extraScones;

    return {
      totalPans,
      creamLitres,
      extraScones,
      shortage,
      serviceSconeOrdered
    };
  }, [computedData, orders]);

  // Sub-materials breakdown
  const subMaterials = useMemo(() => {
    const starterPack = getOrderQty("스타터팩", null);
    
    return {
      matGreek: getOrderQty("-----GREEK YOGURT", null),
      matSmooth: getOrderQty("-------[Gourmet M]피넛머드", "[스무스]"),
      matCrunch: getOrderQty("-------[Gourmet M]피넛머드", "[크런치]"),
      matGreen: getOrderQty("------대파분태", null),
      matPave: getOrderQty("-----[미니쉐이크]카카오파베", null),
      matInjeolmi: getOrderQty("-----[미니쉐이크]쑥인절미", null) + starterPack,
      matStarter: starterPack,
      matImagine: getOrderQty("이매진 머드", null),
      matOpp: getOrderQty("-------소분용 OPP 봉투 20매", "[식사용]")
    };
  }, [orders]);

  // Excel parsing handler
  function handleExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        if (!workbook || !workbook.SheetNames.length) {
          throw new Error("엑셀 파일에 유효한 시트가 없습니다.");
        }
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (!rows || rows.length === 0) {
          throw new Error("시트가 비어있습니다.");
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
          if (!row) continue;
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
      } catch (err: any) {
        alert("엑셀 파일 해석 오류: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Textarea parsing helper
  function parseRawText() {
    const txt = rawText.trim();
    if (!txt) return;
    try {
      if (txt.startsWith("[") || txt.startsWith("{")) {
        loadData(JSON.parse(txt));
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
    } catch (e: any) {
      alert("데이터 파싱 중 오류가 발생했습니다: " + e.message);
    }
  }

  // Drag and Drop implementation
  function handleDragStart(idx: number) {
    dragIdxRef.current = idx;
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(targetIdx: number) {
    const sourceIdx = dragIdxRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) return;
    
    const seq = [...productSequence];
    const dragged = seq[sourceIdx];
    seq.splice(sourceIdx, 1);
    seq.splice(targetIdx, 0, dragged);
    
    setProductSequence(seq);
    dragIdxRef.current = null;
  }

  // Spacers additions
  function addSpacer() {
    const seq = [...productSequence];
    seq.push({
      id: "spacer-" + Date.now(),
      type: "spacer",
      name: "--------------------"
    });
    setProductSequence(seq);
  }

  function updateSpacerName(idx: number, val: string) {
    const seq = [...productSequence];
    seq[idx].name = val;
    setProductSequence(seq);
  }

  function deleteSpacer(idx: number) {
    const seq = [...productSequence];
    seq.splice(idx, 1);
    setProductSequence(seq);
  }

  // Page specific print controller
  function printPage(mode: 'all' | 'page1' | 'page2') {
    if (mode === 'all') {
      document.body.removeAttribute("data-print-mode");
    } else {
      document.body.setAttribute("data-print-mode", mode);
    }
    window.print();
    setTimeout(() => {
      document.body.removeAttribute("data-print-mode");
    }, 1000);
  }

  // Handle manual input updates inside grid rows
  function handleInputVal(name: string, field: string, value: number) {
    if (field === 'carryOverTri') {
      setCarryOverTri(prev => ({ ...prev, [name]: value }));
    } else if (field === 'manualAdjustTri') {
      setManualAdjustTri(prev => ({ ...prev, [name]: value }));
    } else if (field === 'carryOverCube') {
      setCarryOverCube(prev => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div className="dashboard-container">
      
      {/* Top Header Card */}
      <header className="page-1 page-2">
        <div className="brand">
          <h1>스콘 생산량 관리 시스템 (Next.js Portal)</h1>
          <p>엑셀 데이터 업로드 &amp; 실시간 생산공정 배분 솔루션</p>
        </div>
        <div className="btn-group no-print">
          <button 
            id="themeToggle" 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
            className="theme-toggle-btn"
          >
            {theme === 'light' ? '🌙 Dark Theme' : '☀️ Light Theme'}
          </button>
        </div>
      </header>

      {/* Main Drag-Drop Upload UI Panel */}
      <div className="io-panel no-print page-1">
        <div 
          id="dropZone" 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-focus)";
            el.style.background = "var(--accent-glow)";
          }}
          onDragLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-color)";
            el.style.background = "rgba(255, 255, 255, 0.01)";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-color)";
            el.style.background = "rgba(255, 255, 255, 0.01)";
            const files = e.dataTransfer.files;
            if (files.length) handleExcelFile(files[0]);
          }}
          className="card upload-zone"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>엑셀 파일을 드래그 앤 드롭 하거나 클릭하여 업로드</span>
          <small>Test1.xlsx 주문 현황 데이터 자동 해석</small>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) handleExcelFile(files[0]);
            }} 
            className="hidden" 
            id="fileInput" 
            accept=".xlsx, .xls"
          />
        </div>

        <div className="card">
          <div className="card-title">
            <span>주문 데이터 분석 및 가상 패치</span>
            <span className="text-xs opacity-60">JSON / CSV 포맷 지원</span>
          </div>
          <textarea 
            id="rawTextarea" 
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="raw-input-textarea" 
            placeholder="상품명,옵션,수량 형식 또는 JSON 배열"
          />
          <div className="btn-group">
            <button onClick={parseRawText} className="btn btn-primary" id="parseRawBtn">데이터 해석</button>
            <button onClick={() => loadData(DEFAULT_ORDERS)} className="btn btn-secondary" id="loadSampleBtn">샘플 데이터 로드</button>
            <button onClick={() => loadData([])} className="btn btn-secondary" id="clearDataBtn">비우기</button>
          </div>
        </div>
      </div>

      {/* Alert Notification banner */}
      {totals.shortage > 0 && (
        <div id="alertBanner" className="alert-banner page-1">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">
              <h4>서비스 스콘 생산량 부족 알림</h4>
              <p>주문된 서비스 스콘 대비 남는 여분스콘 생산량이 부족합니다. 아래 표에서 삼각스콘의 수동조정을 조절해 주세요.</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="summary-grid page-1">
        <div className="summary-card">
          <div className="summary-icon-container blue">📊</div>
          <div className="summary-info">
            <span className="summary-label">총 생산 판수</span>
            <span className="summary-value" id="kpiTotalPans">{totals.totalPans} 판</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-container green">🥛</div>
          <div className="summary-info">
            <span className="summary-label">생크림 총 소요량</span>
            <span className="summary-value" id="kpiCream">{totals.creamLitres} L</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-container amber">🧁</div>
          <div className="summary-info">
            <span className="summary-label">서비스 주문 / 여분스콘</span>
            <span className="summary-value" id="kpiServiceRatio">{totals.serviceSconeOrdered} / {totals.extraScones}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-container rose">🚨</div>
          <div className="summary-info">
            <span className="summary-label">서비스 부족분 수량</span>
            <span className="summary-value" id="kpiServiceShortage">
              {totals.shortage > 0 ? `${totals.shortage} 개` : '0 개 (충분)'}
            </span>
          </div>
        </div>
      </div>

      {/* Print Controls Card Section */}
      <div className="card no-print page-1 page-2" style={{ padding: '16px 24px' }}>
        <div className="btn-group" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => printPage('all')} className="btn btn-success">🖨️ A4 전체 인쇄 (2장)</button>
            <button onClick={() => printPage('page1')} className="btn btn-secondary">1페이지 인쇄 (메인생산표)</button>
            <button onClick={() => printPage('page2')} className="btn btn-secondary">2페이지 인쇄 (오븐배치)</button>
          </div>
          <button onClick={addSpacer} id="addSpacerBtn" className="btn btn-primary">+ 구분선/공백 추가</button>
        </div>
      </div>

      {/* Page 1: Main Production Dashboard Grid Table */}
      <div className="page-1">
        <div className="section-title">
          <span>📋 1페이지 : 메인 생산량 집계표</span>
          <span id="printDate1" className="print-only" style={{ fontSize: '11px', fontWeight: 'normal', marginLeft: 'auto' }} />
        </div>
        
        <div className="table-container">
          <table id="productionTable">
            <thead>
              <tr>
                <th rowSpan={2} className="no-print col-drag-handle">정렬</th>
                <th rowSpan={2} style={{ borderRight: '2px solid var(--border-color)' }}>품명</th>
                <th colSpan={2}>오븐</th>
                <th rowSpan={2} className="hl-pans">총 생산<br/>판수 (Q)</th>
                <th colSpan={5} style={{ borderRight: '2px solid var(--border-color)' }}>삼각스콘 (Triangular)</th>
                <th colSpan={3} style={{ borderRight: '2px solid var(--border-color)' }}>미니큐브 (Mini Cube)</th>
                <th colSpan={2}>스틱스콘 (Stick)</th>
              </tr>
              <tr>
                <th className="sub-th">삼각</th>
                <th className="sub-th">큐브/스틱</th>
                <th className="sub-th">주문 (R)</th>
                <th className="sub-th no-print">전날남음 (S)</th>
                <th className="sub-th no-print">수동조정 (X_adj)</th>
                <th className="sub-th hl-adjusted-pans">조정판수 (U)</th>
                <th className="sub-th" style={{ borderRight: '2px solid var(--border-color)' }}>최종남음 (W)</th>
                <th className="sub-th no-print">전날남음 (Z)</th>
                <th className="sub-th hl-adjusted-pans">생산판수 (Y)</th>
                <th className="sub-th hl-rem" style={{ borderRight: '2px solid var(--border-color)' }}>최종남음 (봉투)</th>
                <th className="sub-th hl-adjusted-pans">생산판수 (AC)</th>
                <th className="sub-th hl-rem">최종남음 (개)</th>
              </tr>
            </thead>
            <tbody id="productionTableBody">
              {productSequence.map((item, index) => {
                if (item.type === 'spacer') {
                  return (
                    <tr 
                      key={item.id}
                      draggable 
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                    >
                      <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
                      <td className="hl-name" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="text" 
                            className="spacer-input-field" 
                            value={item.name} 
                            onChange={(e) => updateSpacerName(index, e.target.value)} 
                            placeholder="구분선/공백"
                          />
                          <button onClick={() => deleteSpacer(index)} className="btn btn-secondary no-print" style={{ padding: '2px 6px', fontSize: '10px', lineHeight: 1, borderRadius: '4px' }}>x</button>
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="no-print col-drag-handle"></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  );
                }

                const r = computedData[item.name];
                if (!r) return null;

                return (
                  <tr 
                    key={item.id}
                    draggable 
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
                    <td className="hl-name">{r.name}</td>
                    <td>{r.ovenTri ? <span className="badge-oven badge-tri">오븐 {r.ovenTri}</span> : ''}</td>
                    <td>{r.ovenStickCube ? <span className="badge-oven badge-sc">오븐 {r.ovenStickCube}</span> : ''}</td>
                    <td className="hl-pans">{r.totalQ}</td>
                    
                    {/* Tri */}
                    <td>{r.triR || ''}</td>
                    <td className="no-print">
                      {r.hasTri ? (
                        <input 
                          type="number" 
                          className="table-input" 
                          value={carryOverTri[r.name] || 0} 
                          onChange={(e) => handleInputVal(r.name, 'carryOverTri', parseInt(e.target.value, 10) || 0)} 
                          min="0"
                        />
                      ) : ''}
                    </td>
                    <td className="no-print">
                      {r.hasTri ? (
                        <input 
                          type="number" 
                          className="table-input" 
                          value={manualAdjustTri[r.name] || 0} 
                          onChange={(e) => handleInputVal(r.name, 'manualAdjustTri', parseInt(e.target.value, 10) || 0)} 
                          min="-50" 
                          max="50"
                        />
                      ) : ''}
                    </td>
                    <td className="hl-adjusted-pans">{r.hasTri ? r.triU : ''}</td>
                    <td style={{ borderRight: '2px solid var(--border-color)' }}>{r.hasTri ? r.triW : ''}</td>
                    
                    {/* Cube */}
                    <td className="no-print">
                      {r.hasCube ? (
                        <input 
                          type="number" 
                          className="table-input" 
                          value={carryOverCube[r.name] || 0} 
                          onChange={(e) => handleInputVal(r.name, 'carryOverCube', parseInt(e.target.value, 10) || 0)} 
                          min="0"
                        />
                      ) : ''}
                    </td>
                    <td className="hl-adjusted-pans">{r.hasCube ? r.cubeY : ''}</td>
                    <td className="hl-rem" style={{ borderRight: '2px solid var(--border-color)' }}>
                      {r.hasCube ? (r.cubeYield === 4 ? r.cubeAB : r.cubeAA) : ''}
                    </td>
                    
                    {/* Stick */}
                    <td className="hl-adjusted-pans">{r.hasStick ? r.stickAC : ''}</td>
                    <td className="hl-rem">{r.hasStick ? r.stickAD : ''}</td>
                  </tr>
                );
              })}

              {/* Table Totals Row */}
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', fontWeight: 'bold' }}>
                <td className="no-print col-drag-handle"></td>
                <td className="hl-name" style={{ textAlign: 'center', borderRight: '2px solid var(--border-color)' }}>합계</td>
                <td></td>
                <td></td>
                <td className="hl-pans" id="sumTotalPans">{totals.totalPans}판</td>
                
                {/* Tri */}
                <td id="sumTriR">{Object.values(computedData).reduce((sum, r) => sum + r.triR, 0)}</td>
                <td className="no-print"></td>
                <td className="no-print"></td>
                <td id="sumTriU">{Object.values(computedData).reduce((sum, r) => sum + r.triU, 0)}</td>
                <td id="sumTriW" style={{ borderRight: '2px solid var(--border-color)' }}>{Object.values(computedData).reduce((sum, r) => sum + r.triW, 0)}</td>
                
                {/* Cube */}
                <td className="no-print"></td>
                <td id="sumCubeY">{Object.values(computedData).reduce((sum, r) => sum + r.cubeY, 0)}</td>
                <td id="sumCubeAB" style={{ borderRight: '2px solid var(--border-color)' }}>
                  {Object.values(computedData).reduce((sum, r) => sum + (r.cubeYield === 4 ? r.cubeAB : r.cubeAA), 0)}
                </td>
                
                {/* Stick */}
                <td id="sumStickAC">{Object.values(computedData).reduce((sum, r) => sum + r.stickAC, 0)}</td>
                <td id="sumStickAD">{Object.values(computedData).reduce((sum, r) => sum + r.stickAD, 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Material Metrics & Service shortages */}
        <div className="footer-grid">
          <div className="card sub-materials-card">
            <div className="card-title">부자재 소요 현황</div>
            <div className="grid-materials">
              <div className="material-item">
                <span>요거트 소요량</span>
                <strong id="matGreek">{subMaterials.matGreek} 개</strong>
              </div>
              <div className="material-item">
                <span>피넛(스무스)</span>
                <strong id="matSmooth">{subMaterials.matSmooth} 개</strong>
              </div>
              <div className="material-item">
                <span>피넛(크런치)</span>
                <strong id="matCrunch">{subMaterials.matCrunch} 개</strong>
              </div>
              <div className="material-item">
                <span>대파분태 소요량</span>
                <strong id="matGreen">{subMaterials.matGreen} 개</strong>
              </div>
              <div className="material-item">
                <span>카카오파베</span>
                <strong id="matPave">{subMaterials.matPave} 개</strong>
              </div>
              <div className="material-item">
                <span>쑥인절미</span>
                <strong id="matInjeolmi">{subMaterials.matInjeolmi} 개</strong>
              </div>
              <div className="material-item">
                <span>스타터팩 소요량</span>
                <strong id="matStarter">{subMaterials.matStarter} 개</strong>
              </div>
              <div className="material-item">
                <span>이매진 머드</span>
                <strong id="matImagine">{subMaterials.matImagine} 개</strong>
              </div>
              <div className="material-item">
                <span>식사용 OPP 봉투</span>
                <strong id="matOpp">{subMaterials.matOpp} 개</strong>
              </div>
              <div className="material-item" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'var(--border-focus)' }}>
                <span>생크림 사용량</span>
                <strong id="matCream" style={{ color: 'var(--accent-color)' }}>{totals.creamLitres} L</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">서비스 스콘 부족분 집계</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span className="opacity-75">서비스 주문량</span>
                <strong id="svcOrdered" className="text-lg">{totals.serviceSconeOrdered} 개</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span className="opacity-75">여분스콘 합계 (W + AD)</span>
                <strong id="svcExtra" className="text-lg text-emerald-500">{totals.extraScones} 개</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span className="opacity-75">부족한 수량</span>
                <strong id="svcShortage" className="text-lg text-rose-500">
                  {totals.shortage > 0 ? `${totals.shortage} 개` : '없음'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="opacity-75">남는 수량</span>
                <strong id="svcLeftover" className="text-lg text-indigo-400">
                  {totals.shortage <= 0 ? `${Math.abs(totals.shortage)} 개` : '없음'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Oven Batch Dashboard Grid Table */}
      <div className="page-2" style={{ marginTop: '24px' }}>
        <div className="section-title">
          <span>🔥 2페이지 : 오븐 번호별 삼각 판수 상세 집계</span>
          <span id="printDate2" className="print-only" style={{ fontSize: '11px', fontWeight: 'normal', marginLeft: 'auto' }} />
        </div>

        <div className="table-container">
          <table id="ovenTable">
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)' }}>
                <th style={{ textAlign: 'left', paddingLeft: '16px' }}>상품명</th>
                <th>오븐 번호</th>
                <th className="hl-pans">삼각 판수 (A)</th>
                <th>풀팬 (AK = A ÷ 3)</th>
                <th className="hl-adjusted-pans">풀팬 (3판 단위 묶음, AL)</th>
                <th className="hl-rem">남는 반죽 판수 (AN = 3*(AK-AL) + AM)</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let sumAJ = 0, sumAK = 0, sumAL = 0, sumAN = 0;
                
                const rows = productSequence.map((item) => {
                  if (item.type === 'spacer') {
                    return (
                      <tr key={"oven-" + item.id}>
                        <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>{item.name}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    );
                  }

                  const r = computedData[item.name];
                  if (!r || !r.hasTri) return null;

                  const valAJ = r.triU; 
                  const valAK = Math.floor(valAJ / 3); 
                  const valAM = valAJ - (3 * valAK); 
                  
                  let valAL = valAK; 
                  if (valAK > 0 && valAM > 0 && valAK > 1) {
                    valAL = valAK - 1;
                  }
                  
                  const valAN = 3 * (valAK - valAL) + valAM;

                  sumAJ += valAJ;
                  sumAK += valAK;
                  sumAL += valAL;
                  sumAN += valAN;

                  return (
                    <tr key={"oven-" + item.id} className="hover:bg-white/[0.01]">
                      <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: '500' }}>{r.name}</td>
                      <td><span className="badge-oven badge-tri">오븐 {r.ovenTri}</span></td>
                      <td className="hl-pans">{valAJ}</td>
                      <td>{valAK}</td>
                      <td className="hl-adjusted-pans">{valAL}</td>
                      <td className="hl-rem" style={{ fontWeight: 'bold', background: 'rgba(245, 158, 11, 0.05)' }}>{valAN}</td>
                    </tr>
                  );
                });

                // Append sum row
                rows.push(
                  <tr key="oven-totals" style={{ background: 'rgba(255, 255, 255, 0.03)', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'center' }}>합계</td>
                    <td></td>
                    <td id="ovenSumA" className="hl-pans">{sumAJ}</td>
                    <td id="ovenSumFull">{sumAK}</td>
                    <td id="ovenSumFull3" className="hl-adjusted-pans">{sumAL}</td>
                    <td id="ovenSumRem2" className="hl-rem">{sumAN}</td>
                  </tr>
                );

                return rows;
              })()}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
