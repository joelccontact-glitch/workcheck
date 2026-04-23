'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, Calendar, Send, PieChart, Bell, User, LayoutDashboard, Users, MapPin, BarChart3, Settings, LogOut, ChevronRight, Megaphone, LogIn, ShieldCheck } from 'lucide-react';
import AttendanceCard from '@/components/AttendanceCard';
import HistoryLog from '@/components/HistoryLog';
import TeamList from '@/components/TeamList';
import LeaveRequests from '@/components/LeaveRequests';
import AdminDashboardStats from '@/components/AdminDashboardStats';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import RequestCenter from '@/components/RequestCenter';
import OvertimeSummary from '@/components/OvertimeSummary';
import MyPage from '@/components/MyPage';
import AdminWorkplace from '@/components/AdminWorkplace';
import WorkZoneManager from '@/components/WorkZoneManager';

export default function App() {
  const { user, role, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // 권한에 따른 초기 탭 설정
    if (role === 'ADMIN') {
      setActiveTab('home');
    } else {
      setActiveTab('home');
    }
  }, [role]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100%', backgroundColor: 'hsl(var(--background))' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid hsl(var(--primary))', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '20px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '2.5rem' }}>W</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-primary" style={{ height: '3.5rem', padding: '0 2rem', borderRadius: '16px' }}>
          <LogIn size={20} /> 로그인 페이지로 이동
        </button>
      </div>
    );
  }

  const isAdmin = role === 'ADMIN';

  // 1. 근무지 설정 메뉴 재배치 및 권한별 메뉴 정의
  const menus = isAdmin ? [
    { id: 'home', icon: <LayoutDashboard size={20} />, label: '관리 대시보드' },
    { id: 'team', icon: <Users size={20} />, label: '전체 직원 현황' },
    { id: 'approvals', icon: <Send size={20} />, label: '결재 승인' },
    { id: 'workplace_admin', icon: <MapPin size={20} />, label: '근무지 통합 관리' }, // 관리자용 관리 기능
    { id: 'reports', icon: <BarChart3 size={20} />, label: '통계 리포트' },
  ] : [
    { id: 'home', icon: <Home size={20} />, label: '나의 홈' },
    { id: 'history', icon: <Calendar size={20} />, label: '근태 이력' },
    { id: 'request', icon: <Send size={20} />, label: '휴가/연장 신청' },
    { id: 'workplace_user', icon: <MapPin size={20} />, label: '나의 근무지 설정' }, // 사용자용 설정 기능
    { id: 'mypage', icon: <User size={20} />, label: '마이페이지' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--muted)/0.3)', display: 'flex', flexDirection: 'column' }}>
      {/* Header (RoleSwitcher 제거됨) */}
      <header style={{ 
        height: '72px', backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsl(var(--border))', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>W</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'hsl(var(--primary))' }} className="md-block">WorkCheck</span>
          {isAdmin && <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> ADMIN</span>}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }} className="md-block">
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>{user.rank} / {user.team}</div>
          </div>
          <div style={{ height: '32px', width: '1px', backgroundColor: 'hsl(var(--border))' }} />
          {/* 로그아웃 기능 강화 */}
          <button 
            onClick={() => {
              if (confirm('로그아웃 하시겠습니까?')) signOut();
            }}
            className="btn btn-ghost" 
            style={{ padding: '0.6rem', color: 'hsl(var(--muted-foreground))' }}
            title="로그아웃"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        <nav style={{ width: '260px', padding: '2rem 1.25rem', display: 'none', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: '72px', height: 'calc(100vh - 72px)' }} className="md-flex">
          {menus.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.875rem 1.125rem', borderRadius: '14px', border: 'none',
                background: activeTab === item.id ? 'hsl(var(--primary))' : 'transparent',
                color: activeTab === item.id ? 'white' : 'hsl(var(--muted-foreground))',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease'
              }}
            >
              {item.icon} {item.label}
              {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, minWidth: 0, padding: '1.5rem 1rem 8rem' }} className="md-padding-large">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {activeTab === 'home' && (
              <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={{ marginBottom: '0.5rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                    {isAdmin ? '관리자 대시보드' : '나의 업무 현황'}
                  </h1>
                  <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {isAdmin ? '전체 직원의 근태 현황을 한눈에 관리합니다.' : `오늘도 활기찬 하루 되세요, ${user.name}님!`}
                  </p>
                </section>
                
                {isAdmin && <AdminDashboardStats />}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                   {!isAdmin && <AttendanceCard />}
                   {!isAdmin ? <HistoryLog /> : <TeamList />}
                </div>
              </div>
            )}

            {activeTab === 'history' && !isAdmin && <AttendanceCalendar />}
            {activeTab === 'request' && !isAdmin && <RequestCenter />}
            {activeTab === 'workplace_user' && !isAdmin && <AdminWorkplace />} {/* 사용자용 근무지 설정 (임시연결) */}
            {activeTab === 'mypage' && !isAdmin && <MyPage />}
            
            {activeTab === 'approvals' && isAdmin && <LeaveRequests />}
            {activeTab === 'team' && isAdmin && <TeamList />}
            {activeTab === 'workplace_admin' && isAdmin && (
              <div className="card animate-in shadow-xl" style={{ padding: '2rem', borderRadius: '28px', border: 'none', background: 'white' }}>
                <WorkZoneManager />
              </div>
            )}
            
            {activeTab === 'reports' && isAdmin && (
              <div className="flex-center card" style={{ height: '300px' }}>통계 리포트 기능 준비 중</div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav style={{ 
        position: 'fixed', bottom: '1rem', left: '1rem', right: '1rem', height: '68px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)',
        borderRadius: '20px', border: '1px solid hsl(var(--border))',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)'
      }} className="md-hidden">
        {menus.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            border: 'none', background: 'none', color: activeTab === item.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            cursor: 'pointer', flex: 1
          }}>
            {React.cloneElement(item.icon as any, { size: 20 })}
            <span style={{ fontSize: '0.6rem', fontWeight: activeTab === item.id ? 700 : 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        .md-flex { display: none; }
        .md-block { display: none; }
        @media (min-width: 1024px) {
          .md-flex { display: flex; }
          .md-block { display: block; }
          .md-hidden { display: none; }
          .md-padding-large { padding: 3rem 2rem !important; }
        }
      `}</style>
    </div>
  );
}
