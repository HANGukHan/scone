import React from 'react';
import { Product } from '../lib/types';
import { parseExtendedAliases } from '../hooks/useSconeDashboard';

interface FooterMetricsProps {
  subMaterials: {
    matGreek: number;
    matSmooth: number;
    matCrunch: number;
    matGreen: number;
    matPave: number;
    matInjeolmi: number;
    matStarter: number;
    matImagine: number;
    matOpp: number;
  };
  totals: {
    totalPans: number;
    creamLitres: number;
    extraScones: number;
    shortage: number;
    serviceSconeOrdered: number;
  };
  products: Product[];
  getOrderQtyByMatch: (product: Product) => number;
}

export const FooterMetrics: React.FC<FooterMetricsProps> = ({
  subMaterials,
  totals,
  products,
  getOrderQtyByMatch
}) => {
  return (
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
            <span className="opacity-75">삼각스콘+스틱스콘 합</span>
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

      {/* Packaging materials card */}
      <div className="card">
        <div className="card-title">부자재 / 포장재 주문 집계</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '180px', paddingRight: '4px' }}>
          {(() => {
            const materialProds = products.filter(p => {
              const parsed = parseExtendedAliases(p.aliases);
              return parsed.productType === 'material';
            });
            
            const activeMaterials = materialProds.filter(p => getOrderQtyByMatch(p) > 0);
            
            if (activeMaterials.length === 0) {
              return <div className="text-xs opacity-50 text-center py-8">주문된 부자재/포장재 없음</div>;
            }
            
            return activeMaterials.map(p => {
              const qty = getOrderQtyByMatch(p);
              return (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span className="text-xs opacity-75">{p.product_name} {p.option_name || ''}</span>
                  <strong className="text-xs font-bold text-indigo-400">{qty} 개</strong>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};
