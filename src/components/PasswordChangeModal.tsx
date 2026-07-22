import React from 'react';

interface PasswordChangeModalProps {
  show: boolean;
  onClose: () => void;
  currentPasswordInput: string;
  setCurrentPasswordInput: (val: string) => void;
  newPasswordInput: string;
  setNewPasswordInput: (val: string) => void;
  confirmPasswordInput: string;
  setConfirmPasswordInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  show,
  onClose,
  currentPasswordInput,
  setCurrentPasswordInput,
  newPasswordInput,
  setNewPasswordInput,
  confirmPasswordInput,
  setConfirmPasswordInput,
  onSubmit
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10001
    }}>
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer'
          }}
          className="opacity-70 hover:opacity-100 transition"
        >
          ✕
        </button>
        <div className="text-lg font-bold text-center mb-4">🔑 관리자 비밀번호 변경</div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs opacity-75 block mb-1">현재 비밀번호</label>
            <input 
              type="password" 
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              placeholder="현재 비밀번호 입력"
              required
            />
          </div>
          <div>
            <label className="text-xs opacity-75 block mb-1">새 비밀번호</label>
            <input 
              type="password" 
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              placeholder="새 비밀번호 입력"
              required
            />
          </div>
          <div>
            <label className="text-xs opacity-75 block mb-1">새 비밀번호 확인</label>
            <input 
              type="password" 
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2 text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              placeholder="새 비밀번호 확인"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition w-full">
            비밀번호 변경 적용
          </button>
        </form>
      </div>
    </div>
  );
};
