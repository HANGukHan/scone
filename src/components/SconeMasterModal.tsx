import React from 'react';
import { Product } from '../lib/types';
import { parseExtendedAliases, cleanString } from '../hooks/useSconeDashboard';

interface SconeMasterModalProps {
  show: boolean;
  onClose: () => void;
  products: Product[];
  handleCreateScone: (e: React.FormEvent) => void;
  handleDeleteScone: (id: string, name: string) => void;
  handleRestoreFromBackup: () => void;
  handleSaveCurrentBackup: () => void;
  handleClearAllDBData: () => void;
  handleSaveInlineAliases: (id: string) => void;
  handleSaveInlineOven: (id: string) => void;
  handleSaveInlineSortOrder: (id: string) => void;
  backupTime: string | null;
  newSconeName: string;
  setNewSconeName: (val: string) => void;
  newSconeOption: string;
  setNewSconeOption: (val: string) => void;
  newSconeShape: '삼각스콘' | '미니큐브' | '스틱스콘' | '기타';
  setNewSconeShape: (val: '삼각스콘' | '미니큐브' | '스틱스콘' | '기타') => void;
  newSconeOven: string;
  setNewSconeOven: (val: string) => void;
  newSconeYield: number;
  setNewSconeYield: (val: number) => void;
  newSconeCream: number;
  setNewSconeCream: (val: number) => void;
  newSconeAliases: string;
  setNewSconeAliases: (val: string) => void;
  newSconeProductType: 'scone' | 'material';
  setNewSconeProductType: (val: 'scone' | 'material') => void;
  newSconeCompositionType: 'general' | 'package';
  setNewSconeCompositionType: (val: 'general' | 'package') => void;
  newSconePackageComponents: string;
  setNewSconePackageComponents: (val: string) => void;
  editingProdId: string | null;
  setEditingProdId: (val: string | null) => void;
  editingAliasesVal: string;
  setEditingAliasesVal: (val: string) => void;
  editingOvenProdId: string | null;
  setEditingOvenProdId: (val: string | null) => void;
  editingOvenVal: string;
  setEditingOvenVal: (val: string) => void;
  editingSortProdId: string | null;
  setEditingSortProdId: (val: string | null) => void;
  editingSortVal: string;
  setEditingSortVal: (val: string) => void;
  setShowPasswordChangeModal: (val: boolean) => void;
  handleLoadProductToForm: (p: Product) => void;
  handleOpenRegisterNewModal: (unmappedName: string) => void;
  handleOpenMappingModal: (p: Product) => void;
}

