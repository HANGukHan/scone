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
  totals
}) => {
  return (
    <div className="table-container">
      <table id="productionTable">
        <thead>
          <tr style={{ background: 'var(--bg-surface-elevated)' }}>
            <th className="no-print col-drag-handle" style={{ width: '40px' }} />
            <th style={{ textAlign: 'left', paddingLeft: '16px', minWidth: '160px' }}>스콘명</th>
            <th>삼각 오븐</th>
            <th>큐브/스틱 오븐</th>
            <th className="hl-pans">합계 판수</th>
            
            {/* Triangular Scone Header Group */}
            <th style={{ background: 'rgba(99, 102, 241, 0.05)' }}>삼각 주문량</th>
            <th className="no-print" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>전날남음</th>
            <th className="no-print" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>수동조정</th>
            <th style={{ background: 'rgba(99, 102, 241, 0.05)' }}>삼각 판수</th>
            <th style={{ background: 'rgba(99, 102, 241, 0.05)', borderRight: '2px solid var(--border-color)' }}>남은량 (개)</th>
            
            {/* Mini Cube Header Group */}
            <th className="no-print" style={{ background: 'rgba(236, 72, 153, 0.05)' }}>전날남음 (봉)</th>
            <th style={{ background: 'rgba(236, 72, 153, 0.05)' }}>큐브 판수</th>
            <th style={{ background: 'rgba(236, 72, 153, 0.05)', borderRight: '2px solid var(--border-color)' }}>남은량 (봉)</th>
            
            {/* Stick Scone Header Group */}
            <th style={{ background: 'rgba(245, 158, 11, 0.05)' }}>스틱 판수</th>
            <th style={{ background: 'rgba(245, 158, 11, 0.05)' }}>남은량 (팩)</th>
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
                  <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
                  <td colSpan={3} style={{ textAlign: 'left', paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
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
                  <td style={{ borderRight: '2px solid var(--border-color)' }}></td>
                  <td className="no-print"></td>
                  <td></td>
                  <td style={{ borderRight: '2px solid var(--border-color)' }}></td>
                  <td></td>
                  <td></td>
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
                <td className="no-print col-drag-handle" style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
                <td className="hl-name">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{r.name}</span>
                    <button 
                      onClick={() => handleHideProductName(r.name)}
                      className="no-print text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition ml-2 border border-rose-500/20"
                      title="당일 생산량 집계에서 임시 숨김"
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    >
                      ✕
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
                      value={adjVal} 
                      onChange={(e) => handleInputVal(r.name, 'manualAdjustTri', parseInt(e.target.value, 10) || 0)} 
                      style={{
                        color: hasAdjHighlight ? '#fb923c' : 'inherit',
                        fontWeight: hasAdjHighlight ? 'bold' : 'normal'
                      }}
                    />
                  ) : ''}
                </td>
                <td className="hl-adjusted-pans">{r.hasTri ? r.triU : ''}</td>
                <td style={{ 
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
                <td className="hl-rem" style={{ borderRight: '2px solid var(--border-color)' }}>
                  {r.hasCube && r.name.includes('[미니쉐이크]') ? (pCube && pCube.pcs_per_pan === 4 ? r.cubeAB : r.cubeAA) : ''}
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
                if (!r.name.includes('[미니쉐이크]')) return sum;
                const pCube = products.find(p => p.product_name === r.name && p.shape_type === '미니큐브');
                const pcs = pCube ? pCube.pcs_per_pan : 2;
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
  );
};
