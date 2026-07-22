import React from 'react';
import { Product } from '../lib/types';
import { parseExtendedAliases } from '../hooks/useSconeDashboard';

interface FooterMetricsProps {
  subMaterials: Array<{
    id: string;
    name: string;
    option: string | null;
    shape: '삼각스콘' | '미니큐브' | '스틱스콘' | '기타';
    aliases: string | null;
    qty: number;
  }>;
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
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
      {/* Dynamic Sub-Materials table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span>📦 부자재 / 포장재 주문 집계 현황</span>
            <span className="text-xs opacity-50 font-normal ml-2">총 {subMaterials.length}개 품목</span>
          </div>
        </div>
        
        <div className="table-container" style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
          <table className="production-table text-xs" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>품목명</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>옵션/구분</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', width: '100px' }}>주문량</th>
              </tr>
            </thead>
            <tbody>
              {subMaterials.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center opacity-50 py-12">등록된 부자재/포장재 마스터 상품이 없습니다.</td>
                </tr>
              ) : (
                subMaterials.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{m.name}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{m.option || '-'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', color: m.qty > 0 ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                      {m.qty} 개
                    </td>
                  </tr>
                ))
              )}
              
              {/* Cream summary computed row */}
              <tr style={{ background: 'rgba(99, 102, 241, 0.05)', borderTop: '2px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-color)' }}>🍶 생크림 소요 총량</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>-</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                  {totals.creamLitres} L
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Service shortage card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
        <div className="card-title">🍰 서비스 스콘 부족분 집계</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span className="opacity-75">서비스 주문량</span>
            <strong id="svcOrdered" className="text-lg">{totals.serviceSconeOrdered} 개</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span className="opacity-75">삼각스콘+스틱스콘 합</span>
            <strong id="svcExtra" className="text-lg text-emerald-500">{totals.extraScones} 개</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
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
  );
};
