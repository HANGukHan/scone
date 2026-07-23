import { useState, useMemo, useEffect, useRef } from 'react';
import { supabase, hasValidSupabaseConfig } from '../lib/supabase';
import { Product } from '../lib/types';
import * as XLSX from 'xlsx';

// Fallback initial products
export const INITIAL_PRODUCTS = [
  { id: "1", product_name: "말차초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 170, is_service: false, aliases: "말차초코칩스콘, -말차초코칩스콘, ---말차초코칩스콘" },
  { id: "2", product_name: "츄러스콘", option_name: null, shape_type: "삼각스콘", oven_number: 2, pcs_per_pan: 8, cream_per_pan: 174, is_service: false, aliases: "츄러스콘, -츄러스콘, -통밀츄러스콘, ---츄러스콘, ---통밀츄러스콘" },
  { id: "3", product_name: "츄러스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]통밀츄러미니큐브, 츄러스콘[미니큐브]" },
  { id: "4", product_name: "츄러스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]통밀츄러스틱 3팩, 츄러스콘[스틱스콘]" },
  { id: "5", product_name: "데이츠치아씨드스콘", option_name: null, shape_type: "삼각스콘", oven_number: 11, pcs_per_pan: 8, cream_per_pan: 160, is_service: false, aliases: "데이츠치아씨드스콘, -데이츠치아씨드스콘, ---데이츠치아씨드스콘" },
  { id: "6", product_name: "데이츠치아씨드스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]데치미니큐브, 데이츠치아씨드스콘[미니큐브]" },
  { id: "7", product_name: "데이츠치아씨드스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]데치스틱 3팩, 데이츠치아씨드스콘[스틱스콘]" },
  { id: "8", product_name: "바닐라피칸스콘", option_name: null, shape_type: "삼각스콘", oven_number: 4, pcs_per_pan: 8, cream_per_pan: 170, is_service: false, aliases: "바닐라피칸스콘, -바닐라피칸스콘, ---바닐라피칸스콘" },
  { id: "9", product_name: "바닐라피칸스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]바닐라피칸미니큐브, 바닐라피칸스콘[미니큐브]" },
  { id: "10", product_name: "바닐라피칸스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 4, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]바닐라피칸스틱 3팩, 바닐라피칸스콘[스틱스콘]" },
  { id: "11", product_name: "버터밀크비스킷스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 130, is_service: false, aliases: "버터밀크비스킷스콘, -버터밀크비스킷스콘, ---버터밀크비스킷스콘" },
  { id: "12", product_name: "버터밀크비스킷스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]버터밀크비스킷미니큐브, 버터밀크비스킷스콘[미니큐브]" },
  { id: "13", product_name: "버터밀크비스킷스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]버터밀크비스킷스틱 3팩, 버터밀크비스킷스콘[스틱스콘]" },
  { id: "14", product_name: "데솔오트밀바", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 10, cream_per_pan: 160, is_service: false, aliases: "데솔오트밀바, -데솔오트밀바, ---데솔오트밀바" },
  { id: "15", product_name: "데솔오트밀바", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]데솔오바미니큐브, 데솔오트밀바[미니큐브]" },
  { id: "16", product_name: "카카오스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 180, is_service: false, aliases: "카카오스콘, -카카오스콘, ---카카오스콘" },
  { id: "17", product_name: "카카오스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]카카오미니큐브, 카카오스콘[미니큐브]" },
  { id: "18", product_name: "카카오스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 2, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]카카오스틱 3팩, 카카오스콘[스틱스콘]" },
  { id: "19", product_name: "OXO스콘", option_name: null, shape_type: "삼각스콘", oven_number: 5, pcs_per_pan: 8, cream_per_pan: 150, is_service: false, aliases: "OXO스콘, -OXO스콘, ---OXO스콘" },
  { id: "20", product_name: "OXO스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]OXO미니큐브, OXO스콘[미니큐브]" },
  { id: "21", product_name: "OXO스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]OXO스틱 3팩, OXO스콘[스틱스콘]" },
  { id: "22", product_name: "순수오트스콘", option_name: null, shape_type: "삼각스콘", oven_number: 5, pcs_per_pan: 8, cream_per_pan: 140, is_service: false, aliases: "순수오트스콘, -순수오트스콘, ---순수오트스콘" },
  { id: "23", product_name: "순수오트스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]순수오트미니큐브, 순수오트스콘[미니큐브]" },
  { id: "24", product_name: "귀리초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 1, pcs_per_pan: 8, cream_per_pan: 180, is_service: false, aliases: "귀리초코칩스콘, -귀리초코칩스콘, ---귀리초코칩스콘" },
  { id: "25", product_name: "귀리초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 4, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]귀초칩미니큐브, 귀리초코칩스콘[미니큐브]" },
  { id: "26", product_name: "딥카카오트스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 130, is_service: false, aliases: "딥카카오트스콘, -딥카카오트스콘, ---딥카카오트스콘" },
  { id: "27", product_name: "딥카카오트스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 7, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]딥카카오트미니큐브, 딥카카오트스콘[미니큐브]" },
  { id: "28", product_name: "더티너티밤스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 110, is_service: false, aliases: "더티너티밤스콘, -더티너티밤스콘, ---더티너티밤스콘" },
  { id: "29", product_name: "더티너티밤스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]더티너티밤미니큐브, 더티너티밤스콘[미니큐브]" },
  { id: "30", product_name: "더티너티밤스콘", option_name: "[스틱스콘]", shape_type: "스틱스콘", oven_number: 8, pcs_per_pan: 9, cream_per_pan: 0, is_service: false, aliases: "----[세트]더티너티밤스틱 3팩, 더티너티밤스콘[스틱스콘]" },
  { id: "31", product_name: "말차오트초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 125, is_service: false, aliases: "말차오트초코칩스콘, -말차오트초코칩스콘, ---말차오트초코칩스콘" },
  { id: "32", product_name: "말차오트초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]말차오트초코칩미니큐브, 말차오트초코칩스콘[미니큐브]" },
  { id: "33", product_name: "배리초코칩스콘", option_name: null, shape_type: "삼각스콘", oven_number: 7, pcs_per_pan: 8, cream_per_pan: 140, is_service: false, aliases: "배리초코칩스콘, -배리초코칩스콘, ---배리초코칩스콘" },
  { id: "34", product_name: "배리초코칩스콘", option_name: "[미니큐브]", shape_type: "미니큐브", oven_number: 8, pcs_per_pan: 2, cream_per_pan: 0, is_service: false, aliases: "-----[하프팩]배리초코칩미니큐브, 배리초코칩스콘[미니큐브]" },
  { id: "35", product_name: "[미니쉐이크]쑥인절미", option_name: null, shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 4, cream_per_pan: 190, is_service: false, aliases: "-----[미니쉐이크]쑥인절미, [미니쉐이크]쑥인절미" },
  { id: "36", product_name: "[미니쉐이크]카카오파베", option_name: null, shape_type: "미니큐브", oven_number: 2, pcs_per_pan: 4, cream_per_pan: 180, is_service: false, aliases: "-----[미니쉐이크]카카오파베, [미니쉐이크]카카오파베" },
  { id: "37", product_name: "서비스스콘", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: true, aliases: "서비스스콘" },
  { id: "38", product_name: "GREEK YOGURT", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "-----GREEK YOGURT ::type=material" },
  { id: "39", product_name: "피넛머드", option_name: "[스무스]", shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "-------[Gourmet M]피넛머드 ::type=material" },
  { id: "40", product_name: "피넛머드", option_name: "[크런치]", shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "-------[Gourmet M]피넛머드 ::type=material" },
  { id: "41", product_name: "대파분태", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "------대파분태 ::type=material" },
  { id: "42", product_name: "이매진 머드", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "이매진 머드 ::type=material" },
  { id: "43", product_name: "소분용 OPP 봉투 20매", option_name: "[간식용]", shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "-------소분용 OPP 봉투 20매 ::type=material" },
  { id: "44", product_name: "소분용 OPP 봉투 20매", option_name: "[식사용]", shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "-------소분용 OPP 봉투 20매 ::type=material" },
  { id: "45", product_name: "스타터팩", option_name: null, shape_type: "기타", oven_number: null, pcs_per_pan: 1, cream_per_pan: 0, is_service: false, aliases: "스타터팩 ::type=material" }
] as Product[];

// Extended aliases metadata parsing and serialization
export interface ParsedAliases {
  cleanAliases: string;
  productType: 'scone' | 'material';
  sconeType: 'general' | 'package';
  components: Array<{ name: string; qty: number }>;
  ovenBatchSize: number;
  sortOrder: number;
}

const INITIAL_ORDER_MAP: Record<string, number> = {
  "말차초코칩스콘": 1,
  "츄러스콘": 2,
  "데이츠치아씨드스콘": 3,
  "바닐라피칸스콘": 4,
  "버터밀크비스킷스콘": 5,
  "데솔오트밀바": 6,
  "카카오스콘": 7,
  "OXO스콘": 8,
  "순수오트스콘": 9,
  "귀리초코칩스콘": 10,
  "딥카카오트스콘": 11,
  "더티너티밤스콘": 12,
  "말차오트초코칩스콘": 13,
  "배리초코칩스콘": 14,
  "[미니쉐이크]쑥인절미": 15,
  "[미니쉐이크]카카오파베": 16
};

export function parseExtendedAliases(aliasesStr: string | null | undefined): ParsedAliases {
  const result: ParsedAliases = {
    cleanAliases: '',
    productType: 'scone',
    sconeType: 'general',
    components: [],
    ovenBatchSize: 3.0,
    sortOrder: 9999
  };
  if (!aliasesStr) return result;

  const parts = aliasesStr.split('::');
  result.cleanAliases = parts[0].trim();

  for (let i = 1; i < parts.length; i++) {
    const item = parts[i].trim();
    if (item.startsWith('type=')) {
      const typeVal = item.substring(5).trim();
      if (typeVal === 'material') {
        result.productType = 'material';
      } else if (typeVal === 'package') {
        result.sconeType = 'package';
      }
    } else if (item.startsWith('components=')) {
      const compVal = item.substring(11).trim();
      const compParts = compVal.split(',').map(c => c.trim()).filter(Boolean);
      compParts.forEach(cp => {
        const idx = cp.lastIndexOf(':');
        if (idx !== -1) {
          const name = cp.substring(0, idx).trim();
          const qty = parseInt(cp.substring(idx + 1).trim(), 10) || 1;
          result.components.push({ name, qty });
        }
      });
    } else if (item.startsWith('batch_size=')) {
      result.ovenBatchSize = parseFloat(item.substring(11).trim()) || 3.0;
    } else if (item.startsWith('sort_order=')) {
      result.sortOrder = parseInt(item.substring(11).trim(), 10) || 9999;
    }
  }

  // Fallback default sort orders if sortOrder is unassigned
  if (result.sortOrder === 9999) {
    const firstWord = result.cleanAliases.split(',')[0].replace(/^[-]+/, '').trim();
    if (INITIAL_ORDER_MAP[firstWord] !== undefined) {
      result.sortOrder = INITIAL_ORDER_MAP[firstWord];
    }
  }

  return result;
}

export function serializeExtendedAliases(
  cleanAliases: string, 
  productType: 'scone' | 'material', 
  sconeType: 'general' | 'package', 
  components: Array<{ name: string; qty: number }>,
  ovenBatchSize: number = 3.0,
  sortOrder: number = 9999
): string {
  let result = cleanAliases.trim();
  if (productType === 'material') {
    result += ' ::type=material';
  } else if (sconeType === 'package') {
    result += ' ::type=package';
    if (components.length > 0) {
      const compStr = components.map(c => `${c.name}:${c.qty}`).join(',');
      result += ` ::components=${compStr}`;
    }
  }
  if (ovenBatchSize !== 3.0) {
    result += ` ::batch_size=${ovenBatchSize}`;
  }
  if (sortOrder !== 9999) {
    result += ` ::sort_order=${sortOrder}`;
  }
  return result;
}

export function cleanString(str: string): string {
  if (!str) return '';
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').trim();
}

export function normalize(str: string): string {
  if (!str) return '';
  return str.replace(/[-]/g, '').replace(/[\s\uFEFF\xA0]+/g, '').toLowerCase().trim();
}

export function fuzzyNormalizeProductName(name: string): string {
  if (!name) return '';
  return name
    .replace(/[-]/g, '')
    .replace(/[\s\uFEFF\xA0]+/g, '')
    .replace(/스콘$/g, '')
    .replace(/배/g, '베')
    .toLowerCase()
    .trim();
}

export const DEFAULT_ORDERS = [
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

export function useSconeDashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [rawText, setRawText] = useState<string>('');
  
  // App States
  const [products, setProducts] = useState<Product[]>([]);
  const [carryOverTri, setCarryOverTri] = useState<Record<string, number>>({});
  const [manualAdjustTri, setManualAdjustTri] = useState<Record<string, number>>({});
  const [carryOverCube, setCarryOverCube] = useState<Record<string, number>>({});
  const [productSequence, setProductSequence] = useState<any[]>([]);
  const [hiddenProductNames, setHiddenProductNames] = useState<string[]>([]);
  const [backupTime, setBackupTime] = useState<string | null>(null);

  // Scone Master CRUD Form States
  const [newSconeName, setNewSconeName] = useState<string>('');
  const [newSconeOption, setNewSconeOption] = useState<string>('');
  const [newSconeShape, setNewSconeShape] = useState<'삼각스콘' | '미니큐브' | '스틱스콘' | '기타'>('삼각스콘');
  const [newSconeOven, setNewSconeOven] = useState<string>('');
  const [newSconeYield, setNewSconeYield] = useState<number>(8);
  const [newSconeCream, setNewSconeCream] = useState<number>(0);
  const [newSconeAliases, setNewSconeAliases] = useState<string>('');
  const [newSconeProductType, setNewSconeProductType] = useState<'scone' | 'material'>('scone');
  const [newSconeCompositionType, setNewSconeCompositionType] = useState<'general' | 'package'>('general');
  const [newSconePackageComponents, setNewSconePackageComponents] = useState<string>('');
  const [newSconeSortOrder, setNewSconeSortOrder] = useState<number>(9999);
  const [newSconeOvenBatchSize, setNewSconeOvenBatchSize] = useState<number>(3.0);
  const [editingFormProductId, setEditingFormProductId] = useState<string | null>(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState<boolean>(false);

  // Scone Master CRUD Inline Editing States
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editingAliasesVal, setEditingAliasesVal] = useState<string>('');
  const [editingSortProdId, setEditingSortProdId] = useState<string | null>(null);
  const [editingSortVal, setEditingSortVal] = useState<string>('');

  // Password modals and forms states
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showMasterModal, setShowMasterModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [pendingInstName, setPendingInstName] = useState<string | null>(null);
  
  // Click-to-map mapping selection state
  const [mappingSelections, setMappingSelections] = useState<Record<string, string>>({});
  const [showRegisterNewModal, setShowRegisterNewModal] = useState<boolean>(false);
  
  // Mapping Modal States
  const [uploadedProductNames, setUploadedProductNames] = useState<string[]>([]);
  const [showMappingModal, setShowMappingModal] = useState<boolean>(false);
  const [mappingProduct, setMappingProduct] = useState<Product | null>(null);
  
  // Password change states
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  
  // Inline editing state for oven numbers
  const [editingOvenProdId, setEditingOvenProdId] = useState<string | null>(null);
  const [editingOvenVal, setEditingOvenVal] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIdxRef = useRef<number | null>(null);
  const crudSectionRef = useRef<HTMLDivElement>(null);

  // Unregistered alert warnings dynamically evaluated from orders and products
  const unregisteredScones = useMemo(() => {
    const missingList: string[] = [];
    Object.keys(orders).forEach(orderKey => {
      const trimmedName = cleanString(orderKey);
      if (!trimmedName) return;

      const matched = products.find(p => {
        const aliasList = p.aliases
          ? p.aliases.split(',').map(a => normalize(a)).filter(Boolean)
          : [];
        const baseName = p.product_name;
        const baseNameNorm = normalize(baseName);
        const optNameNorm = p.option_name ? normalize(p.option_name) : "";
        const defaultKeyNorm = baseNameNorm + optNameNorm;

        const fallbackKeys: string[] = [defaultKeyNorm, baseNameNorm];
        if (p.shape_type === '삼각스콘') {
          fallbackKeys.push(normalize(`-${baseName}`), normalize(`---${baseName}`));
        } else if (p.shape_type === '미니큐브') {
          fallbackKeys.push(normalize(`-----[하프팩]${baseName.replace("스콘","")}미니큐브`));
          fallbackKeys.push(normalize(`-----[미니쉐이크]${baseName.replace("[미니쉐이크]","")}`));
        } else if (p.shape_type === '스틱스콘') {
          fallbackKeys.push(normalize(`----[세트]${baseName.replace("스콘","")}스틱 3팩`));
        }

        const allNormalizedAliases = Array.from(new Set([
          ...aliasList,
          ...fallbackKeys.map(k => normalize(k))
        ]));

        const orderNorm = normalize(trimmedName);

        // Shape category safety check
        let shapeSafe = true;
        if (p.shape_type === '미니큐브') {
          shapeSafe = orderNorm.includes('큐브') || orderNorm.includes('쉐이크');
        } else if (p.shape_type === '스틱스콘') {
          shapeSafe = orderNorm.includes('스틱');
        } else if (p.shape_type === '삼각스콘') {
          shapeSafe = !orderNorm.includes('큐브') && !orderNorm.includes('쉐이크') && !orderNorm.includes('스틱');
        }

        if (!shapeSafe) return false;

        return allNormalizedAliases.some(alias => {
          if (!alias) return false;
          return orderNorm === alias || orderNorm.includes(alias) || alias.includes(orderNorm);
        });
      });

      // If not found in database and is not standard spacer or service item
      const isStandardScone = trimmedName.startsWith("-") || trimmedName.includes("스콘") || trimmedName.includes("큐브") || trimmedName.includes("스틱") || trimmedName.includes("요프") || trimmedName.includes("머드") || trimmedName.includes("OPP");
      if (!matched && isStandardScone && !trimmedName.includes("스타터팩") && !trimmedName.includes("서비스스콘")) {
        if (!missingList.includes(trimmedName)) {
          missingList.push(trimmedName);
        }
      }
    });
    return missingList;
  }, [products, orders]);

  // Decomposed orders map resolving package/set 1:N item breakdowns
  const decomposedOrders = useMemo(() => {
    const result: Record<string, number> = { ...orders };

    // Find all package products in database
    const packageProds = products.filter(p => {
      const parsed = parseExtendedAliases(p.aliases);
      return parsed.sconeType === 'package';
    });

    packageProds.forEach(pkgProd => {
      let pkgQty = 0;
      const parsedPkg = parseExtendedAliases(pkgProd.aliases);
      const pkgAliasList = parsedPkg.cleanAliases
        ? parsedPkg.cleanAliases.split(',').map(a => normalize(a)).filter(Boolean)
        : [];
      
      const pkgBaseNameNorm = normalize(pkgProd.product_name);
      const pkgOptNameNorm = pkgProd.option_name ? normalize(pkgProd.option_name) : "";
      const pkgDefaultKeyNorm = pkgBaseNameNorm + pkgOptNameNorm;

      const pkgFallbackKeys = [pkgDefaultKeyNorm, pkgBaseNameNorm];
      const pkgAllAliases = Array.from(new Set([
        ...pkgAliasList,
        ...pkgFallbackKeys.map(k => normalize(k))
      ]));

      // Sum quantities from original orders and delete them from result
      Object.entries(orders).forEach(([orderKey, qty]) => {
        const orderNorm = normalize(orderKey);
        const matched = pkgAllAliases.some(alias => {
          return orderNorm === alias || orderNorm.includes(alias) || alias.includes(orderNorm);
        });
        if (matched) {
          pkgQty += qty;
          delete result[orderKey]; // Subtract package order from normal scone orders
        }
      });

      // Disassemble package quantity into its component items
      if (pkgQty > 0 && parsedPkg.components.length > 0) {
        parsedPkg.components.forEach(comp => {
          const compProd = products.find(p => p.product_name === comp.name);
          if (compProd) {
            const compKey = compProd.product_name + (compProd.option_name || "");
            result[compKey] = (result[compKey] || 0) + (comp.qty * pkgQty);
          } else {
            result[comp.name] = (result[comp.name] || 0) + (comp.qty * pkgQty);
          }
        });
      }
    });

    return result;
  }, [orders, products]);

  // Fetch initial master products
  useEffect(() => {
    // Clear all localStorage and sessionStorage caches except credentials and backups
    const pw = localStorage.getItem('masterPassword');
    const expiry = localStorage.getItem('masterAuthExpiry');
    const backup = localStorage.getItem('masterProductsBackup');
    const backupTimeVal = localStorage.getItem('masterProductsBackupTime');

    localStorage.clear();
    sessionStorage.clear();

    if (pw) localStorage.setItem('masterPassword', pw);
    if (expiry) localStorage.setItem('masterAuthExpiry', expiry);
    if (backup) localStorage.setItem('masterProductsBackup', backup);
    if (backupTimeVal) {
      localStorage.setItem('masterProductsBackupTime', backupTimeVal);
      setBackupTime(backupTimeVal);
    }

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
      setProducts(INITIAL_PRODUCTS);
    }
    loadMasterProducts();

    // Set document print dates
    const formatted = new Date().toLocaleDateString('ko-KR', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const print1 = document.getElementById("printDate1");
    if (print1) print1.innerText = "출력일시: " + formatted;
  }, []);

  // Update layout sequences
  useEffect(() => {
    if (products.length === 0) return;

    const activeBaseNames = Array.from(new Set(
      products
        .filter(p => !p.is_service && p.product_name !== 'SYSTEM_SPACER')
        .filter(p => {
          const parsed = parseExtendedAliases(p.aliases);
          return parsed.productType !== 'material' && parsed.sconeType !== 'package';
        })
        .filter(p => {
          const parsed = parseExtendedAliases(p.aliases);
          if (parsed.sortOrder === 0) return false;
          if (hiddenProductNames.includes(p.product_name)) return false;
          return parsed.sortOrder < 9999 || getOrderQtyByMatch(p) > 0;
        })
        .sort((a, b) => {
          const parsedA = parseExtendedAliases(a.aliases);
          const parsedB = parseExtendedAliases(b.aliases);
          const orderA = parsedA.sortOrder;
          const orderB = parsedB.sortOrder;
          if (orderA !== orderB) return orderA - orderB;
          return a.product_name.localeCompare(b.product_name, 'ko');
        })
        .map(p => p.product_name)
    ));

    setProductSequence(prevSeq => {
      // 1. If prevSeq is empty, build from database spacers and active products
      if (prevSeq.length === 0) {
        const spacers = products
          .filter(p => p.product_name === 'SYSTEM_SPACER')
          .map(p => {
            const parsed = parseExtendedAliases(p.aliases);
            return {
              id: p.option_name || `spacer-${p.id}`,
              type: 'spacer' as const,
              name: parsed.cleanAliases || "",
              sortOrder: parsed.sortOrder
            };
          });

        const prodItems = products
          .filter(p => activeBaseNames.includes(p.product_name))
          .map(p => {
            const parsed = parseExtendedAliases(p.aliases);
            return {
              id: p.id,
              type: 'product' as const,
              name: p.product_name,
              sortOrder: parsed.sortOrder
            };
          });

        // Deduplicate product names (keep smallest sortOrder)
        const uniqueItemsMap = new Map<string, any>();
        [...spacers, ...prodItems].forEach(item => {
          const key = item.type === 'spacer' ? `spacer-${item.id}` : `product-${item.name}`;
          if (!uniqueItemsMap.has(key)) {
            uniqueItemsMap.set(key, item);
          } else {
            const existing = uniqueItemsMap.get(key);
            if (item.sortOrder < existing.sortOrder) {
              uniqueItemsMap.set(key, item);
            }
          }
        });

        const sortedCombined = Array.from(uniqueItemsMap.values())
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return sortedCombined.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name
        }));
      }

      // 2. If prevSeq has elements, preserve layout positions
      const productsInSeq = prevSeq.filter(item => item.type === 'product' && activeBaseNames.includes(item.name));
      productsInSeq.sort((a, b) => {
        return activeBaseNames.indexOf(a.name) - activeBaseNames.indexOf(b.name);
      });

      const nextSeq: any[] = [];
      let prodIdx = 0;
      prevSeq.forEach(item => {
        if (item.type === 'spacer') {
          nextSeq.push(item);
        } else {
          if (activeBaseNames.includes(item.name) && prodIdx < productsInSeq.length) {
            nextSeq.push(productsInSeq[prodIdx++]);
          }
        }
      });

      activeBaseNames.forEach(name => {
        if (!nextSeq.find(n => n.type === 'product' && n.name === name)) {
          const p = products.find(prod => prod.product_name === name);
          nextSeq.push({
            id: p ? p.id : name,
            type: 'product',
            name: name
          });
        }
      });

      return nextSeq;
    });

    setCarryOverTri(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name;
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });

    setCarryOverCube(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name;
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });

    setManualAdjustTri(prev => {
      const next = { ...prev };
      products.forEach(p => {
        const name = p.product_name;
        if (next[name] === undefined) next[name] = 0;
      });
      return next;
    });
  }, [products, orders, hiddenProductNames]);

  function loadData(records: any[]) {
    const nextOrders: Record<string, number> = {};
    records.forEach(r => {
      const key = `${r.name}${r.option || ""}`;
      nextOrders[key] = (nextOrders[key] || 0) + (r.qty || 0);
    });
    setOrders(nextOrders);
    setRawText(JSON.stringify(records, null, 2));
    setHiddenProductNames([]);
  }

  function getOrderQty(name: string, opt: string | null = null) {
    if (!name) return 0;
    const key = `${name.trim()}${opt ? opt.trim() : ""}`;
    return orders[key] || 0;
  }

  function getOrderQtyByMatch(product: Product) {
    let sumQty = 0;
    const aliasList = product.aliases
      ? product.aliases.split(',').map(a => normalize(a)).filter(Boolean)
      : [];

    const baseName = product.product_name;
    const baseNameNorm = normalize(baseName);
    const optNameNorm = product.option_name ? normalize(product.option_name) : "";
    const defaultKeyNorm = baseNameNorm + optNameNorm;

    const fallbackKeys: string[] = [defaultKeyNorm, baseNameNorm];
    if (product.shape_type === '삼각스콘') {
      fallbackKeys.push(normalize(`-${baseName}`), normalize(`---${baseName}`));
    } else if (product.shape_type === '미니큐브') {
      fallbackKeys.push(normalize(`-----[하프팩]${baseName.replace("스콘","")}미니큐브`));
      fallbackKeys.push(normalize(`-----[미니쉐이크]${baseName.replace("[미니쉐이크]","")}`));
    } else if (product.shape_type === '스틱스콘') {
      fallbackKeys.push(normalize(`----[세트]${baseName.replace("스콘","")}스틱 3팩`));
    }

    const allNormalizedAliases = Array.from(new Set([
      ...aliasList,
      ...fallbackKeys.map(k => normalize(k))
    ]));

    Object.entries(decomposedOrders).forEach(([orderKey, qty]) => {
      const orderNorm = normalize(orderKey);

      let shapeSafe = true;
      if (product.shape_type === '미니큐브') {
        shapeSafe = orderNorm.includes('큐브') || orderNorm.includes('쉐이크');
      } else if (product.shape_type === '스틱스콘') {
        shapeSafe = orderNorm.includes('스틱');
      } else if (product.shape_type === '삼각스콘') {
        shapeSafe = !orderNorm.includes('큐브') && !orderNorm.includes('쉐이크') && !orderNorm.includes('스틱');
      }

      if (!shapeSafe) return;

      const isMatched = allNormalizedAliases.some(alias => {
        if (!alias) return false;
        return orderNorm === alias || orderNorm.includes(alias) || alias.includes(orderNorm);
      });

      if (isMatched) {
        sumQty += qty;
      }
    });

    return sumQty;
  }

  // Calculate live output metrics grouped by base scone name
  const computedData = useMemo(() => {
    const starterPack = getOrderQty("스타터팩", null);
    const data: Record<string, any> = {};

    productSequence.forEach(item => {
      if (item.type === 'spacer') return;
      const baseName = item.name;

      const pTri = products.find(p => p.product_name === baseName && p.shape_type === '삼각스콘');
      const pCube = products.find(p => p.product_name === baseName && p.shape_type === '미니큐브');
      const pStick = products.find(p => p.product_name === baseName && p.shape_type === '스틱스콘');

      const r: any = {
        name: baseName,
        ovenTri: pTri ? pTri.oven_number : null,
        ovenStickCube: pCube ? pCube.oven_number : (pStick ? pStick.oven_number : null),
        hasTri: !!pTri,
        hasCube: !!pCube,
        hasStick: !!pStick
      };

      // 1. Calculate Mini Cube
      if (pCube) {
        let ordersCube = getOrderQtyByMatch(pCube);
        if (pCube.product_name.includes("쑥인절미") || pCube.product_name.includes("통밀츄러") || pCube.product_name.includes("바닐라피칸") || pCube.product_name.includes("OXO")) {
          ordersCube += starterPack;
        }
        r.cubeOrders = ordersCube;
        r.cubeZ = carryOverCube[baseName] || 0;

        if (pCube.pcs_per_pan === 4) {
          r.cubeX = Math.ceil(ordersCube / 4);
          r.cubeAA = r.cubeX * 4 - ordersCube + r.cubeZ;
          if (r.cubeZ > 0 && r.cubeAA >= 4) {
            r.cubeY = r.cubeX - 1;
            r.cubeAB = r.cubeAA - 4;
          } else {
            r.cubeY = r.cubeX;
            r.cubeAB = r.cubeAA;
          }
        } else {
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

      // 2. Calculate Stick Scone
      if (pStick) {
        let ordersStick = getOrderQtyByMatch(pStick);
        let starterStick = (pStick.product_name.includes("통밀츄러") || pStick.product_name.includes("바닐라피칸")) ? starterPack : 0;
        r.stickAC = Math.ceil((starterStick / 9) + (ordersStick / 3));
        r.stickAD = r.stickAC * 9 - (starterStick + ordersStick * 3);
      } else {
        r.stickAC = 0;
        r.stickAD = 0;
      }

      // 3. Calculate Triangular Scone
      if (pTri) {
        let ordersTri = getOrderQtyByMatch(pTri);
        if (pTri.product_name.includes("OXO스콘")) {
          ordersTri += starterPack;
        }
        r.triR = ordersTri;
        r.triS = carryOverTri[baseName] || 0;
        r.triNet = Math.max(0, r.triR - r.triS);
        
        const yieldTri = pTri.pcs_per_pan;
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
        
        r.triX_adj = manualAdjustTri[baseName] || 0;
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

      // 4. Combined Totals & Cream AK
      r.totalQ = r.triU + r.stickAC + r.cubeY;
      r.creamAK = r.triU * (pTri?.cream_per_pan || 0) + r.cubeY * (pCube?.cream_per_pan || 0) + r.stickAC * (pStick?.cream_per_pan || 0);

      data[baseName] = r;
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

  // Dynamic sub-materials breakdown
  const subMaterials = useMemo(() => {
    return products
      .filter(p => {
        const parsed = parseExtendedAliases(p.aliases);
        return parsed.productType === 'material' || p.product_name.includes('[미니쉐이크]');
      })
      .map(p => {
        const qty = getOrderQtyByMatch(p);
        return {
          id: p.id,
          name: p.product_name,
          option: p.option_name,
          shape: p.shape_type,
          aliases: p.aliases || null,
          qty: qty
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [products, decomposedOrders]);

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
          throw new Error("엑셀 시트 내 데이터가 존재하지 않습니다.");
        }

        let headerRowIdx = -1;
        let nameColIdx = -1;
        let optionColIdx = -1;
        let qtyColIdx = -1;
        let statusColIdx = -1;

        // Find the header row containing both "상품명" and "수량"
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !Array.isArray(row)) continue;
          
          const hasNameHeader = row.some(cell => String(cell || '').includes("상품명"));
          const hasQtyHeader = row.some(cell => String(cell || '').includes("수량"));
          
          if (hasNameHeader && hasQtyHeader) {
            headerRowIdx = i;
            const findExactOrIncludes = (rowArray: any[], term: string) => {
              const exactIdx = rowArray.indexOf(term);
              if (exactIdx !== -1) return exactIdx;
              return rowArray.findIndex(cell => String(cell || '').includes(term));
            };
            nameColIdx = findExactOrIncludes(row, "상품명");
            optionColIdx = findExactOrIncludes(row, "옵션");
            qtyColIdx = findExactOrIncludes(row, "수량");
            statusColIdx = row.findIndex(cell => String(cell || '').includes("상태") || String(cell || '').includes("매칭상태") || String(cell || '').includes("매칭"));
            break;
          }
        }

        let startRow = 0;
        if (headerRowIdx !== -1) {
          startRow = headerRowIdx + 1;
        } else {
          // Fallback defaults
          nameColIdx = 4;
          optionColIdx = 12;
          qtyColIdx = 16;
          startRow = 1;
        }

        console.log(`Excel Parsing Indices: headerRowIdx=${headerRowIdx}, nameColIdx=${nameColIdx}, optionColIdx=${optionColIdx}, qtyColIdx=${qtyColIdx}, statusColIdx=${statusColIdx}`);

        const allRawNames = Array.from(new Set(rows.slice(startRow).map(row => {
          if (!row || !Array.isArray(row)) return '';
          return String(row[nameColIdx] || '').trim();
        }).filter(Boolean)));
        setUploadedProductNames(allRawNames);

        const parsed: any[] = [];
        const missingList: string[] = [];

        for (let i = startRow; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !Array.isArray(row)) continue;

          // If status column is found, filter out canceled orders
          if (statusColIdx !== -1) {
            const status = String(row[statusColIdx] || '').trim();
            // Skip canceled orders
            if (status.includes("취소")) continue;
            
            // For easyadmin format, we check if the status is one of valid statuses
            const isEasyAdminStatus = status.includes("매칭 완료") || status.includes("매칭대기") || status.includes("매칭오류") || status.includes("취소");
            if (isEasyAdminStatus && status.includes("취소")) continue;
          }

          const rawName = String(row[nameColIdx] || '').trim();
          const option = optionColIdx !== -1 ? String(row[optionColIdx] || '').trim() : '';
          const qty = parseInt(row[qtyColIdx], 10) || 0;

          const trimmedName = cleanString(rawName);
          if (!trimmedName || qty <= 0) continue;

          const matched = products.find(p => {
            const aliasList = p.aliases ? p.aliases.split(',').map(a => normalize(a)).filter(Boolean) : [];
            const baseName = p.product_name;
            const baseNameNorm = normalize(baseName);
            const optNameNorm = p.option_name ? normalize(p.option_name) : "";
            const defaultKeyNorm = baseNameNorm + optNameNorm;

            const fallbackKeys = [defaultKeyNorm, baseNameNorm];
            if (p.shape_type === '삼각스콘') {
              fallbackKeys.push(normalize(`-${baseName}`), normalize(`---${baseName}`));
            } else if (p.shape_type === '미니큐브') {
              fallbackKeys.push(normalize(`-----[하프팩]${baseName.replace("스콘","")}미니큐브`));
              fallbackKeys.push(normalize(`-----[미니쉐이크]${baseName.replace("[미니쉐이크]","")}`));
            } else if (p.shape_type === '스틱스콘') {
              fallbackKeys.push(normalize(`----[세트]${baseName.replace("스콘","")}스틱 3팩`));
            }

            const allNormalizedAliases = Array.from(new Set([
              ...aliasList,
              ...fallbackKeys.map(k => normalize(k))
            ]));

            const orderNorm = normalize(trimmedName);
            let shapeSafe = true;
            if (p.shape_type === '미니큐브') {
              shapeSafe = orderNorm.includes('큐브') || orderNorm.includes('쉐이크');
            } else if (p.shape_type === '스틱스콘') {
              shapeSafe = orderNorm.includes('스틱');
            } else if (p.shape_type === '삼각스콘') {
              shapeSafe = !orderNorm.includes('큐브') && !orderNorm.includes('쉐이크') && !orderNorm.includes('스틱');
            }

            if (!shapeSafe) return false;

            return allNormalizedAliases.some(alias => {
              if (!alias) return false;
              return orderNorm === alias || orderNorm.includes(alias) || alias.includes(orderNorm);
            });
          });

          const isStandardScone = trimmedName.startsWith("-") || trimmedName.includes("스콘") || trimmedName.includes("큐브") || trimmedName.includes("스틱") || trimmedName.includes("요프") || trimmedName.includes("머드") || trimmedName.includes("OPP");
          if (!matched && isStandardScone && !trimmedName.includes("스타터팩") && !trimmedName.includes("서비스스콘")) {
            if (!missingList.includes(trimmedName)) {
              missingList.push(trimmedName);
            }
          }

          parsed.push({
            name: trimmedName,
            option: option && option !== 'undefined' && option !== 'null' ? String(option).trim() : null,
            qty: qty
          });
        }
        
        console.log("=== EXCEL UPLOAD MATCHING REPORT ===");
        console.log(`Total rows processed: ${rows.length - startRow}`);
        console.log(`Parsed orders count: ${parsed.length}`);
        console.log(`Unmatched (missing) items:`, missingList);
        console.log("====================================");

        loadData(parsed);
      } catch (err: any) {
        alert("엑셀 파일 해석 오류: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleInputVal(name: string, stateKey: string, val: number) {
    if (stateKey === 'carryOverTri') {
      setCarryOverTri(prev => ({ ...prev, [name]: val }));
    } else if (stateKey === 'manualAdjustTri') {
      setManualAdjustTri(prev => ({ ...prev, [name]: val }));
    } else if (stateKey === 'carryOverCube') {
      setCarryOverCube(prev => ({ ...prev, [name]: val }));
    }
  }

  function updateSpacerName(idx: number, name: string) {
    setProductSequence(prev => prev.map((item, i) => i === idx ? { ...item, name: name } : item));
  }

  function deleteSpacer(idx: number) {
    setProductSequence(prev => prev.filter((_, i) => i !== idx));
  }

  function addSpacer() {
    setProductSequence(prev => [
      ...prev,
      {
        id: "spacer-" + Date.now(),
        type: "spacer",
        name: ""
      }
    ]);
  }

  function handleDragStart(idx: number) {
    dragIdxRef.current = idx;
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(idx: number) {
    if (dragIdxRef.current === null) return;
    const dragIdx = dragIdxRef.current;
    dragIdxRef.current = null;

    if (dragIdx === idx) return;

    setProductSequence(prev => {
      const next = [...prev];
      const [dragged] = next.splice(dragIdx, 1);
      next.splice(idx, 0, dragged);
      return next;
    });
  }

  // Create / Update Master product
  async function handleCreateScone(e: React.FormEvent) {
    e.preventDefault();
    if (!newSconeName.trim()) {
      alert("스콘명을 입력해 주세요.");
      return;
    }

    const prodNameClean = newSconeName.trim();
    const optNameClean = newSconeOption.trim() || null;

    let existing: Product | undefined = undefined;
    if (editingFormProductId) {
      existing = products.find(p => p.id === editingFormProductId);
    } else {
      existing = products.find(p => {
        const nameMatch = fuzzyNormalizeProductName(p.product_name) === fuzzyNormalizeProductName(prodNameClean);
        const optMatch = normalize(p.option_name || '') === normalize(optNameClean || '');
        const shapeMatch = p.shape_type === newSconeShape;
        return nameMatch && (optMatch || shapeMatch);
      });
    }

    const cleanNewAliases = cleanString(newSconeAliases);
    const serializedAliases = serializeExtendedAliases(
      cleanNewAliases,
      newSconeProductType,
      newSconeProductType === 'material' ? 'general' : newSconeCompositionType,
      newSconeProductType === 'scone' && newSconeCompositionType === 'package' 
        ? newSconePackageComponents.split(',').map(c => {
            const idx = c.lastIndexOf(':');
            return {
              name: idx !== -1 ? c.substring(0, idx).trim() : c.trim(),
              qty: idx !== -1 ? parseInt(c.substring(idx + 1).trim(), 10) || 1 : 1
            };
          }).filter(c => c.name)
        : [],
      newSconeOvenBatchSize,
      newSconeSortOrder
    );

    const nextProduct: Omit<Product, 'id'> & { id?: string } = {
      product_name: prodNameClean,
      option_name: optNameClean,
      shape_type: newSconeShape,
      oven_number: newSconeOven.trim() ? parseInt(newSconeOven, 10) : null,
      pcs_per_pan: newSconeYield,
      cream_per_pan: newSconeCream,
      is_service: existing ? existing.is_service : false,
      aliases: serializedAliases
    };

    if (existing) {
      nextProduct.id = existing.id;
    }

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .upsert([nextProduct])
          .select();
        
        if (error) {
          if (error.message.includes("column") || error.code === "42703") {
            const fallbackProduct = { ...nextProduct };
            delete fallbackProduct.aliases;
            const { data: fbData, error: fbError } = await supabase
              .from('products')
              .upsert([fallbackProduct])
              .select();
            if (fbError) throw fbError;
            if (fbData) {
              setProducts(prev => {
                const filtered = prev.filter(p => p.id !== fbData[0].id && !(p.product_name === fbData[0].product_name && p.option_name === fbData[0].option_name));
                return [...filtered, fbData[0]];
              });
              alert("스콘이 저장/수정되었으나, 'aliases' 열이 존재하지 않아 매칭 키워드는 생략되었습니다.");
              setNewSconeName('');
              setNewSconeOption('');
              setNewSconeOven('');
              setNewSconeAliases('');
              setNewSconeProductType('scone');
              setNewSconeCompositionType('general');
              setNewSconePackageComponents('');
              return;
            }
          }
          throw error;
        }
        if (data) {
          setProducts(prev => {
            const filtered = prev.filter(p => p.id !== data[0].id && !(p.product_name === data[0].product_name && p.option_name === data[0].option_name));
            return [...filtered, data[0]];
          });
          alert("스콘 마스터 정보가 성공적으로 반영/수정되었습니다!");
        }
      } catch (err: any) {
        alert("DB 저장 실패: " + err.message);
      }
    } else {
      const localNew: Product = {
        id: existing ? existing.id : "local-" + Date.now(),
        ...nextProduct
      } as Product;
      setProducts(prev => {
        const filtered = prev.filter(p => p.id !== localNew.id && !(p.product_name === localNew.product_name && p.option_name === localNew.option_name));
        return [...filtered, localNew];
      });
      alert("로컬 임시 마스터 정보가 수정/등록되었습니다! (Supabase 미연동)");
    }

    setNewSconeName('');
    setNewSconeOption('');
    setNewSconeOven('');
    setNewSconeAliases('');
    setNewSconeProductType('scone');
    setNewSconeCompositionType('general');
    setNewSconePackageComponents('');
    setNewSconeSortOrder(9999);
    setNewSconeOvenBatchSize(3.0);
    setEditingFormProductId(null);
    setShowRegisterNewModal(false);
  }

  async function handleClearAllDBData() {
    if (!confirm("🚨 경고! Supabase 데이터베이스의 모든 스콘 마스터 등록 데이터를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    
    if (hasValidSupabaseConfig) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) throw error;
        setProducts([]);
        alert("데이터베이스 스콘 마스터 데이터가 성공적으로 전체 삭제 및 초기화되었습니다!");
      } catch (err: any) {
        alert("DB 데이터 삭제 실패: " + err.message);
      }
    } else {
      setProducts([]);
      alert("로컬 마스터 목록이 비워졌습니다. (Supabase 미연동)");
    }
  }

  function handleSaveCurrentBackup() {
    localStorage.setItem('masterProductsBackup', JSON.stringify(products));
    const now = new Date();
    const yy = String(now.getFullYear()).substring(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${yy}.${mm}.${dd} ${hh}:${min}`;
    
    localStorage.setItem('masterProductsBackupTime', formattedTime);
    setBackupTime(formattedTime);
    alert(`현재 등록된 스콘 마스터 전체 목록이 브라우저 백업으로 저장되었습니다!\n(저장 시간: ${formattedTime})`);
  }

  function handleHideProductName(name: string) {
    setHiddenProductNames(prev => [...prev, name]);
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function handleSaveCurrentOrder() {
    const cleanProducts = products.filter(p => p.product_name !== 'SYSTEM_SPACER');

    const updatedScones = cleanProducts.map(p => {
      const parsed = parseExtendedAliases(p.aliases);
      if (parsed.productType === 'material' || parsed.sconeType === 'package' || p.is_service) {
        return {
          ...p,
          created_at: p.created_at || new Date().toISOString()
        };
      }
      
      const idx = productSequence.findIndex(item => item.type === 'product' && item.name === p.product_name);
      const newSortOrder = idx !== -1 ? idx + 1 : 9999;
      
      const serialized = serializeExtendedAliases(
        parsed.cleanAliases,
        parsed.productType,
        parsed.sconeType,
        parsed.components,
        parsed.ovenBatchSize,
        newSortOrder
      );
      
      return {
        ...p,
        aliases: serialized,
        created_at: p.created_at || new Date().toISOString()
      };
    });

    const newSpacerProducts: Product[] = [];
    productSequence.forEach((item, index) => {
      if (item.type === 'spacer') {
        const spacerId = item.id;
        const existing = products.find(p => p.product_name === 'SYSTEM_SPACER' && p.option_name === spacerId);
        const id = existing ? existing.id : generateUUID();
        const createdAt = existing?.created_at || new Date().toISOString();
        
        newSpacerProducts.push({
          id,
          product_name: 'SYSTEM_SPACER',
          option_name: spacerId,
          shape_type: '기타',
          pcs_per_pan: 1,
          is_service: false,
          cream_per_pan: 0,
          aliases: `${item.name}::sort_order=${index + 1}`,
          created_at: createdAt
        } as Product);
      }
    });

    const finalProducts = [...updatedScones, ...newSpacerProducts];

    if (hasValidSupabaseConfig) {
      try {
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('product_name', 'SYSTEM_SPACER');
        if (deleteError) throw deleteError;

        const { error: upsertError } = await supabase
          .from('products')
          .upsert(finalProducts);
        if (upsertError) throw upsertError;

        setProducts(finalProducts);
        alert("현재 배치 순서와 구분선/공백 위치가 데이터베이스에 저장되었습니다!");
      } catch (err: any) {
        alert("순서 저장 실패: " + err.message);
      }
    } else {
      setProducts(finalProducts);
      alert("현재 배치 순서와 구분선/공백 위치가 로컬에 저장되었습니다! (Supabase 미연동)");
    }

    localStorage.setItem('masterProductsBackup', JSON.stringify(finalProducts));
    const now = new Date();
    const yy = String(now.getFullYear()).substring(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${yy}.${mm}.${dd} ${hh}:${min}`;
    localStorage.setItem('masterProductsBackupTime', formattedTime);
    setBackupTime(formattedTime);
  }

  async function handleRestoreFromBackup() {
    const rawBackup = localStorage.getItem('masterProductsBackup');
    let restoreSource = INITIAL_PRODUCTS;
    if (rawBackup) {
      try {
        restoreSource = JSON.parse(rawBackup);
      } catch (e) {
        console.error("Error parsing backup from localStorage, fallback to INITIAL_PRODUCTS", e);
      }
    }

    if (!confirm(`🔄 ${rawBackup ? '가장 최근에 저장한 백업 데이터' : '기본 백업 데이터(37개 상품 마스터)'}를 Supabase DB에 복구하시겠습니까?`)) return;
    
    if (hasValidSupabaseConfig) {
      try {
        await supabase
          .from('products')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        const seedPayload = restoreSource.map(p => {
          const { id, ...rest } = p;
          return rest;
        });

        const { data, error } = await supabase
          .from('products')
          .insert(seedPayload)
          .select();
        
        if (error) {
          if (error.message.includes("column") || error.code === "42703") {
            const fallbackPayload = seedPayload.map(p => {
              const cp = { ...p };
              delete cp.aliases;
              return cp;
            });
            const { data: fbData, error: fbError } = await supabase
              .from('products')
              .insert(fallbackPayload)
              .select();
            if (fbError) throw fbError;
            if (fbData) {
              setProducts(fbData);
              alert("백업 데이터 복원 성공! 단, 'aliases' 열이 없어 매칭 데이터는 복원되지 못했습니다.");
              return;
            }
          }
          throw error;
        }

        if (data) {
          setProducts(data);
          alert("백업 데이터 복원이 완료되었습니다!");
        }
      } catch (err: any) {
        alert("복원 실패: " + err.message);
      }
    } else {
      setProducts(restoreSource);
      alert("로컬 마스터에 백업 데이터 복원이 완료되었습니다. (Supabase 미연동)");
    }
  }

  async function handleSaveInlineAliases(id: string) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const parsedExisting = parseExtendedAliases(prod.aliases);
    const updatedAliasesClean = cleanString(editingAliasesVal);
    
    const updatedAliases = serializeExtendedAliases(
      updatedAliasesClean,
      parsedExisting.productType,
      parsedExisting.sconeType,
      parsedExisting.components,
      parsedExisting.ovenBatchSize,
      parsedExisting.sortOrder
    );

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ aliases: updatedAliases })
          .eq('id', id)
          .select();
        
        if (error) throw error;
        if (data) {
          setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
          alert("매칭 키워드가 성공적으로 수정되었습니다!");
        }
      } catch (err: any) {
        alert("수정 실패: " + err.message);
      }
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, aliases: updatedAliases } : p));
      alert("로컬 마스터에 매칭 키워드가 수정되었습니다. (Supabase 미연동)");
    }
    setEditingProdId(null);
  }

  async function handleSaveInlineOven(id: string) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const updatedOven = editingOvenVal.trim() ? parseInt(editingOvenVal, 10) : null;

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ oven_number: updatedOven })
          .eq('id', id)
          .select();
        
        if (error) throw error;
        if (data) {
          setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
          alert("오븐 번호가 성공적으로 수정되었습니다!");
        }
      } catch (err: any) {
        alert("오븐 번호 수정 실패: " + err.message);
      }
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, oven_number: updatedOven } : p));
      alert("로컬 마스터에 오븐 번호가 수정되었습니다. (Supabase 미연동)");
    }
    setEditingOvenProdId(null);
  }

  async function handleSaveInlineSortOrder(id: string) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const updatedSortVal = parseInt(editingSortVal, 10) || 9999;
    const parsedExisting = parseExtendedAliases(prod.aliases);
    const updatedAliases = serializeExtendedAliases(
      parsedExisting.cleanAliases,
      parsedExisting.productType,
      parsedExisting.sconeType,
      parsedExisting.components,
      parsedExisting.ovenBatchSize,
      updatedSortVal
    );

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ aliases: updatedAliases })
          .eq('id', id)
          .select();
        
        if (error) throw error;
        if (data) {
          setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
          alert("표시 순서가 성공적으로 수정되었습니다!");
        }
      } catch (err: any) {
        alert("표시 순서 수정 실패: " + err.message);
      }
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, aliases: updatedAliases } : p));
      alert("로컬 마스터에 표시 순서가 수정되었습니다. (Supabase 미연동)");
    }
    setEditingSortProdId(null);
  }

  function handleRegisterInstantly(rawUnregisteredName: string) {
    const expiry = localStorage.getItem('masterAuthExpiry');
    const isAuthValid = expiry ? Date.now() < parseInt(expiry, 10) : false;

    if (!isAuthValid) {
      setPendingInstName(rawUnregisteredName);
      setShowPasswordModal(true);
      return;
    }

    const cleanedName = rawUnregisteredName.replace(/^[-]+/g, "").replace("[하프팩]","").replace("[세트]","").replace("스틱","").replace("미니큐브","").replace(" 3팩","").trim();
    setNewSconeName(cleanedName);
    setNewSconeAliases(rawUnregisteredName);
    
    if (rawUnregisteredName.includes("큐브")) {
      setNewSconeShape("미니큐브");
      setNewSconeOption("[미니큐브]");
      setNewSconeYield(2);
      setNewSconeCream(0);
      setNewSconeProductType('scone');
      setNewSconeCompositionType('general');
    } else if (rawUnregisteredName.includes("스틱")) {
      setNewSconeShape("스틱스콘");
      setNewSconeOption("[스틱스콘]");
      setNewSconeYield(9);
      setNewSconeCream(0);
      setNewSconeProductType('scone');
      setNewSconeCompositionType('general');
    } else {
      setNewSconeShape("삼각스콘");
      setNewSconeOption("");
      setNewSconeYield(8);
      setNewSconeCream(0);
      setNewSconeProductType('scone');
      setNewSconeCompositionType('general');
    }
    
    setShowMasterModal(true);
  }

  function handlePasswordVerify(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem('masterPassword') || '1234';
    if (passwordInput === stored) {
      localStorage.setItem('masterAuthExpiry', String(Date.now() + 60 * 60 * 1000));
      setShowPasswordModal(false);
      setPasswordInput('');

      if (pendingInstName) {
        const targetName = pendingInstName;
        setPendingInstName(null);
        handleRegisterInstantly(targetName);
      } else {
        setShowMasterModal(true);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem('masterPassword') || '1234';
    if (currentPasswordInput !== stored) {
      alert("현재 비밀번호가 올바르지 않습니다.");
      return;
    }
    if (!newPasswordInput) {
      alert("새 비밀번호를 입력해 주세요.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert("새 비밀번호와 확인 입력이 일치하지 않습니다.");
      return;
    }
    localStorage.setItem('masterPassword', newPasswordInput);
    alert("비밀번호가 성공적으로 변경되었습니다!");
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setShowPasswordChangeModal(false);
  }

  function handleLoadProductToForm(p: Product) {
    const parsed = parseExtendedAliases(p.aliases);
    setNewSconeName(p.product_name);
    setNewSconeOption(p.option_name || '');
    setNewSconeShape(p.shape_type);
    setNewSconeOven(p.oven_number ? String(p.oven_number) : '');
    setNewSconeYield(p.pcs_per_pan);
    setNewSconeCream(p.cream_per_pan);
    setNewSconeAliases(parsed.cleanAliases);
    setNewSconeProductType(parsed.productType);
    setNewSconeCompositionType(parsed.sconeType);
    if (parsed.components.length > 0) {
      setNewSconePackageComponents(parsed.components.map(c => `${c.name}:${c.qty}`).join(', '));
    } else {
      setNewSconePackageComponents('');
    }
    setNewSconeSortOrder(parsed.sortOrder);
    setNewSconeOvenBatchSize(parsed.ovenBatchSize);
    setEditingFormProductId(p.id);
    setShowRegisterNewModal(true);
  }

  function handleSelectMappingTarget(unmappedName: string, productId: string) {
    setMappingSelections(prev => ({ ...prev, [unmappedName]: productId }));
  }

  async function handleConfirmMapping(unmappedName: string) {
    const targetId = mappingSelections[unmappedName];
    if (!targetId) return;

    const targetProduct = products.find(p => p.id === targetId);
    if (!targetProduct) return;

    const parsed = parseExtendedAliases(targetProduct.aliases);
    const currentCleanAliases = parsed.cleanAliases;
    const existingList = currentCleanAliases ? currentCleanAliases.split(',').map(a => a.trim()).filter(Boolean) : [];
    
    if (existingList.includes(unmappedName)) {
      alert("이미 해당 키워드가 존재합니다.");
      return;
    }

    const newList = [...existingList, unmappedName];
    const combinedAliases = newList.join(', ');

    const serialized = serializeExtendedAliases(
      combinedAliases,
      parsed.productType,
      parsed.sconeType,
      parsed.components
    );

    const updatedProduct = {
      ...targetProduct,
      aliases: serialized
    };

    if (hasValidSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('products')
          .upsert([updatedProduct])
          .select();
        
        if (error) throw error;
        if (data) {
          setProducts(prev => prev.map(p => p.id === targetId ? data[0] : p));
          alert(`[${unmappedName}] 상품이 [${targetProduct.product_name}]에 성공적으로 매칭되었습니다!`);
        }
      } catch (err: any) {
        alert("DB 매칭 실패: " + err.message);
      }
    } else {
      setProducts(prev => prev.map(p => p.id === targetId ? updatedProduct : p));
      alert(`로컬에서 [${unmappedName}] 상품이 [${targetProduct.product_name}]에 매칭되었습니다! (Supabase 미연동)`);
    }

    setMappingSelections(prev => {
      const copy = { ...prev };
      delete copy[unmappedName];
      return copy;
    });
  }

  function handleOpenRegisterNewModal(unmappedName: string) {
    setNewSconeName(unmappedName);
    setNewSconeOption('');
    setNewSconeShape('삼각스콘');
    setNewSconeOven('');
    setNewSconeYield(8);
    setNewSconeCream(0);
    setNewSconeAliases(unmappedName);
    setNewSconeProductType('scone');
    setNewSconeCompositionType('general');
    setNewSconePackageComponents('');
    setNewSconeSortOrder(9999);
    setNewSconeOvenBatchSize(3.0);
    setEditingFormProductId(null);
    setShowRegisterNewModal(true);
  }

  function handleOpenMappingModal(p: Product) {
    setMappingProduct(p);
    setShowMappingModal(true);
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

  return {
    theme,
    setTheme,
    rawText,
    setRawText,
    products,
    setProducts,
    orders,
    setOrders,
    decomposedOrders,
    carryOverTri,
    manualAdjustTri,
    carryOverCube,
    productSequence,
    setProductSequence,
    backupTime,

    // CRUD States
    newSconeName,
    setNewSconeName,
    newSconeOption,
    setNewSconeOption,
    newSconeShape,
    setNewSconeShape,
    newSconeOven,
    setNewSconeOven,
    newSconeYield,
    setNewSconeYield,
    newSconeCream,
    setNewSconeCream,
    newSconeAliases,
    setNewSconeAliases,
    newSconeProductType,
    setNewSconeProductType,
    newSconeCompositionType,
    setNewSconeCompositionType,
    newSconePackageComponents,
    setNewSconePackageComponents,
    newSconeSortOrder,
    setNewSconeSortOrder,
    newSconeOvenBatchSize,
    setNewSconeOvenBatchSize,
    editingFormProductId,
    setEditingFormProductId,

    // Inline edit states
    editingProdId,
    setEditingProdId,
    editingAliasesVal,
    setEditingAliasesVal,
    editingOvenProdId,
    setEditingOvenProdId,
    editingOvenVal,
    setEditingOvenVal,
    editingSortProdId,
    setEditingSortProdId,
    editingSortVal,
    setEditingSortVal,

    // Modals
    showPasswordModal,
    setShowPasswordModal,
    showMasterModal,
    setShowMasterModal,
    showPasswordChangeModal,
    setShowPasswordChangeModal,
    passwordInput,
    setPasswordInput,
    pendingInstName,
    setPendingInstName,
    mappingSelections,
    showRegisterNewModal,
    setShowRegisterNewModal,
    uploadedProductNames,
    showMappingModal,
    setShowMappingModal,
    mappingProduct,
    setMappingProduct,

    // Pass change form states
    currentPasswordInput,
    setCurrentPasswordInput,
    newPasswordInput,
    setNewPasswordInput,
    confirmPasswordInput,
    setConfirmPasswordInput,

    // Computations
    unregisteredScones,
    computedData,
    totals,
    subMaterials,

    // Ref managers
    fileInputRef,
    dragIdxRef,
    crudSectionRef,

    // Functions
    handleExcelFile,
    loadData,
    handleInputVal,
    updateSpacerName,
    deleteSpacer,
    addSpacer,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleCreateScone,
    handleDeleteScone,
    handleClearAllDBData,
    handleRestoreFromBackup,
    handleSaveCurrentBackup,
    handleHideProductName,
    handleSaveCurrentOrder,
    handleSaveInlineAliases,
    handleSaveInlineOven,
    handleSaveInlineSortOrder,
    handleRegisterInstantly,
    handlePasswordVerify,
    handleChangePassword,
    getOrderQtyByMatch,
    handleLoadProductToForm,
    handleSelectMappingTarget,
    handleConfirmMapping,
    handleOpenRegisterNewModal,
    handleOpenMappingModal
  };
}
