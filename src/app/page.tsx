'use client';

import React, { useEffect } from 'react';
import { useSconeDashboard } from '../hooks/useSconeDashboard';
import { PasswordVerifyModal } from '../components/PasswordVerifyModal';
import { PasswordChangeModal } from '../components/PasswordChangeModal';
import { SconeMasterModal } from '../components/SconeMasterModal';
import { ProductionTable } from '../components/ProductionTable';
import { OvenBatchTable } from '../components/OvenBatchTable';
import { FooterMetrics } from '../components/FooterMetrics';
import { NewProductRegisterModal } from '../components/NewProductRegisterModal';
import { ProductMappingModal } from '../components/ProductMappingModal';

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
    handleLoadProductToForm,
    mappingSelections,
    showRegisterNewModal,
    setShowRegisterNewModal,
    handleSelectMappingTarget,
    handleConfirmMapping,
    handleOpenRegisterNewModal,
    uploadedProductNames,
    showMappingModal,
    setShowMappingModal,
    mappingProduct,
    handleOpenMappingModal,
    newSconeSortOrder,
    setNewSconeSortOrder,
    newSconeOvenBatchSize,
    setNewSconeOvenBatchSize,
    editingFormProductId,
    setEditingFormProductId,
    editingSortProdId,
    setEditingSortProdId,
    editingSortVal,
    setEditingSortVal,
    handleSaveInlineSortOrder,
    handleSaveCurrentBackup,
    backupTime,
    handleHideProductName,
    handleSaveCurrentOrder
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
      <header className="page-1 page-2 no-print">
        <div className="brand">
          <h1>스콘 생산량 관리 시스템</h1>
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
            style={{ 
              background: '#4f46e5', 
              color: '#ffffff', 
              fontWeight: 'bold', 
              border: '2px solid #818cf8',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
            }}
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
        <div className="alert-banner page-1 no-print" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--warning-color)', padding: '16px' }}>
          <div className="alert-content" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span className="alert-icon" style={{ color: 'var(--warning-color)', fontSize: '20px', marginTop: '2px' }}>⚠️</span>
            <div className="alert-text" style={{ flex: 1 }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '15px' }}>등록되지 않은 스콘이 감지되었습니다</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0', fontSize: '13px' }}>
                이지어드민 정산 데이터 내 미등록 품목을 발견했습니다. 아래 목록에서 매칭할 기존 DB 상품을 선택하거나, 신규 상품으로 등록하세요.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {unregisteredScones.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '10px' }}>
                    <span className="font-bold text-amber-500" style={{ fontSize: '13px', minWidth: '220px' }}>{s}</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <select 
                        value={mappingSelections[s] || ""}
                        onChange={(e) => handleSelectMappingTarget(s, e.target.value)}
                        className="bg-[#1e2942] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#f8fafc] focus:outline-none focus:border-indigo-500"
                        style={{ minWidth: '240px' }}
                      >
                        <option value="">-- 매칭할 DB 마스터 상품 선택 --</option>
                        {(() => {
                          const sortedProducts = [...products].sort((a, b) => {
                            const nameA = a.product_name.localeCompare(b.product_name, 'ko');
                            if (nameA !== 0) return nameA;
                            return (a.option_name || '').localeCompare(b.option_name || '', 'ko');
                          });
                          return sortedProducts.map(p => {
                            const label = `${p.product_name}${p.option_name ? ' ' + p.option_name : ''} (${p.shape_type})`;
                            return <option key={p.id} value={p.id}>{label}</option>;
                          });
                        })()}
                      </select>

                      <button 
                        onClick={() => handleConfirmMapping(s)}
                        disabled={!mappingSelections[s]}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        🔗 매칭 확정
                      </button>

                      <button 
                        onClick={() => handleOpenRegisterNewModal(s)}
                        className="bg-[#1e1b4b] hover:bg-[#312e81] text-[#ffffff] font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer border border-[#4338ca]"
                      >
                        ➕ 신규 상품으로 등록
                      </button>
                    </div>
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
            el.style.borderColor = "var(--accent-color)";
            el.style.background = "rgba(99, 102, 241, 0.1)";
          }}
          onDragLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(99, 102, 241, 0.4)";
            el.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(99, 102, 241, 0.4)";
            el.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)";
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleExcelFile(e.dataTransfer.files[0]);
            }
          }}
          className="upload-zone hover:scale-[1.01] transition-all duration-300"
          style={{
            border: '2px dashed var(--accent-color)',
            borderRadius: '10px',
            padding: '12px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '25%',
            minWidth: '240px',
            maxWidth: '320px',
          }}
        >
          <span className="drop-icon" style={{ fontSize: '20px', margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>📁</span>
          <p style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-primary)', margin: 0, padding: 0 }}>
            [ 이지어드민 미출고 요약표 업로드 ] 클릭하거나 여기에 파일을 드래그하세요 (xls, xlsx)
          </p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleExcelFile(e.target.files[0])} 
          style={{ display: 'none' }} 
          accept=".xls,.xlsx" 
        />
        
        <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '12px', flexWrap: 'wrap' }}>
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
        {totals.shortage > 0 && (
          <div className="alert-banner no-print" style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#fca5a5',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>🚨</span>
            <span>서비스스콘이 부족합니다! (부족 수량: {totals.shortage}개)</span>
          </div>
        )}
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>📝 생산량표</span>
          <button 
            onClick={handleSaveCurrentOrder} 
            className="btn btn-secondary no-print font-bold" 
            style={{ 
              padding: '4px 10px', 
              fontSize: '11.5px', 
              height: '26px', 
              background: 'rgba(99, 102, 241, 0.2)', 
              border: '1px solid var(--accent-color)', 
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            💾 현 순서 저장
          </button>
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
          handleHideProductName={handleHideProductName}
          totals={totals}
          addSpacer={addSpacer}
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
        handleSaveCurrentBackup={handleSaveCurrentBackup}
        handleClearAllDBData={handleClearAllDBData}
        handleSaveInlineAliases={handleSaveInlineAliases}
        handleSaveInlineOven={handleSaveInlineOven}
        handleSaveInlineSortOrder={handleSaveInlineSortOrder}
        backupTime={backupTime}
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
        editingSortProdId={editingSortProdId}
        setEditingSortProdId={setEditingSortProdId}
        editingSortVal={editingSortVal}
        setEditingSortVal={setEditingSortVal}
        setShowPasswordChangeModal={setShowPasswordChangeModal}
        handleLoadProductToForm={handleLoadProductToForm}
        handleOpenRegisterNewModal={handleOpenRegisterNewModal}
        handleOpenMappingModal={handleOpenMappingModal}
      />

      {/* New Product Register Modal */}
      <NewProductRegisterModal 
        show={showRegisterNewModal}
        onClose={() => setShowRegisterNewModal(false)}
        onSubmit={handleCreateScone}
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
        newSconeSortOrder={newSconeSortOrder}
        setNewSconeSortOrder={setNewSconeSortOrder}
        newSconeOvenBatchSize={newSconeOvenBatchSize}
        setNewSconeOvenBatchSize={setNewSconeOvenBatchSize}
        isEditing={editingFormProductId !== null}
      />

      {/* Product Mapping Modal */}
      <ProductMappingModal 
        show={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        product={mappingProduct}
        uploadedProductNames={uploadedProductNames}
        unregisteredScones={unregisteredScones}
        products={products}
        onSave={handleSaveInlineAliases}
      />

    </div>
  );
}
