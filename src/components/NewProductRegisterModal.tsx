import React from 'react';

interface NewProductRegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
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
  newSconeSortOrder: number;
  setNewSconeSortOrder: (val: number) => void;
  newSconeOvenBatchSize: number;
  setNewSconeOvenBatchSize: (val: number) => void;
  isEditing: boolean;
}

export const NewProductRegisterModal: React.FC<NewProductRegisterModalProps> = ({
  show,
  onClose,
  onSubmit,
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
  isEditing
}) => {
  if (!show) return null;

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
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '512px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: '#f8fafc',
        boxSizing: 'border-box'
      }}>
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
        <div className="section-title mb-6" style={{ marginBottom: '24px' }}>
          <span>{isEditing ? '🛠️ 마스터 상품 수정' : '➕ 신규 상품 등록 (Supabase DB)'}</span>
        </div>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>스콘명 (필수)</label>
            <input 
              type="text" 
              value={newSconeName}
              onChange={(e) => setNewSconeName(e.target.value)}
              placeholder="예: 말차초코칩스콘"
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#f8fafc',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>옵션명 (선택)</label>
            <input 
              type="text" 
              value={newSconeOption}
              onChange={(e) => setNewSconeOption(e.target.value)}
              placeholder="예: [미니큐브], [스틱스콘] 또는 없음"
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#f8fafc',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>품목 분류</label>
              <select 
                value={newSconeProductType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setNewSconeProductType(val);
                  if (val === 'material') {
                    setNewSconeCompositionType('general');
                    setNewSconeShape('기타');
                    setNewSconeYield(1);
                    setNewSconeCream(0);
                    setNewSconeOven('');
                  } else {
                    setNewSconeShape('삼각스콘');
                    setNewSconeYield(8);
                    setNewSconeCream(0);
                  }
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="scone">스콘</option>
                <option value="material">스콘외 상품</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>구성 형태</label>
              <select 
                value={newSconeCompositionType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setNewSconeCompositionType(val);
                  if (val === 'package') {
                    setNewSconeShape('기타');
                    setNewSconeYield(1);
                    setNewSconeCream(0);
                    setNewSconeOven('');
                  } else {
                    setNewSconeShape('삼각스콘');
                    setNewSconeYield(8);
                    setNewSconeCream(0);
                  }
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                disabled={newSconeProductType === 'material'}
              >
                <option value="general">단일 상품</option>
                <option value="package">패키지/세트 상품</option>
              </select>
            </div>
          </div>

          {newSconeProductType === 'scone' && newSconeCompositionType === 'package' && (
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>패키지 구성 (품명:수량, 쉼표 구분)</label>
              <input 
                type="text" 
                value={newSconePackageComponents}
                onChange={(e) => setNewSconePackageComponents(e.target.value)}
                placeholder="예: 말차초코칩스콘:1, 츄러스콘:2"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {newSconeCompositionType === 'general' && newSconeProductType === 'scone' && (
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>형태</label>
              <select 
                value={newSconeShape}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setNewSconeShape(val);
                  if (val === '미니큐브') {
                    setNewSconeYield(2);
                    setNewSconeCream(0);
                  } else if (val === '스틱스콘') {
                    setNewSconeYield(9);
                    setNewSconeCream(0);
                  } else if (val === '삼각스콘') {
                    setNewSconeYield(8);
                    setNewSconeCream(0);
                  }
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="삼각스콘">삼각스콘</option>
                <option value="미니큐브">미니큐브</option>
                <option value="스틱스콘">스틱스콘</option>
                <option value="기타">기타</option>
              </select>
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>
                {newSconeShape === '삼각스콘' ? '삼각 오븐 번호' : (newSconeShape === '미니큐브' || newSconeShape === '스틱스콘' ? '큐브/스틱 오븐 번호' : '오븐 번호')}
              </label>
              <input 
                type="number" 
                value={newSconeOven}
                onChange={(e) => setNewSconeOven(e.target.value)}
                placeholder="예: 4"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>1판 생산량</label>
              <input 
                type="number" 
                value={newSconeYield}
                onChange={(e) => setNewSconeYield(parseInt(e.target.value, 10) || 0)}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>1판당 생크림 소요량 (ml)</label>
            <input 
              type="number" 
              value={newSconeCream}
              onChange={(e) => setNewSconeCream(parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#f8fafc',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>엑셀 매칭 상품명/키워드 (쉼표 구분)</label>
            <input 
              type="text" 
              value={newSconeAliases}
              onChange={(e) => setNewSconeAliases(e.target.value)}
              placeholder="예: -----[하프팩]통밀츄러미니큐브, 츄러스콘[미니큐브]"
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#f8fafc',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>표시 순서 (낮을수록 먼저)</label>
              <input 
                type="number" 
                value={newSconeSortOrder}
                onChange={(e) => setNewSconeSortOrder(parseInt(e.target.value, 10) || 0)}
                placeholder="예: 10"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginBottom: '4px' }}>오븐 생산 단위 (기본값: 3)</label>
              <input 
                type="number" 
                step="0.5"
                value={newSconeOvenBatchSize}
                onChange={(e) => {
                  const rawVal = parseFloat(e.target.value) || 3.0;
                  const rounded = Math.round(rawVal * 2) / 2;
                  setNewSconeOvenBatchSize(rounded);
                }}
                placeholder="예: 3 또는 2.5"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary font-bold" style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
            {isEditing ? '💾 수정 내용 저장 및 반영' : '💾 신규 상품으로 등록 및 저장'}
          </button>
        </form>
      </div>
    </div>
  );
};
