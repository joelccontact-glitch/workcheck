'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, Role } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  ShieldAlert, 
  FileCheck2, 
  Award, 
  BookOpen, 
  Sliders, 
  Menu, 
  X,
  Building2,
  AlertTriangle,
  Compass,
  Crown,
  Briefcase,
  ShieldCheck,
  Settings,
  Users
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  step?: string;
  badge?: string;
  alertBadge?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { role, setRole, user } = useAuth();

  const currentRole: Role = role === 'USER' ? 'PM' : role;

  // 1. 임원 (보고 받는 자) 전용 메뉴
  const executiveNavSections: NavSection[] = [
    {
      title: '👑 경영진 통합 모니터링 & 결재',
      items: [
        { href: '/', label: '포트폴리오 대시보드', icon: LayoutDashboard, badge: '보고용' },
        { href: '/issues', label: 'Red/Yellow 리스크 보고', icon: ShieldAlert, alertBadge: true },
        { href: '/gate-checks', label: 'Gate Review (G1~G6) 결재', icon: Sliders, badge: '승인대기' }
      ]
    },
    {
      title: '📁 전사 사업 자산 & 품질',
      items: [
        { href: '/deliverables', label: '16종 PM Standard 승인 현황', icon: FileCheck2 },
        { href: '/lessons-learned', label: '전사 Lessons Learned DB', icon: BookOpen }
      ]
    }
  ];

  // 2. 프로젝트 담당자 (PM / 작업자) 전용 메뉴 (Step 01~07)
  const pmNavSections: NavSection[] = [
    {
      title: '🎯 내 프로젝트 바로가기',
      items: [
        { href: '/projects', label: '내 프로젝트 목록 및 수정', icon: FolderKanban }
      ]
    },
    {
      title: '1단계: 기반 등록 (최초 생성)',
      items: [
        { href: '/academy', label: 'STEP 01. PM 역량 & 프로필', icon: Award, step: '01' },
        { href: '/projects', label: 'STEP 02. 프로젝트 착수 등록', icon: FolderKanban, step: '02' }
      ]
    },
    {
      title: '2단계: 주간 점검 & 관문 자가진단',
      items: [
        { href: '/weekly-check', label: 'STEP 03. 주간 점검 & Health Score', icon: CheckSquare, step: '03' },
        { href: '/gate-checks', label: 'STEP 04. Gate Check 자가점검', icon: Sliders, step: '04' },
        { href: '/deliverables', label: 'STEP 05. 16종 PM Standard 작성', icon: FileCheck2, step: '05' },
        { href: '/issues', label: 'STEP 06. Risk / Issue 등록', icon: ShieldAlert, step: '06', alertBadge: true }
      ]
    },
    {
      title: '3단계: 회고 & 교훈 저장',
      items: [
        { href: '/lessons-learned', label: 'STEP 07. Lessons Learned DB 등록', icon: BookOpen, step: '07' }
      ]
    }
  ];

  // 3. 사이트 관리자 (운영자) 전용 메뉴
  const adminNavSections: NavSection[] = [
    {
      title: '⚙️ 시스템 운영 & 계정 관리',
      items: [
        { href: '/', label: '시스템 종합 운영 대시보드', icon: LayoutDashboard },
        { href: '/admin', label: '사용자 계정 & 권한 설정', icon: Users, badge: '관리자' }
      ]
    },
    {
      title: '📐 PMO 표준 및 템플릿 마스터',
      items: [
        { href: '/settings', label: 'PMO 템플릿 & 기준 설정', icon: Settings },
        { href: '/academy', label: 'PM 아카데미 교육 과정 관리', icon: Award }
      ]
    }
  ];

  // Current active menu based on selected role
  const activeNavSections = 
    currentRole === 'EXECUTIVE' ? executiveNavSections :
    currentRole === 'ADMIN' ? adminNavSections : 
    pmNavSections;

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="메뉴 열기"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 text-slate-200 z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Logo & Title */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100 bg-clip-text text-transparent">
              다음정보시스템즈
            </div>
            <div className="text-[11px] font-semibold text-blue-400 tracking-wide uppercase">
              PMO 포털 시스템
            </div>
          </div>
        </div>

        {/* Role Switcher Buttons */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>사용자 뷰 (역할) 선택</span>
            <span className="text-[10px] text-blue-400 font-medium">실시간 전환</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]">
            <button
              onClick={() => setRole('EXECUTIVE')}
              className={`py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-1 ${
                currentRole === 'EXECUTIVE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 border border-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="보고받는 자 (임원/경영진) 뷰"
            >
              <Crown size={14} className={currentRole === 'EXECUTIVE' ? 'text-amber-300' : ''} />
              <span>임원 뷰</span>
            </button>

            <button
              onClick={() => setRole('PM')}
              className={`py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-1 ${
                currentRole === 'PM'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="프로젝트 등록/관리 (PM) 뷰"
            >
              <Briefcase size={14} className={currentRole === 'PM' ? 'text-indigo-200' : ''} />
              <span>PM 뷰</span>
            </button>

            <button
              onClick={() => setRole('ADMIN')}
              className={`py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-1 ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 border border-purple-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="사이트 관리자 (운영/권한) 뷰"
            >
              <ShieldCheck size={14} className={currentRole === 'ADMIN' ? 'text-purple-200' : ''} />
              <span>관리자</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mode Guide Banner */}
        <div className="px-3 py-2 mx-3 my-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] leading-snug text-slate-300 flex items-center gap-2">
          <Compass size={15} className="text-blue-400 shrink-0" />
          <span>
            {currentRole === 'EXECUTIVE' && (
              <span><strong className="text-amber-400">임원 모드:</strong> 포트폴리오 가시화 및 결재</span>
            )}
            {currentRole === 'PM' && (
              <span><strong className="text-indigo-400">PM 모드:</strong> Step 01~07 순서로 데이터 입력</span>
            )}
            {currentRole === 'ADMIN' && (
              <span><strong className="text-purple-400">관리자 모드:</strong> 계정, 권한, PMO 마스터 관리</span>
            )}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {activeNavSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-md shadow-blue-950/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={17} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'} />
                    <span className="truncate">{item.label}</span>

                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                        {item.badge}
                      </span>
                    )}

                    {item.alertBadge && (
                      <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-950 text-rose-400 border border-rose-800/60 animate-pulse">
                        <AlertTriangle size={9} /> Red 1건
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Role Badge & User Profile Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-blue-300 font-black text-xs">
                {user?.name ? user.name.substring(0, 1) : 'U'}
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-xs truncate">{user?.name || '김철수'} {user?.rank || '전무'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.team || '경영전략실'}</div>
              </div>
            </div>
            <Link
              href="/login"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-semibold border border-slate-700 transition-colors"
              title="다른 계정으로 로그인/전환"
            >
              로그아웃
            </Link>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
            <span className="text-slate-500">활성 권한:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold border ${
              currentRole === 'EXECUTIVE' ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' :
              currentRole === 'ADMIN' ? 'bg-purple-950/80 text-purple-300 border-purple-800/60' :
              'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
            }`}>
              {currentRole === 'EXECUTIVE' ? '👑 임원(보고용)' :
               currentRole === 'ADMIN' ? '⚙️ 사이트 관리자' :
               '🎯 프로젝트 PM'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
