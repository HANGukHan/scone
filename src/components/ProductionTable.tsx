import React from 'react';
import { Product } from '../lib/types';

interface ProductionTableProps {
  productSequence: any[];
  computedData: Record<string, any>;
  products: Product[];
  carryOverTri: Record<string, number>;
  carryOverCube: Record<string, number>;
  manualAdjustTri: Record<string, number>;
  handleInputVal: (name: string, stateKey: string, val: number) => void;
  updateSpacerName: (idx: number, name: string) => void;
  deleteSpacer: (idx: number) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;
  handleHideProductName: (name: string) => void;
  totals: {
    totalPans: number;
    creamLitres: number;
    extraScones: number;
    shortage: number;
    serviceSconeOrdered: number;
  };
  addSpacer: () => void;
}

export const ProductionTable: React.FC<ProductionTableProps> = ({
  productSequence,
  computedData,
  products,
  carryOverTri,
  carryOverCube,
  manualAdjustTri,
  handleInputVal,
  updateSpacerName,
  deleteSpacer,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleHideProductName,
  totals,
  addSpacer
}) => {
  return (
    <div className="table-container">
      <table id="productionTable">
        <thead>
          <tr style={{ background: 'var(--bg-surface-elevated)' }}>
            <th className="no-print col-drag-handle" style={{ width: '68px', minWidth: '68px', padding: '0 4px', textAlign: 'center' }}>
              <button 
                onClick={addSpacer} 
                className="no-print text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 text-[10px] h-6 px-1.5 rounded border border-emerald-500/20 font-bold transition"
                title="구분선/공백 추가"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                ➕ 공백
              </button>
            </th>
            <th style={{ textAlign: 'left', paddingLeft: '16px', minWidth: '160px' }}>스콘명</th>
            <th>삼각 오븐</th>
            <th>큐브/스틱 오븐</th>
            <th className="hl-pans">총 판수</th>
            
            {/* Triangular Scone Header Group */}
            <th style={{ background: 'rgba(99, 102, 241, 0.05)' }}>삼각 주문량(개)</th>
            <th className="no-print" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>이월재고(개)</th>
            <th className="no-print" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>수동조정(판)</th>
            <th style={{ background: 'rgba(99, 102, 241, 0.05)' }}>삼각 판수</th>
            <th className="hl-rem-qty-tri" style={{ background: 'rgba(99, 102, 241, 0.05)', borderRight: '2px solid var(--border-color)' }}>남은량 (개)</th>
            
            {/* Mini Cube Header Group */}
            <th className="no-print" style={{ background: 'rgba(236, 72, 153, 0.05)' }}>이월재고 (봉)</th>
            <th style={{ background: 'rgba(236, 72, 153, 0.05)' }}>큐브 판수</th>
            <th className="hl-rem-qty" style={{ background: 'rgba(236, 72, 153, 0.05)', borderRight: '2px solid var(--border-color)' }}>남은량 (봉)</th>
            
            {/* Stick Scone Header Group */}
            <th style={{ background: 'rgba(245, 158, 11, 0.05)' }}>스틱 판수</th>
            <th className="hl-rem-qty" style={{ background: 'rgba(245, 158, 11, 0.05)' }}>남은량 (팩)</th>
          </tr>
        </thead>
        <tbody>
          {productSequence.map((item, index) => {
            if (item.type === 'spacer') {
              return (
                <tr 
                  key={item.id} 
                  className="spacer-row"
                  draggable 
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center', width: '68px', minWidth: '68px' }}>☰</td>
                  <td colSpan={3} style={{ textAlign: 'left', paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                      <input 
                        type="text" 
                        className="spacer-input-field" 
                        value={item.name} 
                        onChange={(e) => updateSpacerName(index, e.target.value)} 
                        placeholder="구분선/공백"
                      />
                      <button 
                        onClick={() => deleteSpacer(index)}
                        className="no-print text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 w-7 h-7 rounded-lg flex items-center justify-center transition border border-rose-500/20 bg-rose-500/5"
                        title="구분선 삭제"
                        style={{ cursor: 'pointer', flexShrink: 0, padding: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td className="no-print"></td>
                  <td className="no-print"></td>
                  <td></td>
                  <td className="hl-rem-qty-tri" style={{ borderRight: '2px solid var(--border-color)' }}></td>
                  <td className="no-print"></td>
                  <td></td>
                  <td className="hl-rem-qty" style={{ borderRight: '2px solid var(--border-color)' }}></td>
                  <td></td>
                  <td className="hl-rem-qty"></td>
                </tr>
              );
            }

            const r = computedData[item.name];
            if (!r) return null;

            const pCube = products.find(p => p.product_name === item.name && p.shape_type === '미니큐브');
            const adjVal = manualAdjustTri[r.name] || 0;
            const hasAdjHighlight = adjVal !== 0;

            return (
              <tr 
                key={item.id}
                draggable 
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center', width: '68px', minWidth: '68px' }}>☰</td>
                <td className="hl-name">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{r.name}</span>
                    <button 
                      onClick={() => handleHideProductName(r.name)}
                      className="no-print text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 w-7 h-7 rounded-lg flex items-center justify-center transition ml-2 border border-rose-500/20 bg-rose-500/5"
                      title="당일 생산량 집계에서 임시 숨김"
                      style={{ cursor: 'pointer', flexShrink: 0, padding: 0 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </td>
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
                <td className="no-print" style={{
                  background: hasAdjHighlight ? 'rgba(245, 158, 11, 0.15)' : 'transparent'
                }}>
                  {r.hasTri ? (
                    <input 
                      type="number" 
                      className="table-input" 
                      value={adjVal === 0 ? '' : adjVal} 
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : (parseInt(e.target.value, 10) || 0);
                        handleInputVal(r.name, 'manualAdjustTri', val);
                      }}
                      onFocus={(e) => e.target.select()}
                      style={{
                        color: hasAdjHighlight ? '#fb923c' : 'inherit',
                        fontWeight: hasAdjHighlight ? 'bold' : 'normal'
                      }}
                    />
                  ) : ''}
                </td>
                <td className="hl-adjusted-pans">{r.hasTri ? r.triU : ''}</td>
                <td className="hl-rem-qty-tri" style={{ 
                   borderRight: '2px solid var(--border-color)',
                   background: (r.hasTri && r.triW === 0) ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                   color: (r.hasTri && r.triW === 0) ? '#fb923c' : 'inherit',
                   fontWeight: (r.hasTri && r.triW === 0) ? 'bold' : 'normal'
                 }}>
                   {r.hasTri ? r.triW : ''}
                </td>
                
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
                <td className="hl-rem-qty" style={{ borderRight: '2px solid var(--border-color)' }}>
                  {r.hasCube ? (pCube && pCube.pcs_per_pan === 4 ? r.cubeAB : r.cubeAA) : ''}
                </td>
                
                {/* Stick */}
                <td className="hl-adjusted-pans">{r.hasStick ? r.stickAC : ''}</td>
                <td className="hl-rem-qty">{r.hasStick ? r.stickAD : ''}</td>
              </tr>
            );
          })}

          {/* Table Totals Row */}
          <tr style={{ background: 'rgba(255, 255, 255, 0.03)', fontWeight: 'bold' }}>
            <td className="no-print col-drag-handle" style={{ width: '68px', minWidth: '68px' }}></td>
            <td className="hl-name" style={{ textAlign: 'center', borderRight: '2px solid var(--border-color)' }}>합계</td>
            <td></td>
            <td></td>
            <td className="hl-pans" id="sumTotalPans">{totals.totalPans}판</td>
            
            {/* Tri */}
            <td id="sumTriR">{Object.values(computedData).reduce((sum, r) => sum + r.triR, 0)}</td>
            <td className="no-print"></td>
            <td className="no-print"></td>
            <td id="sumTriU">{Object.values(computedData).reduce((sum, r) => sum + r.triU, 0)}</td>
            <td id="sumTriW" className="hl-rem-qty-tri" style={{ borderRight: '2px solid var(--border-color)' }}>{Object.values(computedData).reduce((sum, r) => sum + r.triW, 0)}</td>
            
            {/* Cube */}
            <td className="no-print"></td>
            <td id="sumCubeY">{Object.values(computedData).reduce((sum, r) => sum + r.cubeY, 0)}</td>
            <td id="sumCubeAB" className="hl-rem-qty" style={{ borderRight: '2px solid var(--border-color)' }}>
              {Object.values(computedData).reduce((sum, r) => {
                if (!r.name.includes('[미니쉐이크]')) return sum;
                const pCube = products.find(p => p.product_name === r.name && p.shape_type === '미니큐브');
                const pcs = pCube ? pCube.pcs_per_pan : 2;
                return sum + (pcs === 4 ? r.cubeAB : r.cubeAA);
              }, 0)}
            </td>
            
            {/* Stick */}
            <td id="sumStickAC">{Object.values(computedData).reduce((sum, r) => sum + r.stickAC, 0)}</td>
            <td id="sumStickAD" className="hl-rem-qty">{Object.values(computedData).reduce((sum, r) => sum + r.stickAD, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
