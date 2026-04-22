'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import LeaveRequests from '@/components/LeaveRequests';
import LeaveRequestModal from '@/components/LeaveRequestModal';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Plus } from 'lucide-react';

export default function LeavePage() {
  const { user, role, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> 연차 신청하기
              </button>
            )}
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr' : '1fr 350px', gap: '2rem' }}>
            <div style={{ display: 'grid', gap: '2rem' }}>
              <LeaveRequests />
            </div>

            {!isAdmin && (
              <div className="card">
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'hsl(var(--muted-foreground))' }}>
                  <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                  <h3 style={{ color: 'hsl(var(--foreground))', marginBottom: '0.5rem' }}>내 연차 현황</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{user?.total_leave || 15}</div>
                       <div style={{ fontSize: '0.65rem' }}>총 연차</div>
                     </div>
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--success))' }}>{user?.used_leave || 0}</div>
                       <div style={{ fontSize: '0.65rem' }}>사용</div>
                     </div>
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{(user?.total_leave || 15) - (user?.used_leave || 0)}</div>
                       <div style={{ fontSize: '0.65rem' }}>잔여</div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <LeaveRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // You could add a toast here or refresh the list
          window.dispatchEvent(new Event('leave-updated'));
        }}
      />
    </div>
  );
}
