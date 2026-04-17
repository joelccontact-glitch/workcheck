'use client';

import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const isUser = role === 'USER';

  return (
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
        <Link href="/">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label={isUser ? "내 대시보드" : "팀 대시보드"} 
            active={pathname === '/'} 
          />
        </Link>
        
        {!isUser && (
          <Link href="/team">
            <NavItem icon={<Users size={18} />} label="팀원 관리" active={pathname === '/team'} />
          </Link>
        )}

        <Link href="/leave">
          <NavItem icon={<Calendar size={18} />} label={isUser ? "연차 신청" : "결재 관리"} active={pathname === '/leave'} />
        </Link>

        {!isUser && (
          <Link href="/admin">
            <NavItem icon={<MapPin size={18} />} label="근무지 설정" active={pathname === '/admin'} />
          </Link>
        )}

        <Link href="/settings">
          <NavItem icon={<Settings size={18} />} label="환경 설정" active={pathname === '/settings'} />
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'hsl(var(--primary) / 0.05)', color: 'hsl(var(--primary))', fontSize: '0.75rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{role} MODE</div>
        <div style={{ opacity: 0.8 }}>
          {isUser ? '개인 활동만 조회 가능합니다.' : '관리자 권한이 활성화됨'}
        </div>
      </div>
    </aside>
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
