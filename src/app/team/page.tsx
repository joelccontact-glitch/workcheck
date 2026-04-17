'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TeamList from '@/components/TeamList';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const { role } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (role === 'USER') {
      alert('관리자 권한이 필요합니다.');
      router.push('/');
    }
  }, [role, router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '1rem' }}>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>팀원 관리</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>소속 팀원들의 상세 근무 현황을 확인합니다.</p>
          </header>
          <TeamList />
        </div>
      </main>
    </div>
  );
}
