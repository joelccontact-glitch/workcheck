'use client';

import React from 'react';
import AttendanceCard from '@/components/AttendanceCard';
import HistoryLog from '@/components/HistoryLog';
import TeamList from '@/components/TeamList';
import LeaveRequests from '@/components/LeaveRequests';
import Sidebar from '@/components/Sidebar';
import RoleSwitcher from '@/components/RoleSwitcher';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

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
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{user.team} / {user.rank}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                {user.name.substring(0, 1)}
              </div>
            </div>
          </div>
        </header>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {isAdmin ? '팀 관리 센터' : `안녕하세요, ${user.name}님! 👋`}
              </h1>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                {isAdmin ? '팀원들의 근무 현황과 요청을 관리합니다.' : '오늘의 근무를 시작해 보세요.'}
              </p>
            </div>
            <RoleSwitcher />
          </div>

          <div className="grid-cols-dashboard">
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isAdmin ? <TeamList /> : <AttendanceCard />}
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isAdmin ? <LeaveRequests /> : <HistoryLog />}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
