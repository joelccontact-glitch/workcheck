'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import LeaveRequests from '@/components/LeaveRequests';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Plus } from 'lucide-react';

export default function LeavePage() {
  const { role, loading } = useAuth();
  const isAdmin = role === 'ADMIN';

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100%' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid hsl(var(--primary))', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '1rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isAdmin ? '결재 관리' : '연차 신청'}</h1>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                {isAdmin ? '팀원들이 신청한 연차 및 휴가를 검토합니다.' : '휴가 신청 현황 및 잔여 연차를 확인합니다.'}
              </p>
            </div>
            {!isAdmin && (
              <button className="btn btn-primary">
                <Plus size={18} /> 연차 신청하기
              </button>
            )}
          </header>

          {isAdmin ? (
            <LeaveRequests />
          ) : (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'hsl(var(--muted-foreground))' }}>
                <Calendar size={64} style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                <h3 style={{ color: 'hsl(var(--foreground))', marginBottom: '0.5rem' }}>내 연차 현황</h3>
                <p style={{ fontSize: '0.875rem' }}>현재 남은 연차: 12.5일</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>15</div>
                     <div style={{ fontSize: '0.75rem' }}>총 연차</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--success))' }}>2.5</div>
                     <div style={{ fontSize: '0.75rem' }}>사용</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>12.5</div>
                     <div style={{ fontSize: '0.75rem' }}>잔여</div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
