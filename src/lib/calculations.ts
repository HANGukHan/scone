import { Product, OrderWithProduct, CalculatedResult } from './types';

export function runProductionCalculations(
  products: Product[],
  orders: OrderWithProduct[]
): CalculatedResult {
  // Map orders to products for quick lookup
  const orderMap = new Map<string, OrderWithProduct>();
  orders.forEach(o => {
    orderMap.set(o.product_id, o);
  });

  let totalPans = 0;
  let totalCream = 0;
  let serviceShortage = 0;
  let serviceLeftover = 0;

  // Find service scone quantity
  const serviceProduct = products.find(p => p.is_service);
  const serviceOrdered = serviceProduct ? (orderMap.get(serviceProduct.id)?.order_qty || 0) : 0;

  const productRows = products
    .filter(p => !p.is_service)
    .map(p => {
      const order = orderMap.get(p.id);
      const qty = order?.order_qty || 0;
      const extraPans = order?.extra_pan_qty || 0;
      
      let pans = 0;
      let remaining = 0;
      
      // Calculate shape-specific yields
      if (p.shape_type === '삼각스콘') {
        const netQty = Math.max(0, qty);
        const basePans = Math.ceil(netQty / p.pcs_per_pan);
        const baseRemaining = basePans * p.pcs_per_pan - netQty;
        
        // Manual adjustment additions
        pans = basePans + extraPans;
        remaining = baseRemaining + extraPans * p.pcs_per_pan;
      } else if (p.shape_type === '미니큐브') {
        pans = Math.ceil(qty / p.pcs_per_pan);
        remaining = pans * p.pcs_per_pan - qty;
      } else if (p.shape_type === '스틱스콘') {
        pans = Math.ceil(qty / p.pcs_per_pan);
        remaining = pans * p.pcs_per_pan - qty;
      }

      totalPans += pans;
      totalCream += pans * p.cream_per_pan;

      return {
        product: p,
        orderedQty: qty,
        extraPans,
        pans,
        remaining,
      };
    });

  // Calculate Extra Scones (Triangular remaining + Stick remaining)
  const totalTriRemaining = productRows
    .filter(r => r.product.shape_type === '삼각스콘')
    .reduce((sum, r) => sum + r.remaining, 0);

  const totalStickRemaining = productRows
    .filter(r => r.product.shape_type === '스틱스콘')
    .reduce((sum, r) => sum + r.remaining, 0);

  const extraScones = totalTriRemaining + totalStickRemaining;
  const netShortage = serviceOrdered - extraScones;

  if (netShortage > 0) {
    serviceShortage = netShortage;
    serviceLeftover = 0;
  } else {
    serviceShortage = 0;
    serviceLeftover = Math.abs(netShortage);
  }

  // Calculate Oven batches (Page 2 layout details)
  const ovenBatches = productRows
    .filter(r => r.product.shape_type === '삼각스콘' && r.product.oven_number !== null)
    .map(r => {
      const valAJ = r.pans; // Adjusted pans
      const valAK = Math.floor(valAJ / 3); // Full 3-pan sets
      const valAM = valAJ - (3 * valAK); // Overhang pans
      
      let valAL = valAK;
      if (valAK > 0 && valAM > 0 && valAK > 1) {
        valAL = valAK - 1;
      }
      
      const valAN = 3 * (valAK - valAL) + valAM; // Remaining batter pans
      
      return {
        productName: r.product.product_name,
        ovenNumber: r.product.oven_number!,
        pansA: valAJ,
        fullPans: valAK,
        fullPans3: valAL,
        remainingPans: valAN
      };
    });

  return {
    rows: productRows,
    totalPans,
    totalCream: totalCream / 1000, // Liters
    serviceOrdered,
    extraScones,
    serviceShortage,
    serviceLeftover,
    ovenBatches
  };
}
