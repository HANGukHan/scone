import React, { useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { findMatchedProduct } from '../hooks/useSconeDashboard';

interface ProductMappingModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
  uploadedProductNames: string[];
  unregisteredScones: string[];
  products: Product[];
  onSave: (productId: string, newAliases: string) => Promise<void>;
}

export const ProductMappingModal: React.FC<ProductMappingModalProps> = ({
  show,
  onClose,
  product,
  uploadedProductNames,
  unregisteredScones,
  products,
  onSave
}) => {
  const [aliasesList, setAliasesList] = useState<string[]>([]);
  const [newAliasInput, setNewAliasInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Parse product aliases when product changes
  useEffect(() => {
    if (product) {
      const serialized = product.aliases || '';
      // Parse serialized format
      let cleanAliasesStr = serialized;
      if (serialized.includes('::')) {
        const parts = serialized.split('::');
        cleanAliasesStr = parts[0]; // first part contains standard aliases
      }
      const list = cleanAliasesStr
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);
      setAliasesList(list);
    } else {
      setAliasesList([]);
    }
    setNewAliasInput('');
  }, [product]);

  if (!show || !product) return null;

  const handleAddAlias = (alias: string) => {
    const trimmed = alias.trim();
    if (!trimmed) return;
    if (aliasesList.includes(trimmed)) {
      alert("이미 매핑 키워드로 등록되어 있습니다.");
      return;
    }
    setAliasesList(prev => [...prev, trimmed]);
    setNewAliasInput('');
  };

  const handleRemoveAlias = (indexToRemove: number) => {
    setAliasesList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const combinedAliasesStr = aliasesList.join(', ');
      await onSave(product.id, combinedAliasesStr);
      onClose();
    } catch (err: any) {
      alert("매핑 저장 중 오류 발생: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Find mapping status of uploaded names
  const getUploadNameStatus = (name: string) => {
    if (unregisteredScones.includes(name)) {
      return { label: '미매칭 ⚠️', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' };
    }
    
    // Find which product matches this name
    const match = findMatchedProduct(name, products);

    if (match) {
      return { 
        label: `매칭됨 (${match.product_name}) ✅`, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        matchedToSelf: product ? match.id === product.id : false 
      };
    }

    return { label: '매칭됨 ✅', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30', matchedToSelf: false };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-4xl p-6 relative shadow-2xl" style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
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

        <div className="section-title mb-4">
          <span>🔗 매칭 상품(B) 관리 (사전 매핑)</span>
        </div>

        <div style={{ marginBottom: '16px', background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>기준 DB 표준 상품 [A]</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {product.product_name}
            {product.option_name && <span className="text-sm font-normal text-white/60">({product.option_name})</span>}
            <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white font-normal">{product.shape_type}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Left side: Current Aliases list & manual input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-title">연결된 엑셀 상품명 [B]</div>
              <p className="text-xs opacity-60 mb-3">엑셀 업로드 시 아래 키워드와 정확히 일치하거나 포함되면 본 상품으로 자동 집계됩니다.</p>
              
              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-base)', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignContent: 'flex-start' }}>
                {aliasesList.length === 0 ? (
                  <div className="text-xs opacity-40 w-full text-center py-8">등록된 매칭 상품 키워드가 없습니다.</div>
                ) : (
                  aliasesList.map((alias, idx) => (
                    <div 
                      key={idx} 
                      className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-600/35 transition"
                    >
                      {alias}
                      <button 
                        onClick={() => handleRemoveAlias(idx)}
                        className="text-indigo-400 hover:text-white font-bold text-xs"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  placeholder="추가할 엑셀 상품명 직접 입력..."
                  value={newAliasInput}
                  onChange={(e) => setNewAliasInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAlias(newAliasInput);
                    }
                  }}
                  className="bg-[#1e2942] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={() => handleAddAlias(newAliasInput)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                >
                  추가
                </button>
              </div>
            </div>
          </div>

          {/* Right side: Click-to-add from uploaded Excel names */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-title">엑셀 데이터 내 상품명 목록</div>
              <p className="text-xs opacity-60 mb-3">최근 업로드된 엑셀 파일 내의 상품 목록입니다. 클릭 시 매칭어로 즉시 등록됩니다.</p>
              
              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {uploadedProductNames.length === 0 ? (
                  <div className="text-xs opacity-40 w-full text-center py-8">업로드된 엑셀 상품 데이터가 없습니다. 먼저 엑셀을 올려주세요.</div>
                ) : (
                  uploadedProductNames.map((name, idx) => {
                    const status = getUploadNameStatus(name);
                    const isAlreadyMappedToThis = status.matchedToSelf;
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (isAlreadyMappedToThis) return;
                          handleAddAlias(name);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                          isAlreadyMappedToThis 
                            ? 'bg-indigo-500/10 border-indigo-500/20 opacity-50 cursor-not-allowed'
                            : 'bg-[#1e2942]/40 border-white/5 hover:bg-[#1e2942]/80 hover:border-indigo-500/40 cursor-pointer'
                        }`}
                      >
                        <span className="font-bold text-[#f8fafc] truncate" style={{ maxWidth: '200px' }}>{name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition"
          >
            취소
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-2.5 rounded-xl transition"
          >
            {isSaving ? "저장 중..." : "💾 매핑 저장"}
          </button>
        </div>
      </div>
    </div>
  );
};
