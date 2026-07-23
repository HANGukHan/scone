import React from 'react';
import { parseExtendedAliases } from '../hooks/useSconeDashboard';
import { Product } from '../lib/types';

interface OvenBatchTableProps {
  productSequence: any[];
  computedData: Record<string, any>;
  products: Product[];
}

export const OvenBatchTable: React.FC<OvenBatchTableProps> = ({
  productSequence,
  computedData,
  products
}) => {
  return (
    <div className="page-2" style={{ marginTop: '24px' }}>
      <div className="section-title">
        <span>🔥 오븐표</span>
        <span id="printDate2" className="print-only" style={{ fontSize: '11px', fontWeight: 'normal', marginLeft: 'auto' }} />
      </div>

      <div className="table-container">
        <table id="ovenTable">
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)' }}>
              <th style={{ textAlign: 'left', paddingLeft: '16px' }}>상품명</th>
              <th>오븐 번호</th>
              <th className="hl-pans">삼각/바 판수</th>
              <th style={{ display: 'none' }}>풀팬 (AK = A ÷ 단위)</th>
              <th className="hl-adjusted-pans">풀팬 (기본단위 3판)</th>
              <th className="hl-rem">남는 반죽 판수</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let sumAJ = 0, sumAK = 0, sumAL = 0, sumAN = 0;
              
              const rows = productSequence.map((item) => {
                if (item.type === 'spacer') {
                  return (
                    <tr key={"oven-" + item.id} style={{ height: '42px' }}>
                      <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>{item.name || '\u00A0'}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td style={{ display: 'none' }}></td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  );
                }

                const r = computedData[item.name];
                if (!r || !r.hasTri) return null;

                const pTri = products.find(p => p.product_name === item.name && p.shape_type === '삼각스콘');
                const parsed = parseExtendedAliases(pTri?.aliases);
                const batchSize = parsed.ovenBatchSize; // defaults to 3.0

                const valAJ = r.triU; 
                const valAK = Math.floor(valAJ / batchSize); 
                const valAM = valAJ - (batchSize * valAK); 
                
                let valAL = valAK; 
                if (valAK > 0 && valAM > 0 && valAK > 1) {
                  valAL = valAK - 1;
                }
                
                const valAN = batchSize * (valAK - valAL) + valAM;

                sumAJ += valAJ;
                sumAK += valAK;
                sumAL += valAL;
                sumAN += valAN;

                return (
                  <tr key={"oven-" + item.id} className="hover:bg-white/[0.01]">
                    <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: '500' }}>
                      {r.name}
                      {batchSize !== 3.0 && <strong className="ml-1 text-[10px]" style={{ color: 'var(--accent-color)' }}>({batchSize}판)</strong>}
                    </td>
                    <td><span className="badge-oven badge-tri">오븐 {r.ovenTri}</span></td>
                    <td className="hl-pans">{valAJ}</td>
                    <td style={{ display: 'none' }}>{valAK}</td>
                    <td className="hl-adjusted-pans">{valAL}</td>
                    <td className="hl-rem" style={{ fontWeight: 'bold', background: 'rgba(245, 158, 11, 0.05)' }}>{valAN}</td>
                  </tr>
                );
              }).filter(Boolean);

              // Append sum row
              rows.push(
                <tr key="oven-totals" style={{ background: 'rgba(255, 255, 255, 0.03)', fontWeight: 'bold' }}>
                  <td style={{ textAlign: 'center' }}>합계</td>
                  <td></td>
                  <td id="ovenSumA" className="hl-pans">{sumAJ}</td>
                  <td id="ovenSumFull" style={{ display: 'none' }}>{sumAK}</td>
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
  );
};