export const SconeMasterModal: React.FC<SconeMasterModalProps> = ({
  show,
  onClose,
  products,
  handleCreateScone,
  handleDeleteScone,
  handleRestoreFromBackup,
  handleSaveCurrentBackup,
  handleClearAllDBData,
  handleSaveInlineAliases,
  handleSaveInlineOven,
  handleSaveInlineSortOrder,
  backupTime,
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
  setShowPasswordChangeModal,
  handleLoadProductToForm,
  handleOpenRegisterNewModal,
  handleOpenMappingModal
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-6xl p-6 relative shadow-2xl" style={{ display: 'flex', flexDirection: 'column', height: '85vh', maxHeight: '90vh' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hover:bg-white/10 transition"
        >
          ✕
        </button>
        <div className="section-title mb-6">
          <span>🛠️ 스콘 마스터 관리 (Supabase DB 연동)</span>
        </div>
        
        <div className="grid grid-cols-1 gap-6" style={{ flex: 1, overflow: 'hidden' }}>
          {/* Master List Table */}
          <div className="card col-span-1" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span>등록된 스콘 마스터 목록</span>
                <span className="text-xs opacity-50 font-normal ml-2">총 {products.length}개 구성</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleOpenRegisterNewModal("")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  ➕ 신규 상품 등록
                </button>
                <button 
                  onClick={() => setShowPasswordChangeModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  🔑 비밀번호 변경
                </button>
                <button 
                  onClick={handleSaveCurrentBackup}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  💾 현재 스콘 마스터 백업 저장
                </button>
                <button 
                  onClick={handleRestoreFromBackup}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                  title={backupTime ? `최신 백업: ${backupTime}` : undefined}
                >
                  🔄 백업 데이터 복원 {backupTime ? `(최신 백업: ${backupTime})` : ''}
                </button>
                <button 
                  onClick={handleClearAllDBData}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  🗑️ DB 데이터 전체 초기화
                </button>
              </div>
            </div>
            
            <div className="table-container" style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <table>
                <thead>
                  <tr style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-surface-elevated)' }}>
                    <th style={{ textAlign: 'left', paddingLeft: '16px' }}>스콘명</th>
                    <th>옵션</th>
                    <th>형태</th>
                    <th>오븐</th>
                    <th>수율</th>
                    <th>생크림</th>
                    <th>순서</th>
                    <th>매칭 키워드</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const sortedProducts = [...products].sort((a, b) => {
                      const hasOptA = a.option_name && a.option_name.trim() !== '';
                      const hasOptB = b.option_name && b.option_name.trim() !== '';
                      if (hasOptA !== hasOptB) {
                        return (hasOptA ? 1 : 0) - (hasOptB ? 1 : 0);
                      }
                      const nameCompare = a.product_name.localeCompare(b.product_name, 'ko');
                      if (nameCompare !== 0) return nameCompare;
                      return (a.option_name || '').localeCompare(b.option_name || '', 'ko');
                    });
                    return sortedProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ textAlign: 'left', paddingLeft: '16px', fontWeight: '500' }}>{p.product_name}</td>
                        <td>{p.option_name || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                            <span className="text-xs opacity-75">{p.shape_type}</span>
                            {(() => {
                              const parsed = parseExtendedAliases(p.aliases);
                              if (parsed.productType === 'material') {
                                return <span className="text-[9px] px-1 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20" style={{ display: 'inline-block', marginTop: '2px' }}>부자재/포장재</span>;
                              }
                              if (parsed.sconeType === 'package') {
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                                    <span className="text-[9px] px-1 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20" style={{ display: 'inline-block' }}>세트/패키지</span>
                                    {parsed.components.length > 0 && (
                                      <span className="text-[9px] opacity-60 text-center" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={parsed.components.map(c => `${c.name} x${c.qty}`).join(', ')}>
                                        {parsed.components.map(c => `${c.name}x${c.qty}`).join(', ')}
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </td>
                        <td>
                          {editingOvenProdId === p.id ? (
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
                              <input 
                                type="number" 
                                value={editingOvenVal}
                                onChange={(e) => setEditingOvenVal(e.target.value)}
                                className="bg-[#1e2942] border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-[#f8fafc]"
                                style={{ width: '50px' }}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveInlineOven(p.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                저장
                              </button>
                              <button 
                                onClick={() => setEditingOvenProdId(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                              {p.oven_number ? (
                                <span className="badge-oven badge-tri">오븐 {p.oven_number}</span>
                              ) : '-'}
                              <button 
                                onClick={() => {
                                  setEditingOvenProdId(p.id);
                                  setEditingOvenVal(p.oven_number ? String(p.oven_number) : '');
                                }}
                                className="text-indigo-400 hover:text-indigo-300 text-[10px] underline cursor-pointer"
                              >
                                수정
                              </button>
                            </div>
                          )}
                        </td>
                        <td>{p.pcs_per_pan}개</td>
                        <td>{p.cream_per_pan}ml</td>
                        <td>
                          {editingSortProdId === p.id ? (
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
                              <input 
                                type="number" 
                                value={editingSortVal}
                                onChange={(e) => setEditingSortVal(e.target.value)}
                                className="bg-[#1e2942] border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-[#f8fafc]"
                                style={{ width: '50px' }}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveInlineSortOrder(p.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                저장
                              </button>
                              <button 
                                onClick={() => setEditingSortProdId(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                              <span>{parseExtendedAliases(p.aliases).sortOrder}</span>
                              <button 
                                onClick={() => {
                                  setEditingSortProdId(p.id);
                                  setEditingSortVal(String(parseExtendedAliases(p.aliases).sortOrder));
                                }}
                                className="text-indigo-400 hover:text-indigo-300 text-[10px] underline cursor-pointer"
                              >
                                수정
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '11px', opacity: 0.8, maxWidth: '280px' }}>
                          {editingProdId === p.id ? (
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              <input 
                                type="text" 
                                value={editingAliasesVal}
                                onChange={(e) => setEditingAliasesVal(e.target.value)}
                                className="bg-[#1e2942] border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-[#f8fafc]"
                                placeholder="쉼표로 구분"
                                style={{ width: '160px' }}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveInlineAliases(p.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                저장
                              </button>
                              <button 
                                onClick={() => setEditingProdId(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded transition"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', width: '100%' }}>
                              {(() => {
                                const parsed = parseExtendedAliases(p.aliases);
                                if (!parsed.cleanAliases) return <span className="text-xs opacity-50">-</span>;
                                return parsed.cleanAliases.split(',').map((alias, idx) => {
                                  const cleanAlias = cleanString(alias);
                                  if (!cleanAlias) return null;
                                  return (
                                    <span 
                                      key={idx} 
                                      className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-1.5 py-0.5 rounded-full"
                                      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                                    >
                                      {cleanAlias}
                                    </span>
                                  );
                                });
                              })()}
                              <button 
                                onClick={() => {
                                  setEditingProdId(p.id);
                                  setEditingAliasesVal(parseExtendedAliases(p.aliases).cleanAliases);
                                }}
                                className="text-indigo-400 hover:text-indigo-300 text-[10px] underline ml-auto cursor-pointer"
                              >
                                수정
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          {!p.is_service ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleOpenMappingModal(p)}
                                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded transition cursor-pointer"
                              >
                                🔗 매핑
                              </button>
                              <button 
                                onClick={() => handleLoadProductToForm(p)}
                                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded transition cursor-pointer"
                              >
                                편집
                              </button>
                              <button 
                                onClick={() => handleDeleteScone(p.id, p.product_name + (p.option_name || ""))}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs px-2 py-1 rounded transition cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs opacity-50">고정</span>
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
