'use client';

import React from 'react';
import AttendanceCard from '@/components/AttendanceCard';
import HistoryLog from '@/components/HistoryLog';
import { LayoutDashboard, Users, Calendar, Settings, Bell, Search } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="glass" style={{ 
        width: '260px', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 10,
        position: 'fixed',
        height: '100vh',
        borderRight: '1px solid hsl(var(--border))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            backgroundColor: 'hsl(var(--primary))',
            backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>W</div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>WorkCheck</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavItem icon={<LayoutDashboard size={18} />} label="대시보드" active />
          <NavItem icon={<Users size={18} />} label="팀원 관리" />
          <NavItem icon={<Calendar size={18} />} label="연차/근태" />
          <NavItem icon={<Settings size={18} />} label="설정" />
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'hsl(var(--primary) / 0.05)', color: 'hsl(var(--primary))', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Premium Plan</div>
          <div style={{ opacity: 0.8 }}>내부 프로젝트 관리용 라이선스 활성화됨</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem' 
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
            <input 
              type="text" 
              placeholder="검색..." 
              style={{ 
                width: '100%', 
                padding: '0.625rem 1rem 0.625rem 2.75rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                outline: 'none',
                fontSize: '0.875rem'
              }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="flex-center" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid hsl(var(--border))', backgroundColor: 'transparent', color: 'hsl(var(--muted-foreground))', transition: 'all 0.2s' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid hsl(var(--border))' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>홍길동</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>개발팀 / 과장</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                HK
              </div>
            </div>
          </div>
        </header>

        <section>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>안녕하세요, 길동님! 👋</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>오늘의 근무를 시작해 보세요.</p>
          </div>

          <div className="grid-cols-dashboard">
            <AttendanceCard />
            <HistoryLog />
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem 1rem', 
      borderRadius: 'var(--radius)', 
      backgroundColor: active ? 'hsl(var(--primary) / 0.1)' : 'transparent',
      color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
      fontWeight: active ? 600 : 500,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}>
      {icon}
      {label}
    </div>
  );
}
