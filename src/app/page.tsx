'use client';

import React, { useEffect } from 'react';
import { useSconeDashboard } from '../hooks/useSconeDashboard';
import { PasswordVerifyModal } from '../components/PasswordVerifyModal';
import { PasswordChangeModal } from '../components/PasswordChangeModal';
import { SconeMasterModal } from '../components/SconeMasterModal';
import { ProductionTable } from '../components/ProductionTable';
import { OvenBatchTable } from '../components/OvenBatchTable';
import { FooterMetrics } from '../components/FooterMetrics';

export default function Home() {
  const {
    theme,
    setTheme,
    products,
    carryOverTri,
    manualAdjustTri,
    carryOverCube,
    productSequence,
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
    showPasswordModal,
    setShowPasswordModal,
    showMasterModal,
    setShowMasterModal,
    showPasswordChangeModal,
    setShowPasswordChangeModal,
    passwordInput,
    setPasswordInput,
    currentPasswordInput,
    setCurrentPasswordInput,
    newPasswordInput,
    setNewPasswordInput,
    confirmPasswordInput,
    setConfirmPasswordInput,
    unregisteredScones,
    computedData,
    totals,
    subMaterials,
    fileInputRef,
    handleExcelFile,
    loadData,
    handleInputVal,
    updateSpacerName,
    deleteSpacer,
    addSpacer,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleCreateScone,
    handleDeleteScone,
    handleClearAllDBData,
    handleRestoreFromBackup,
    handleSaveInlineAliases,
    handleSaveInlineOven,
    handleRegisterInstantly,
    handlePasswordVerify,
    handleChangePassword,
    getOrderQtyByMatch,
    handleLoadProductToForm
  } = useSconeDashboard();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Page specific print controller
  function printPage(mode: 'all' | 'page1' | 'page2') {
    if (mode === 'all') {
      document.body.removeAttribute("data-print-mode");
    } else {
      document.body.setAttribute("data-print-mode", mode);
    }
    window.print();
    setTimeout(() => {
      document.body.removeAttribute("data-print-mode");
    }, 1000);
  }

  return (
    <div className="dashboard-container">
      
      {/* Top Header Card */}
      <header className="page-1 page-2">
        <div className="brand">
          <h1>스콘 생산량 관리 시스템 (Next.js &amp; Supabase DB)</h1>
          <p>Supabase 마스터 연동 및 실시간 오븐 배정 포털</p>
        </div>
        <div className="btn-group no-print" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              const expiry = localStorage.getItem('masterAuthExpiry');
              const isAuthValid = expiry ? Date.now() < parseInt(expiry, 10) : false;
              if (isAuthValid) {
                setShowMasterModal(true);
              } else {
                setShowPasswordModal(true);
              }
            }}
            className="theme-toggle-btn"
            style={{ background: 'var(--accent-color)', color: '#fff', fontWeight: 'bold' }}
          >
            🛠️ 스콘 마스터 관리
          </button>
          <button 
            id="themeToggle" 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
            className="theme-toggle-btn"
          >
            {theme === 'light' ? '🌙 Dark Theme' : '☀️ Light Theme'}
          </button>
        </div>
      </header>

      {/* Unregistered warning Banner */}
      {unregisteredScones.length > 0 && (
        <div className="alert-banner page-1 no-print" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--warning-color)' }}>
          <div className="alert-content">
            <span className="alert-icon" style={{ color: 'var(--warning-color)' }}>⚠️</span>
            <div className="alert-text">
              <h4 style={{ color: 'var(--text-primary)' }}>등록되지 않은 스콘이 감지되었습니다</h4>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-2">다음 스콘의 오븐번호 및 수율 설정이 존재하지 않습니다. 즉시 등록 단추를 눌러 마스터 목록에 추가해 주세요.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {unregisteredScones.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#1e2942] border border-white/5 px-3 py-1 rounded-lg text-xs">
                    <span className="font-bold text-amber-500">{s}</span>
                    <button 
                      onClick={() => handleRegisterInstantly(s)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-0.5 rounded text-[10px] transition cursor-pointer"
                    >
                      즉시 등록
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Drag-Drop Upload UI Panel */}
      <div className="io-panel no-print page-1">
        <div 
          id="dropZone" 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-focus)";
            el.style.background = "var(--accent-glow)";
          }}
          onDragLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-color)";
            el.style.background = "rgba(255, 255, 255, 0.01)";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-color)";
            el.style.background = "rgba(255, 255, 255, 0.01)";
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleExcelFile(e.dataTransfer.files[0]);
            }
          }}
          className="drop-zone"
        >
          <span className="drop-icon">📥</span>
          <p>이지어드민 엑셀 정산 파일을 여기에 드래그하거나 클릭하여 로드</p>
          <span className="drop-hint">(xls, xlsx 포맷 지원)</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleExcelFile(e.target.files[0])} 
          style={{ display: 'none' }} 
          accept=".xls,.xlsx" 
        />
        
        <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '12px' }}>
          <button onClick={addSpacer} className="btn btn-secondary font-bold" style={{ flex: 1 }}>
            ➕ 구분선/공백 추가
          </button>
          <button onClick={() => printPage('page1')} className="btn btn-primary font-bold">
            🖨️ 1페이지 인쇄
          </button>
          <button onClick={() => printPage('page2')} className="btn btn-primary font-bold">
            🖨️ 2페이지 인쇄
          </button>
          <button onClick={() => printPage('all')} className="btn btn-primary font-bold">
            🖨️ 전체 인쇄
          </button>
        </div>
      </div>

      {/* Page 1: Main Scone Dashboard Production Grid Table */}
      <div className="page-1" style={{ marginTop: '24px' }}>
        <div className="section-title">
          <span>📝 1페이지 : 대표 품목별 당일 생산량 집계표</span>
          <span id="printDate1" className="print-only" style={{ fontSize: '11px', fontWeight: 'normal', marginLeft: 'auto' }} />
        </div>

        <ProductionTable 
          productSequence={productSequence}
          computedData={computedData}
          products={products}
          carryOverTri={carryOverTri}
          carryOverCube={carryOverCube}
          manualAdjustTri={manualAdjustTri}
          handleInputVal={handleInputVal}
          updateSpacerName={updateSpacerName}
          deleteSpacer={deleteSpacer}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          totals={totals}
        />

        {/* Footer Material Metrics & Service shortages */}
        <FooterMetrics 
          subMaterials={subMaterials}
          totals={totals}
          products={products}
          getOrderQtyByMatch={getOrderQtyByMatch}
        />
      </div>

      {/* Page 2: Oven Batch Dashboard Grid Table */}
      <OvenBatchTable 
        productSequence={productSequence}
        computedData={computedData}
        products={products}
      />

      {/* Password entry modal overlay */}
      <PasswordVerifyModal 
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        onSubmit={handlePasswordVerify}
      />

      {/* Admin Password Change Modal overlay */}
      <PasswordChangeModal 
        show={showPasswordChangeModal}
        onClose={() => {
          setShowPasswordChangeModal(false);
          setCurrentPasswordInput('');
          setNewPasswordInput('');
          setConfirmPasswordInput('');
        }}
        currentPasswordInput={currentPasswordInput}
        setCurrentPasswordInput={setCurrentPasswordInput}
        newPasswordInput={newPasswordInput}
        setNewPasswordInput={setNewPasswordInput}
        confirmPasswordInput={confirmPasswordInput}
        setConfirmPasswordInput={setConfirmPasswordInput}
        onSubmit={handleChangePassword}
      />

      {/* Scone Master CRUD Management Modal */}
      <SconeMasterModal 
        show={showMasterModal}
        onClose={() => setShowMasterModal(false)}
        products={products}
        handleCreateScone={handleCreateScone}
        handleDeleteScone={handleDeleteScone}
        handleRestoreFromBackup={handleRestoreFromBackup}
        handleClearAllDBData={handleClearAllDBData}
        handleSaveInlineAliases={handleSaveInlineAliases}
        handleSaveInlineOven={handleSaveInlineOven}
        newSconeName={newSconeName}
        setNewSconeName={setNewSconeName}
        newSconeOption={newSconeOption}
        setNewSconeOption={setNewSconeOption}
        newSconeShape={newSconeShape}
        setNewSconeShape={setNewSconeShape}
        newSconeOven={newSconeOven}
        setNewSconeOven={setNewSconeOven}
        newSconeYield={newSconeYield}
        setNewSconeYield={setNewSconeYield}
        newSconeCream={newSconeCream}
        setNewSconeCream={setNewSconeCream}
        newSconeAliases={newSconeAliases}
        setNewSconeAliases={setNewSconeAliases}
        newSconeProductType={newSconeProductType}
        setNewSconeProductType={setNewSconeProductType}
        newSconeCompositionType={newSconeCompositionType}
        setNewSconeCompositionType={setNewSconeCompositionType}
        newSconePackageComponents={newSconePackageComponents}
        setNewSconePackageComponents={setNewSconePackageComponents}
        editingProdId={editingProdId}
        setEditingProdId={setEditingProdId}
        editingAliasesVal={editingAliasesVal}
        setEditingAliasesVal={setEditingAliasesVal}
        editingOvenProdId={editingOvenProdId}
        setEditingOvenProdId={setEditingOvenProdId}
        editingOvenVal={editingOvenVal}
        setEditingOvenVal={setEditingOvenVal}
        setShowPasswordChangeModal={setShowPasswordChangeModal}
        handleLoadProductToForm={handleLoadProductToForm}
      />

    </div>
  );
}
