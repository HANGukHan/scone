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
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
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
          <span>{isEditing ? '🛠️ 마스터 상품 수정' : '➕ 신규 상품 등록 (Supabase DB)'}</span>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs opacity-75 block mb-1">스콘명 (필수)</label>
            <input 
              type="text" 
              value={newSconeName}
              onChange={(e) => setNewSconeName(e.target.value)}
              placeholder="예: 말차초코칩스콘"
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs opacity-75 block mb-1">옵션명 (선택)</label>
            <input 
              type="text" 
              value={newSconeOption}
              onChange={(e) => setNewSconeOption(e.target.value)}
              placeholder="예: [미니큐브], [스틱스콘] 또는 없음"
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-75 block mb-1">품목 분류</label>
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
                    setNewSconeCream(170);
                  }
                }}
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              >
                <option value="scone">스콘 생산품</option>
                <option value="material">부자재/포장재</option>
              </select>
            </div>
            <div>
              <label className="text-xs opacity-75 block mb-1">구성 형태</label>
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
                    setNewSconeCream(170);
                  }
                }}
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                disabled={newSconeProductType === 'material'}
              >
                <option value="general">일반 스콘</option>
                <option value="package">패키지/세트 상품</option>
              </select>
            </div>
          </div>

          {newSconeProductType === 'scone' && newSconeCompositionType === 'package' && (
            <div>
              <label className="text-xs opacity-75 block mb-1">패키지 구성 (품명:수량, 쉼표 구분)</label>
              <input 
                type="text" 
                value={newSconePackageComponents}
                onChange={(e) => setNewSconePackageComponents(e.target.value)}
                placeholder="예: 말차초코칩스콘:1, 츄러스콘:2"
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {newSconeCompositionType === 'general' && newSconeProductType === 'scone' && (
            <div>
              <label className="text-xs opacity-75 block mb-1">형태 지정</label>
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
                    setNewSconeCream(170);
                  }
                }}
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              >
                <option value="삼각스콘">삼각스콘</option>
                <option value="미니큐브">미니큐브</option>
                <option value="스틱스콘">스틱스콘</option>
                <option value="기타">기타</option>
              </select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-75 block mb-1">오븐 번호</label>
              <input 
                type="number" 
                value={newSconeOven}
                onChange={(e) => setNewSconeOven(e.target.value)}
                placeholder="예: 4"
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs opacity-75 block mb-1">1판 생산량</label>
              <input 
                type="number" 
                value={newSconeYield}
                onChange={(e) => setNewSconeYield(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs opacity-75 block mb-1">1판당 생크림 소요량 (ml)</label>
            <input 
              type="number" 
              value={newSconeCream}
              onChange={(e) => setNewSconeCream(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs opacity-75 block mb-1">엑셀 매칭 상품명/키워드 (쉼표 구분)</label>
            <input 
              type="text" 
              value={newSconeAliases}
              onChange={(e) => setNewSconeAliases(e.target.value)}
              placeholder="예: -----[하프팩]통밀츄러미니큐브, 츄러스콘[미니큐브]"
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-75 block mb-1">표시 순서 (낮을수록 먼저)</label>
              <input 
                type="number" 
                value={newSconeSortOrder}
                onChange={(e) => setNewSconeSortOrder(parseInt(e.target.value, 10) || 0)}
                placeholder="예: 10"
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs opacity-75 block mb-1">오븐 생산 단위 (기본값: 3)</label>
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
                className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2 font-bold py-2.5">
            {isEditing ? '💾 수정 내용 저장 및 반영' : '💾 신규 상품으로 등록 및 저장'}
          </button>
        </form>
      </div>
    </div>
  );
};
