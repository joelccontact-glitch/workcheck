'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Tablet, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>환경 설정</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>개인 프로필 및 앱 알림 설정을 관리합니다.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ width: 64, height: 64, borderRadius: '20px', backgroundColor: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                   {user.name.substring(0, 1)}
                 </div>
                 <div>
                   <h3 style={{ fontSize: '1.25rem' }}>{user.name}</h3>
                   <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>{user.team} / {user.rank}</p>
                 </div>
                 <button className="btn btn-outline" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>프로필 수정</button>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <SettingItem icon={<Bell size={18} />} title="푸시 알림" description="출퇴근 시간 및 결재 승인 알림을 받습니다." toggle />
                <SettingItem icon={<Tablet size={18} />} title="기기 생체 설정" description="로그인 및 출퇴근 시 생체인증을 사용합니다." toggle />
                <SettingItem icon={<Moon size={18} />} title="다크 모드" description="시스템 다크 모드 설정을 따릅니다." toggle />
              </div>
            </div>

            <div className="card" style={{ border: '1px solid hsl(var(--destructive) / 0.2)' }}>
              <h3 style={{ fontSize: '1rem', color: 'hsl(var(--destructive))', marginBottom: '1rem' }}>계정 관리</h3>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>계정 탈퇴 시 모든 근무 기록이 삭제되며 복구할 수 없습니다.</p>
              <button className="btn btn-outline" style={{ color: 'hsl(var(--destructive))', borderColor: 'hsl(var(--destructive) / 0.3)' }}>로그아웃</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingItem({ icon, title, description, toggle = false }: { icon: React.ReactNode, title: string, description: string, toggle?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'hsl(var(--muted) / 0.2)' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ color: 'hsl(var(--muted-foreground))' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{description}</div>
        </div>
      </div>
      {toggle && (
        <div style={{ 
          width: '36px', 
          height: '20px', 
          borderRadius: '10px', 
          backgroundColor: 'hsl(var(--primary))',
          position: 'relative'
        }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px' }} />
        </div>
      )}
    </div>
  );
}
