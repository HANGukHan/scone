export interface Product {
  id: string;
  product_name: string;
  option_name: string | null;
  shape_type: '삼각스콘' | '미니큐브' | '스틱스콘' | '기타';
  oven_number: number | null;
  pcs_per_pan: number;
  cream_per_pan: number;
  is_service: boolean;
}

export interface OrderWithProduct {
  id?: string;
  order_date: string;
  product_id: string;
  order_qty: number;
  extra_pan_qty: number;
}

export interface CalculatedRow {
  product: Product;
  orderedQty: number;
  extraPans: number;
  pans: number;
  remaining: number;
}

export interface OvenBatch {
  productName: string;
  ovenNumber: number;
  pansA: number;
  fullPans: number;
  fullPans3: number;
  remainingPans: number;
}

export interface CalculatedResult {
  rows: CalculatedRow[];
  totalPans: number;
  totalCream: number;
  serviceOrdered: number;
  extraScones: number;
  serviceShortage: number;
  serviceLeftover: number;
  ovenBatches: OvenBatch[];
}
