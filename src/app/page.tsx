'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { supabase, hasValidSupabaseConfig } from '../lib/supabase';
import { Product, OrderWithProduct, CalculatedRow, OvenBatch } from '../lib/types';

// Embedded initial fallback data based on Test1.xlsx
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

// Fallback initial products
const INITIAL_PRODUCTS = [
  { id: "1", product_name: "말차초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 170, is_service: false },
  { id: "2", product_name: "츄러스콘", option_name: null, shape_type: "삼각스콘", oven_number: 2, pcs_per_pan: 8, cream_per_pan: 174, is_service: false },
  { id: "3", product_name: "츄러스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "4", product_name: "츄러스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "5", product_name: "데이츠치아씨드스콘", option_name: null, shape_type: "삼각스콘", oven_number: 11, pcs_per_pan: 8, cream_per_pan: 160, is_service: false },
  { id: "6", product_name: "데이츠치아씨드스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "7", product_name: "데이츠치아씨드스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "8", product_name: "바닐라피칸스콘", option_name: null, shape_type: "삼각스콘", oven_number: 4, pcs_per_pan: 8, cream_per_pan: 170, is_service: false },
  { id: "9", product_name: "바닐라피칸스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "10", product_name: "바닐라피칸스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "11", product_name: "버터밀크비스킷스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 130, is_service: false },
  { id: "12", product_name: "버터밀크비스킷스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "13", product_name: "버터밀크비스킷스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "14", product_name: "데솔오트밀바", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 10, cream_per_pan: 160, is_service: false },
  { id: "15", product_name: "데솔오트밀바", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "16", product_name: "카카오스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 180, is_service: false },
  { id: "17", product_name: "카카오스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "18", product_name: "카카오스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 2, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "19", product_name: "OXO스콘", option_name: null, shape_type: "삼각스콘", oven_number: 5, pcs_per_pan: 8, cream_per_pan: 150, is_service: false },
  { id: "20", product_name: "OXO스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "21", product_name: "OXO스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "22", product_name: "순수오트스콘", option_name: null, shape_type: "삼각스콘", oven_number: 5, pcs_per_pan: 8, cream_per_pan: 140, is_service: false },
  { id: "23", product_name: "순수오트스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "24", product_name: "귀리초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 180, is_service: false },
  { id: "25", product_name: "귀리초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "26", product_name: "딥카카오트스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 130, is_service: false },
  { id: "27", product_name: "딥카카오트스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 7, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "28", product_name: "더티너티밤스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 110, is_service: false },
  { id: "29", product_name: "더티너티밤스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "30", product_name: "더티너티밤스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false },
  { id: "31", product_name: "말차오트초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 125, is_service: false },
  { id: "32", product_name: "말차오트초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "33", product_name: "배리초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 140, is_service: false },
  { id: "34", product_name: "배리초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false },
  { id: "35", product_name: "[미니쉐이크]쑥인절미", option_name: null, shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 4, cream_per_pan: 190, is_service: false },
  { id: "36", product_name: "[미니쉐이크]카카오파베", option_name: null, shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 4, cream_per_pan: 180, is_service: false },
  { id: "37", product_name: "서비스스콘", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: true }
] as Product[];

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [rawText, setRawText] = useState<string>('');
  
  // App States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [carryOverTri, setCarryOverTri] = useState<Record<string, number>>({});
  const [manualAdjustTri, setManualAdjustTri] = useState<Record<string, number>>({});
  const [carryOverCube, setCarryOverCube] = useState<Record<string, number>>({});
  const [productSequence, setProductSequence] = useState<any[]>([]);

  // Scone Master CRUD Form States
  const [newSconeName, setNewSconeName] = useState<string>('');
  const [newSconeOption, setNewSconeOption] = useState<string>('');
  const [newSconeShape, setNewSconeShape] = useState<'삼각스콘' | '미니큐브' | '스틱스콘' | '기타'>('삼각스콘');
  const [newSconeOven, setNewSconeOven] = useState<string>('');
  const [newSconeYield, setNewSconeYield] = useState<number>(8);
  const [newSconeCream, setNewSconeCream] = useState<number>(170);

  // Unregistered alert warnings state
  const [unregisteredScones, setUnregisteredScones] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIdxRef = useRef<number | null>(null);
  const crudSectionRef = useRef<HTMLDivElement>(null);

  // 1. Initialize & Fetch Scone Master Configuration
  useEffect(() => {
    async function loadMasterProducts() {
      if (hasValidSupabaseConfig) {
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data) {
            setProducts(data);
            return;
          }
        } catch (e) {
          console.error("Error loading products from Supabase:", e);
        }
      }
      // Fallback
      setProducts(INITIAL_PRODUCTS);
    }
    loadMasterProducts();

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

  // Update product layout sequences automatically when product master database updates
  useEffect(() => {
    if (products.length === 0) return;
    
    // Categorized sequence grouping (triangles first, then cubes and sticks)
    const activeProducts = products.filter(p => !p.is_service);
    
    const seq = activeProducts.map(p => {
      // Create unified clean display name
      const displayName = p.product_name + (p.option_name ? p.option_name : "");
      return {
        id: p.id,
        type: 'product',
        name: displayName,
        rawProduct: p
      };
    });

    // Remove duplicates or merge items, maintaining spacer integrations
    setProductSequence(prevSeq => {
      if (prevSeq.length === 0) return seq;
      const nextSeq: any[] = [];
      
      prevSeq.forEach(item => {
        if (item.type === 'spacer') {
          nextSeq.push(item);
        } else {
          // Check if product still exists in updated products array
          const exist = seq.find(s => s.id === item.id);
          if (exist) {
            nextSeq.push(exist);
          }
        }
      });

      // Append any brand new products not currently in the sequence
      seq.forEach(s => {
        if (!nextSeq.find(n => n.id === s.id)) {
          nextSeq.push(s);
        }
      });

      return nextSeq;
    });

    // Sync input structures
    setCarryOverTri(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name + (p.option_name || "");
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });
    setManualAdjustTri(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name + (p.option_name || "");
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });
    setCarryOverCube(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name + (p.option_name || "");
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });

  }, [products]);

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

  // Lookup helper using master products database
  function getOrderQtyByMatch(product: Product) {
    // Generate matches:
    // Some excel rows have prefixes like "---단호박스콘" or "----[세트]OXO스틱 3팩"
    // We match the keys mapped in our database matching patterns
    let key = product.product_name + (product.option_name || "");
    
    // Build lookup keys
    let lookupQty = 0;
    if (product.shape_type === '삼각스콘') {
      // E.g. matches "-말차초코칩스콘" or "---단호박스콘"
      const simpleName = `-${product.product_name}`;
      const prefixName = `---${product.product_name}`;
      lookupQty = getOrderQty(simpleName) || getOrderQty(prefixName) || getOrderQty(key);
    } else if (product.shape_type === '미니큐브') {
      // E.g. matches "-----[하프팩]바닐라피칸미니큐브" or "-----[미니쉐이크]쑥인절미"
      const prefixCube = `-----[하프팩]${product.product_name.replace("스콘","")}미니큐브`;
      const shakeCube = `-----[미니쉐이크]${product.product_name.replace("[미니쉐이크]","")}`;
      lookupQty = getOrderQty(prefixCube) || getOrderQty(shakeCube) || getOrderQty(key);
    } else if (product.shape_type === '스틱스콘') {
      // E.g. matches "----[세트]바닐라피칸스틱 3팩"
      const prefixStick = `----[세트]${product.product_name.replace("스콘","")}스틱 3팩`;
      lookupQty = getOrderQty(prefixStick) || getOrderQty(key);
    } else {
      lookupQty = getOrderQty(product.product_name) || getOrderQty(key);
    }
    return lookupQty;
  }

  // Calculate live outputs reactively
  const computedData = useMemo(() => {
    const starterPack = getOrderQty("스타터팩", null);
    const serviceProduct = products.find(p => p.is_service);
    const serviceScone = serviceProduct ? getOrderQtyByMatch(serviceProduct) : 0;

    const data: Record<string, any> = {};

    productSequence.forEach(item => {
      if (item.type === 'spacer') return;
      const prod = item.rawProduct as Product;
      if (!prod) return;

      const r: any = { 
        name: prod.product_name + (prod.option_name || ""),
        ovenTri: prod.shape_type === '삼각스콘' ? prod.oven_number : null,
        ovenStickCube: prod.shape_type !== '삼각스콘' ? prod.oven_number : null,
        creamPerPan: prod.cream_per_pan,
        hasTri: prod.shape_type === '삼각스콘',
        hasCube: prod.shape_type === '미니큐브',
        hasStick: prod.shape_type === '스틱스콘'
      };

      const orderQty = getOrderQtyByMatch(prod);

      // A. Mini Cube Calculations
      if (r.hasCube) {
        let ordersCube = orderQty;
        // Check if starter pack adds to it
        if (prod.product_name.includes("쑥인절미") || prod.product_name.includes("통밀츄러") || prod.product_name.includes("바닐라피칸") || prod.product_name.includes("OXO")) {
          ordersCube += starterPack;
        }

        r.cubeOrders = ordersCube;
        r.cubeZ = carryOverCube[r.name] || 0;

        if (prod.pcs_per_pan === 4) { // [미니쉐이크] products
          r.cubeX = Math.ceil(ordersCube / 4);
          r.cubeAA = r.cubeX * 4 - ordersCube + r.cubeZ;
          if (r.cubeZ > 0 && r.cubeAA >= 4) {
            r.cubeY = r.cubeX - 1;
            r.cubeAB = r.cubeAA - 4;
          } else {
            r.cubeY = r.cubeX;
            r.cubeAB = r.cubeAA;
          }
        } else { // Normal mini cube (pcs = 2)
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
      if (r.hasStick) {
        let ordersStick = orderQty;
        let starterStick = (prod.product_name.includes("통밀츄러") || prod.product_name.includes("바닐라피칸")) ? starterPack : 0;
        
        r.stickAC = Math.ceil((starterStick / 9) + (ordersStick / 3));
        r.stickAD = r.stickAC * 9 - (starterStick + ordersStick * 3);
      } else {
        r.stickAC = 0;
        r.stickAD = 0;
      }

      // C. Triangular Scone Calculations
      if (r.hasTri) {
        let ordersTri = orderQty;
        if (prod.product_name.includes("OXO스콘")) {
          ordersTri += starterPack;
        }
        r.triR = ordersTri;
        r.triS = carryOverTri[r.name] || 0;
        r.triNet = Math.max(0, r.triR - r.triS);
        
        const yieldTri = prod.pcs_per_pan;
        r.triT = Math.ceil(r.triNet / yieldTri);
        r.triV = r.triT * yieldTri - r.triNet;

        // Try to find matching cube row to sync carry-over margins
        const matchingCube = products.find(p => p.product_name === prod.product_name && p.shape_type === '미니큐브');
        const cubeName = matchingCube ? matchingCube.product_name + (matchingCube.option_name || "") : "";
        const cubeAA = data[cubeName]?.cubeAA || 0;

        if (cubeAA === 1 && r.triV >= (yieldTri / 2)) {
          r.triU_calc = r.triT - 0.5;
        } else if (cubeAA === 1) {
          r.triU_calc = r.triT + 0.5;
        } else {
          r.triU_calc = r.triT;
        }
        
        r.triX_adj = manualAdjustTri[r.name] || 0;
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
      r.creamAK = r.totalQ * prod.cream_per_pan;

      data[r.name] = r;
    });

    return data;
  }, [productSequence, products, orders, carryOverTri, manualAdjustTri, carryOverCube]);

  // Overall summary indicators
  const totals = useMemo(() => {
    const serviceProduct = products.find(p => p.is_service);
    const serviceSconeOrdered = serviceProduct ? getOrderQtyByMatch(serviceProduct) : 0;
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
  }, [computedData, orders, products]);

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

  // Excel parsing handler + Unregistered match alerts
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
        const missingList: string[] = [];

        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (!row) continue;
          const rawName = row[nameColIdx];
          const option = row[optionColIdx];
          const qty = parseInt(row[qtyColIdx] || 0, 10);
          
          if (rawName) {
            const trimmedName = String(rawName).trim();
            const optionString = option ? String(option).trim() : "";
            
            // Check if this product is mapped in our master database
            const matched = products.find(p => {
              // Exact name match or shape key check
              const baseName = trimmedName.replace(/^[-]+/g, "");
              const pNameClean = p.product_name;
              
              if (p.shape_type === '삼각스콘' && trimmedName.startsWith("-") && !trimmedName.includes("미니큐브") && !trimmedName.includes("스틱")) {
                return baseName === pNameClean && !p.option_name;
              } else if (p.shape_type === '미니큐브' && (trimmedName.includes("미니큐브") || trimmedName.includes("미니쉐이크"))) {
                return pNameClean.includes(baseName) || baseName.includes(pNameClean.replace("-----[하프팩]","").replace("-----[미니쉐이크]",""));
              } else if (p.shape_type === '스틱스콘' && trimmedName.includes("스틱")) {
                return pNameClean.includes(baseName) || baseName.includes(pNameClean.replace("----[세트]","").replace("스틱 3팩",""));
              }
              return (p.product_name === trimmedName && (p.option_name || "") === optionString);
            });

            // If not found in database and is not standard spacer or service item
            const isStandardScone = trimmedName.startsWith("-") || trimmedName.includes("스콘") || trimmedName.includes("큐브") || trimmedName.includes("스틱") || trimmedName.includes("요프") || trimmedName.includes("머드") || trimmedName.includes("OPP");
            if (!matched && isStandardScone && !trimmedName.includes("스타터팩") && !trimmedName.includes("서비스스콘")) {
              if (!missingList.includes(trimmedName)) {
                missingList.push(trimmedName);
              }
            }

            parsed.push({
              name: trimmedName,
              option: option ? String(option).trim() : null,
              qty: qty
            });
          }
        }
        
        setUnregisteredScones(missingList);
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

  // Scone Master CRUD Database Actions
  async function handleCreateScone(e: React.FormEvent) {
    e.preventDefault();
    if (!newSconeName.trim()) {
      alert("스콘명을 입력해 주세요.");
      return;
    }

    const nextProduct: Omit<Product, 'id'> = {
      product_name: newSconeName.trim(),
      option_name: newSconeOption.trim() || null,
      shape_type: newSconeShape,
      oven_number: parseInt(newSconeOven, 10) || null,
      pcs_per_pan: newSconeYield,
      cream_per_pan: newSconeCream,
      is_service: false
    };

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([nextProduct])
          .select();
        
        if (error) throw error;
        if (data) {
          setProducts(prev => [...prev, data[0]]);
          alert("스콘이 Supabase DB에 성공적으로 등록되었습니다!");
        }
      } catch (err: any) {
        alert("DB 등록 실패: " + err.message);
      }
    } else {
      // Simulate locally
      const localNew: Product = {
        id: "local-" + Date.now(),
        ...nextProduct
      };
      setProducts(prev => [...prev, localNew]);
      alert("스콘이 로컬 임시 마스터에 등록되었습니다! (Supabase 미연동)");
    }

    // Clear form inputs
    setNewSconeName('');
    setNewSconeOption('');
    setNewSconeOven('');
    
    // Remove from unregistered warning list if matched
    setUnregisteredScones(prev => prev.filter(s => !s.includes(newSconeName)));
  }

  async function handleDeleteScone(id: string, name: string) {
    if (!confirm(`[${name}] 스콘 구성을 마스터 리스트에서 삭제하시겠습니까?`)) return;

    if (hasValidSupabaseConfig) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("삭제되었습니다.");
      } catch (err: any) {
        alert("삭제 실패: " + err.message);
      }
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("로컬 구성에서 삭제되었습니다.");
    }
  }

  // Pre-fill form from unregistered warning trigger
  function handleRegisterInstantly(rawUnregisteredName: string) {
    // Strip prefixes to guess clean base name
    const cleanedName = rawUnregisteredName.replace(/^[-]+/g, "").replace("[하프팩]","").replace("[세트]","").replace("스틱","").replace("미니큐브","").replace(" 3팩","").trim();
    setNewSconeName(cleanedName);
    
    // Guess shape type
    if (rawUnregisteredName.includes("큐브")) {
      setNewSconeShape("미니큐브");
      setNewSconeOption("[미니큐브]");
      setNewSconeYield(2);
      setNewSconeCream(0);
    } else if (rawUnregisteredName.includes("스틱")) {
      setNewSconeShape("스틱스콘");
      setNewSconeOption("[스틱스콘]");
      setNewSconeYield(9);
      setNewSconeCream(0);
    } else {
      setNewSconeShape("삼각스콘");
      setNewSconeOption("");
      setNewSconeYield(8);
      setNewSconeCream(170);
    }
    
    // Scroll to form smoothly
    crudSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <h1>스콘 생산량 관리 시스템 (Next.js &amp; Supabase DB)</h1>
          <p>Supabase 마스터 연동 및 실시간 오븐 배정 포털</p>
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

      {/* Unregistered warning Banner */}
      {unregisteredScones.length > 0 && (
        <div className="alert-banner page-1 no-print" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--warning-color)' }}>
          <div className="alert-content">
            <span className="alert-icon" style={{ color: 'var(--warning-color)' }}>⚠️</span>
            <div className="alert-text">
              <h4 style={{ color: 'var(--text-primary)' }}>등록되지 않은 스콘이 감지되었습니다</h4>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-2">다음 스콘의 오븐번호 및 수율 설정이 존재하지 않습니다. 즉시 등록 단추를 눌러 마스터 목록에 추가해 주세요.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {unregisteredScones.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#1e2942] border border-white/5 px-3 py-1 rounded-lg text-xs">
                    <span className="font-bold text-amber-500">{s}</span>
                    <button 
                      onClick={() => handleRegisterInstantly(s)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-0.5 rounded text-[10px] transition"
                    >
                      즉시 등록
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
          <small>Test1.xlsx 주문 현황 데이터 자동 해석 및 DB 매핑</small>
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
                const p = item.rawProduct as Product;

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
                      {r.hasCube ? (p.pcs_per_pan === 4 ? r.cubeAB : r.cubeAA) : ''}
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
                  {Object.values(computedData).reduce((sum, r) => {
                    const matchedProd = products.find(p => (p.product_name + (p.option_name || "")) === r.name);
                    const pcs = matchedProd ? matchedProd.pcs_per_pan : 2;
                    return sum + (pcs === 4 ? r.cubeAB : r.cubeAA);
                  }, 0)}
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

      {/* Scone Master CRUD Management Section */}
      <div className="page-1 no-print mt-6" ref={crudSectionRef}>
        <div className="section-title">
          <span>🛠️ 스콘 마스터 관리 (Supabase DB 연동)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Register Form Card */}
          <div className="card col-span-1">
            <div className="card-title">스콘 마스터 등록</div>
            <form onSubmit={handleCreateScone} className="flex flex-col gap-4">
              <div>
                <label className="text-xs opacity-75 block mb-1">스콘명 (필수)</label>
                <input 
                  type="text" 
                  value={newSconeName}
                  onChange={(e) => setNewSconeName(e.target.value)}
                  placeholder="예: 말차초코칩스콘"
                  className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs opacity-75 block mb-1">옵션명 (선택)</label>
                <input 
                  type="text" 
                  value={newSconeOption}
                  onChange={(e) => setNewSconeOption(e.target.value)}
                  placeholder="예: [미니큐브], [스틱스콘] 또는 없음"
                  className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs opacity-75 block mb-1">형태 지정</label>
                <select 
                  value={newSconeShape}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewSconeShape(val);
                    // Autofill typical yields
                    if (val === '미니큐브') {
                      setNewSconeYield(2);
                      setNewSconeCream(0);
                    } else if (val === '스틱스콘') {
                      setNewSconeYield(9);
                      setNewSconeCream(0);
                    } else if (val === '삼각스콘') {
                      setNewSconeYield(8);
                      setNewSconeCream(170);
                    }
                  }}
                  className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                >
                  <option value="삼각스콘">삼각스콘</option>
                  <option value="미니큐브">미니큐브</option>
                  <option value="스틱스콘">스틱스콘</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs opacity-75 block mb-1">오븐 번호</label>
                  <input 
                    type="number" 
                    value={newSconeOven}
                    onChange={(e) => setNewSconeOven(e.target.value)}
                    placeholder="예: 4"
                    className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs opacity-75 block mb-1">1판 생산량</label>
                  <input 
                    type="number" 
                    value={newSconeYield}
                    onChange={(e) => setNewSconeYield(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs opacity-75 block mb-1">1판당 생크림 소요량 (ml)</label>
                <input 
                  type="number" 
                  value={newSconeCream}
                  onChange={(e) => setNewSconeCream(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2 font-bold py-2.5">
                💾 저장 및 마스터 반영
              </button>
            </form>
          </div>

          {/* Scone Master List Table Card */}
          <div className="card col-span-2">
            <div className="card-title">
              <span>등록된 스콘 마스터 목록</span>
              <span className="text-xs opacity-50 font-normal">총 {products.length}개 구성</span>
            </div>
            
            <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-surface-elevated)' }}>
                    <th style={{ textAlign: 'left', paddingLeft: '16px' }}>스콘명</th>
                    <th>옵션</th>
                    <th>형태</th>
                    <th>오븐</th>
                    <th>수율</th>
                    <th>생크림</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: '500' }}>{p.product_name}</td>
                      <td>{p.option_name || '-'}</td>
                      <td><span className="text-xs opacity-75">{p.shape_type}</span></td>
                      <td>
                        {p.oven_number ? (
                          <span className="badge-oven badge-tri">오븐 {p.oven_number}</span>
                        ) : '-'}
                      </td>
                      <td>{p.pcs_per_pan}개</td>
                      <td>{p.cream_per_pan}ml</td>
                      <td>
                        {!p.is_service ? (
                          <button 
                            onClick={() => handleDeleteScone(p.id, p.product_name + (p.option_name || ""))}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs px-2 py-1 rounded transition"
                          >
                            삭제
                          </button>
                        ) : (
                          <span className="text-xs opacity-50">고정</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
