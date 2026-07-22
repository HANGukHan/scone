import React from 'react';

interface PasswordVerifyModalProps {
  show: boolean;
  onClose: () => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordVerifyModal: React.FC<PasswordVerifyModalProps> = ({
  show,
  onClose,
  passwordInput,
  setPasswordInput,
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
      zIndex: 10000
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
        <div className="text-lg font-bold text-center mb-4">🔐 관리자 비밀번호 인증</div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#1e2942] border border-white/10 rounded-lg p-2.5 text-center text-sm text-[#f8fafc] focus:outline-none focus:border-indigo-500"
              placeholder="비밀번호 입력 (기본: 1234)"
              autoFocus
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition w-full">
            인증 완료
          </button>
        </form>
      </div>
    </div>
  );
};
