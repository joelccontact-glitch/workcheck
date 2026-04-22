'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, Calendar, Send, PieChart, Bell, User, LayoutDashboard, Users, MapPin, BarChart3, Settings, LogOut, ChevronRight, Megaphone, LogIn, Menu } from 'lucide-react';
import AttendanceCard from '@/components/AttendanceCard';
import HistoryLog from '@/components/HistoryLog';
import TeamList from '@/components/TeamList';
import LeaveRequests from '@/components/LeaveRequests';
import AdminDashboardStats from '@/components/AdminDashboardStats';
import RoleSwitcher from '@/components/RoleSwitcher';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import RequestCenter from '@/components/RequestCenter';
import OvertimeSummary from '@/components/OvertimeSummary';
import MyPage from '@/components/MyPage';
import AdminWorkplace from '@/components/AdminWorkplace';

export default function App() {
  const { user, role, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

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
        <div style={{ width: 80, height: 80, borderRadius: '20px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '2.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>W</div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>로그인이 필요합니다</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>서비스 이용을 위해 로그인을 진행해주세요.</p>
        </div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-primary" style={{ padding: '0 2.5rem', height: '3.5rem', fontSize: '1rem', gap: '0.75rem', borderRadius: '16px' }}>
          <LogIn size={20} /> 로그인 페이지로 이동
        </button>
      </div>
    );
  }

  const isAdmin = role === 'ADMIN';

  const menus = isAdmin ? [
    { id: 'home', icon: <LayoutDashboard size={20} />, label: '대시보드' },
    { id: 'team', icon: <Users size={20} />, label: '팀원 관리' },
    { id: 'approvals', icon: <Send size={20} />, label: '결재 관리' },
    { id: 'workplace', icon: <MapPin size={20} />, label: '근무지 설정' },
    { id: 'reports', icon: <BarChart3 size={20} />, label: '보고서' },
    { id: 'settings', icon: <Settings size={20} />, label: '설정' },
  ] : [
    { id: 'home', icon: <Home size={20} />, label: '홈' },
    { id: 'history', icon: <Calendar size={20} />, label: '이력' },
    { id: 'request', icon: <Send size={20} />, label: '신청' },
    { id: 'overtime', icon: <PieChart size={20} />, label: '초과' },
    { id: 'notice', icon: <Bell size={20} />, label: '알림' },
    { id: 'mypage', icon: <User size={20} />, label: '마이' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--muted)/0.3)', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Header */}
      <header style={{ 
        height: '72px', backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsl(var(--border))', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.125rem' }}>W</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em', color: 'hsl(var(--primary))' }} className="md-block">WorkCheck</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RoleSwitcher />
          <button 
            onClick={signOut}
            className="btn btn-ghost" 
            style={{ padding: '0.5rem', color: 'hsl(var(--destructive))' }}
          >
            <LogOut size={20} />
          </button>
          <div 
            onClick={() => setActiveTab('mypage')}
            style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)' }}
          >
            {user.name[0]}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Desktop Sidebar Navigation */}
        <nav style={{ width: '280px', padding: '2rem 1.5rem', display: 'none', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: '72px', height: 'calc(100vh - 72px)' }} className="md-flex">
          <div style={{ marginBottom: '1.5rem', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</div>
          {menus.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem', borderRadius: '16px', border: 'none',
                background: activeTab === item.id ? 'hsl(var(--primary))' : 'transparent',
                color: activeTab === item.id ? 'white' : 'hsl(var(--muted-foreground))',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === item.id ? '0 10px 15px -3px rgba(var(--primary-rgb), 0.3)' : 'none'
              }}
            >
              {item.icon} {item.label}
              {activeTab === item.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0, padding: '1.5rem 1rem 8rem' }} className="md-padding-large">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {activeTab === 'home' && (
              <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={{ 
                  padding: '1.25rem 1.5rem', borderRadius: '20px', 
                  backgroundColor: 'white', border: '1px solid hsl(var(--border))',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}>
                  <div className="flex-center" style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
                    <Bell size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>[공지] 이번 주 금요일 집중 근무일 안내</div>
                  </div>
                  <ChevronRight size={18} color="hsl(var(--muted-foreground))" />
                </section>

                <section style={{ marginBottom: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }} className="md-text-3xl">
                    {isAdmin ? '관리 센터' : `반가워요, ${user.name}님! 👋`}
                  </h1>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem' }}>
                    {isAdmin ? '팀원들의 활동 현황을 실시간으로 확인하세요.' : '오늘도 멋진 하루 되시길 바랍니다.'}
                  </p>
                </section>
                
                {isAdmin && <AdminDashboardStats />}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                   {!isAdmin && <AttendanceCard />}
                   {!isAdmin ? <HistoryLog /> : <TeamList />}
                </div>
              </div>
            )}

            {activeTab === 'history' && !isAdmin && <AttendanceCalendar />}
            {activeTab === 'request' && !isAdmin && <RequestCenter />}
            {activeTab === 'overtime' && !isAdmin && <OvertimeSummary />}
            {activeTab === 'mypage' && <MyPage />}
            {activeTab === 'approvals' && isAdmin && <LeaveRequests />}
            {activeTab === 'team' && isAdmin && <TeamList />}
            {activeTab === 'workplace' && isAdmin && <AdminWorkplace />}
            
            {(activeTab === 'notice' || (isAdmin && ['reports', 'settings'].includes(activeTab))) && (
              <div className="flex-center card" style={{ height: '400px', textAlign: 'center', color: 'hsl(var(--muted-foreground))', borderRadius: '24px' }}>
                <div>
                   <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'hsl(var(--muted))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {menus.find(m => m.id === activeTab)?.icon}
                   </div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>서비스 준비 중</h3>
                   <p style={{ fontSize: '0.875rem' }}>보다 나은 서비스를 위해 준비하고 있습니다.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Mobile Bottom Navigation */}
      <nav style={{ 
        position: 'fixed', bottom: '1.5rem', left: '1rem', right: '1rem', height: '76px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 0.75rem', zIndex: 100,
        boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.2)'
      }} className="md-hidden">
        {menus.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            border: 'none', background: 'none', padding: '12px 8px', borderRadius: '16px',
            color: activeTab === item.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            backgroundColor: activeTab === item.id ? 'hsl(var(--primary)/0.08)' : 'transparent',
            cursor: 'pointer', transition: 'all 0.2s ease', flex: 1
          }}>
            {React.cloneElement(item.icon as any, { size: activeTab === item.id ? 24 : 22, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
            <span style={{ fontSize: '0.65rem', fontWeight: activeTab === item.id ? 800 : 500 }}>{item.label}</span>
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
          .md-padding-large { padding: 3rem 2.5rem !important; }
          .md-text-3xl { font-size: 2.25rem !important; }
        }
        .animate-in {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
