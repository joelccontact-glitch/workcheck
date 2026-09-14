'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChevronRight,
  Compass
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

  // Grouped Navigation Items with Clear Step Guides
  const navSections: NavSection[] = [
    {
      title: '경영진 모니터링',
      items: [
        { href: '/', label: '포트폴리오 대시보드', icon: LayoutDashboard, badge: '통합가시성' }
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
      title: '2단계: 주간 점검 & 관문 심사',
      items: [
        { href: '/weekly-check', label: 'STEP 03. 주간 점검 & Health', icon: CheckSquare, step: '03' },
        { href: '/gate-checks', label: 'STEP 04. Gate Check (G1~G6)', icon: Sliders, step: '04' },
        { href: '/deliverables', label: 'STEP 05. 16종 PM Standard', icon: FileCheck2, step: '05' },
        { href: '/issues', label: 'STEP 06. Risk / Issue 등록', icon: ShieldAlert, step: '06', alertBadge: true }
      ]
    },
    {
      title: '3단계: 지식 축적 & 회고',
      items: [
        { href: '/lessons-learned', label: 'STEP 07. Lessons Learned DB', icon: BookOpen, step: '07' }
      ]
    }
  ];

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
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100 bg-clip-text text-transparent">
              다음정보시스템즈
            </div>
            <div className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
              PMO 운영체계 포털
            </div>
          </div>
        </div>

        {/* Guided Workflow Banner */}
        <div className="px-4 py-2.5 mx-3 my-2.5 rounded-xl bg-blue-950/50 border border-blue-800/40 text-blue-300/90 text-xs leading-relaxed flex items-center gap-2">
          <Compass size={16} className="text-blue-400 shrink-0" />
          <span>관리자 가이드: <strong className="text-blue-400">Step 01 ➔ 07 순서</strong>로 등록 진행</span>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
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

        {/* Footer PMO Contact & Mode */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">PMO 운영센터</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
              단계별 가이드 적용
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            PMO 책임자: 김지훈 (pmo@daumis.co.kr)
          </p>
        </div>
      </aside>
    </>
  );
}
