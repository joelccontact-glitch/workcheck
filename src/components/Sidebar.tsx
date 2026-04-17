'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Settings, MapPin, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isUser = role === 'USER';

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="show-on-mobile flex-center"
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 30,
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: 'white',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow)',
          cursor: 'pointer'
        }}
      >
        <MenuIcon size={20} />
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="show-on-mobile"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 20,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className="glass" 
        style={{ 
          width: '260px', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 25,
          position: 'fixed',
          height: '100vh',
          borderRight: '1px solid hsl(var(--border))',
          left: 0,
          top: 0,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : (typeof window !== 'undefined' && window.innerWidth < 1024 ? 'translateX(-100%)' : 'translateX(0)')
        }}
        // Adding className for CSS targeting if needed, but using inline styles for logic
        id="sidebar"
      >
        <script dangerouslySetInnerHTML={{ __html: `
          const checkWidth = () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth >= 1024) {
              sidebar.style.transform = 'translateX(0)';
            } else if (!${isOpen}) {
              sidebar.style.transform = 'translateX(-100%)';
            }
          };
          window.addEventListener('resize', checkWidth);
          checkWidth();
        `}} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
          <button className="show-on-mobile" onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))' }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label={isUser ? "내 대시보드" : "팀 대시보드"} 
              active={pathname === '/'} 
            />
          </Link>
          
          {!isUser && (
            <Link href="/team" onClick={() => setIsOpen(false)}>
              <NavItem icon={<Users size={18} />} label="팀원 관리" active={pathname === '/team'} />
            </Link>
          )}

          <Link href="/leave" onClick={() => setIsOpen(false)}>
            <NavItem icon={<Calendar size={18} />} label={isUser ? "연차 신청" : "결재 관리"} active={pathname === '/leave'} />
          </Link>

          {!isUser && (
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <NavItem icon={<MapPin size={18} />} label="근무지 설정" active={pathname === '/admin'} />
            </Link>
          )}

          <Link href="/settings" onClick={() => setIsOpen(false)}>
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
      
      {/* Inline styles for media query fallbacks since complex transform logic is hard in inline-only */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          #sidebar {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
        }
        @media (min-width: 1024px) {
          #sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
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
