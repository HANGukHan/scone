'use client';

import React, { useState, useEffect } from 'react';
import { supabase, hasValidSupabaseConfig } from '../lib/supabase';
import { Product, OrderWithProduct, CalculatedResult } from '../lib/types';
import { runProductionCalculations } from '../lib/calculations';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [calculated, setCalculated] = useState<CalculatedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 1. Fetch products & orders on mount / date change
  useEffect(() => {
    if (!hasValidSupabaseConfig) {
      setLoading(false);
      return;
    }

    async function initData() {
      setLoading(true);
      try {
        // Fetch all products
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select('*');

        if (prodErr) throw prodErr;
        setProducts(prodData || []);

        // Fetch orders for active date
        const { data: ordData, error: ordErr } = await supabase
          .from('production_orders')
          .select('*')
          .eq('order_date', orderDate);

        if (ordErr) throw ordErr;
        setOrders(ordData || []);
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [orderDate]);

  // 2. Perform live calculations on state change
  useEffect(() => {
    if (products.length > 0) {
      const results = runProductionCalculations(products, orders);
      setCalculated(results);
    } else {
      setCalculated(null);
    }
  }, [products, orders]);

  // 3. Handle live manual extra pan adjustment
  async function handleAdjustPans(productId: string, val: number) {
    if (!hasValidSupabaseConfig) return;

    // Find or create order row
    const existingIndex = orders.findIndex(o => o.product_id === productId);
    let updatedOrders = [...orders];

    if (existingIndex !== -1) {
      const updated = { ...orders[existingIndex], extra_pan_qty: val };
      updatedOrders[existingIndex] = updated;
      
      // Update in Supabase
      if (updated.id) {
        await supabase
          .from('production_orders')
          .update({ extra_pan_qty: val })
          .eq('id', updated.id);
      }
    } else {
      // Create new order with 0 base qty and manual adjustment
      const newOrder: OrderWithProduct = {
        order_date: orderDate,
        product_id: productId,
        order_qty: 0,
        extra_pan_qty: val
      };
      
      const { data, error } = await supabase
        .from('production_orders')
        .insert([newOrder])
        .select();

      if (!error && data && data.length > 0) {
        updatedOrders.push(data[0]);
      }
    }

    setOrders(updatedOrders);
  }

  // 4. Sample Loader
  async function loadSampleData() {
    if (!hasValidSupabaseConfig) return;
    setLoading(true);
    try {
      // Clean current date orders
      await supabase
        .from('production_orders')
        .delete()
        .eq('order_date', orderDate);

      // Insert fresh sample orders mapping product name to IDs
      const sampleMocks = [
        { name: '말차초코칩스콘', opt: null, qty: 252 },
        { name: '츄러스콘', opt: null, qty: 250 },
        { name: '츄러스콘', opt: '[미니큐브]', qty: 4 },
        { name: '츄러스콘', opt: '[스틱스콘]', qty: 8 },
        { name: '데이츠치아씨드스콘', opt: null, qty: 106 },
        { name: '바닐라피칸스콘', opt: null, qty: 358 },
        { name: '버터밀크비스킷스콘', opt: null, qty: 155 },
        { name: '데솔오트밀바', opt: null, qty: 293 },
        { name: '카카오스콘', opt: null, qty: 193 },
        { name: 'OXO스콘', opt: null, qty: 393 },
        { name: '순수오트스콘', opt: null, qty: 87 },
        { name: '귀리초코칩스콘', opt: null, qty: 219 },
        { name: '서비스스콘', opt: null, qty: 110 }
      ];

      const ordersToInsert: OrderWithProduct[] = [];

      sampleMocks.forEach(mock => {
        const prod = products.find(p => p.product_name === mock.name && p.option_name === mock.opt);
        if (prod) {
          ordersToInsert.push({
            order_date: orderDate,
            product_id: prod.id,
            order_qty: mock.qty,
            extra_pan_qty: 0
          });
        }
      });

      const { data, error } = await supabase
        .from('production_orders')
        .insert(ordersToInsert)
        .select();

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error inserting samples:', err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle color theme
  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  // Fallback View if Supabase is unconfigured (Build Safety Active)
  if (!hasValidSupabaseConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-[#f8fafc] p-6">
        <div className="max-w-md w-full bg-[#151d30] border border-amber-500/30 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400 text-3xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold mb-3">Supabase 설정이 필요합니다</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Vercel 배포 대시보드 또는 로컬 <code>.env.local</code> 파일에 Supabase 환경변수를 입력하셔야 실시간 데이터베이스 연동 및 대시보드 기능을 활성화할 수 있습니다.
          </p>
          <div className="bg-[#1e2942] rounded-xl p-4 text-xs text-left mb-6 font-mono text-indigo-300 border border-white/5 space-y-1">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://...</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</div>
          </div>
          <p className="text-xs text-slate-500 italic">※ 빌드 시점 튕김 방지 Fallback 모드가 작동 중입니다.</p>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">
        <p className="text-lg font-medium animate-pulse">Supabase 데이터 베이스 연결 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 font-sans ${theme === 'dark' ? 'bg-[#0b0f19] text-[#f8fafc]' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className={`flex justify-between items-center p-4 border rounded-2xl ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow-md`}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Next.js 생산량 관리 포털</h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Supabase PostgreSQL &amp; Vercel 배포 최적화 아키텍처</p>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="date" 
              value={orderDate} 
              onChange={(e) => setOrderDate(e.target.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${theme === 'dark' ? 'bg-[#1e2942] border-white/10' : 'bg-slate-50 border-slate-200'}`}
            />
            <button 
              onClick={toggleTheme}
              className={`px-4 py-2 text-xs rounded-full border ${theme === 'dark' ? 'bg-[#1e2942] border-white/10' : 'bg-slate-100 border-slate-200'}`}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button onClick={loadSampleData} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow">
              샘플 로드 (Supabase 연동)
            </button>
          </div>
        </header>

        {/* Warning Alert banner */}
        {calculated && calculated.serviceShortage > 0 && (
          <div className="flex justify-between items-center p-4 bg-rose-500/10 border border-rose-500 rounded-xl animate-bounce">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-sm font-bold">서비스 스콘 생산량 부족</h4>
                <p className="text-xs opacity-80">주문량 대비 여분 스콘이 {calculated.serviceShortage}개 부족합니다. 삼각스콘의 수동조정 값을 올려주세요.</p>
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        {calculated && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-xs opacity-60 block">총 생산 판수</span>
              <strong className="text-2xl font-bold">{calculated.totalPans} 판</strong>
            </div>
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-xs opacity-60 block">생크림 총 소요량</span>
              <strong className="text-2xl font-bold text-indigo-500">{calculated.totalCream.toFixed(1)} L</strong>
            </div>
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-xs opacity-60 block">서비스 주문 / 여분스콘</span>
              <strong className="text-2xl font-bold">{calculated.serviceOrdered} / {calculated.extraScones} 개</strong>
            </div>
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-xs opacity-60 block">부족 서비스 수량</span>
              <strong className={`text-2xl font-bold ${calculated.serviceShortage > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {calculated.serviceShortage > 0 ? `${calculated.serviceShortage} 개 부족` : '여유 (0)'}
              </strong>
            </div>
          </div>
        )}

        {/* Table 1: Main Production */}
        <section className={`p-6 border rounded-2xl ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow`}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📊 생산량표 대시보드 (주요 계산 영역)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-[#1e2942]' : 'bg-slate-100'} border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <th className="p-3 text-left">품명</th>
                  <th>형태</th>
                  <th>오븐 번호</th>
                  <th>총 판수</th>
                  <th>주문량</th>
                  <th className="bg-indigo-500/10">추가 판수 (수동조정)</th>
                  <th>최종판</th>
                  <th>최종남음 (개)</th>
                </tr>
              </thead>
              <tbody>
                {calculated?.rows.map((row, idx) => (
                  <tr key={idx} className={`border-b ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="p-3 text-left font-medium">{row.product.product_name} {row.product.option_name}</td>
                    <td className="text-xs opacity-75">{row.product.shape_type}</td>
                    <td>
                      {row.product.oven_number ? (
                        <span className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">오븐 {row.product.oven_number}</span>
                      ) : '-'}
                    </td>
                    <td className="font-bold text-indigo-500">{row.pans}</td>
                    <td>{row.orderedQty || ''}</td>
                    <td className="bg-indigo-500/5">
                      {row.product.shape_type === '삼각스콘' ? (
                        <input
                          type="number"
                          value={row.extraPans}
                          onChange={(e) => handleAdjustPans(row.product.id, parseFloat(e.target.value) || 0)}
                          className={`w-16 text-center py-1 rounded border ${theme === 'dark' ? 'bg-[#1e2942] border-white/10' : 'bg-slate-50 border-slate-200'}`}
                          step="0.5"
                        />
                      ) : '-'}
                    </td>
                    <td className="font-bold">{row.pans}</td>
                    <td className={row.remaining > 0 ? 'text-amber-500' : ''}>{row.remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: Oven batches */}
        <section className={`p-6 border rounded-2xl ${theme === 'dark' ? 'bg-[#151d30] border-white/10' : 'bg-white border-slate-200'} shadow`}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">⚠️ 오븐 배치 현황 (3판 풀팬 묶음 계산)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-[#1e2942]' : 'bg-slate-100'} border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <th className="p-3 text-left">상품명</th>
                  <th>오븐 번호</th>
                  <th>삼각 판수 (A)</th>
                  <th>풀팬 (A ÷ 3)</th>
                  <th className="bg-emerald-500/10">풀팬 (3판 단위 묶음)</th>
                  <th>남는 반죽 판수</th>
                </tr>
              </thead>
              <tbody>
                {calculated?.ovenBatches.map((batch, idx) => (
                  <tr key={idx} className={`border-b ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="p-3 text-left font-medium">{batch.productName}</td>
                    <td><span className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">오븐 {batch.ovenNumber}</span></td>
                    <td className="font-bold">{batch.pansA}</td>
                    <td>{Math.floor(batch.pansA / 3)}</td>
                    <td className="font-bold text-emerald-500 bg-emerald-500/5">{batch.fullPans3}</td>
                    <td className="text-amber-500 font-bold">{batch.remainingPans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
