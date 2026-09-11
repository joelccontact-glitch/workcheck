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
  AlertTriangle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: '포트폴리오 대시보드', icon: LayoutDashboard, badge: '경영진' },
    { href: '/projects', label: '프로젝트 통합 현황', icon: FolderKanban },
    { href: '/weekly-check', label: '주간 점검 & Health Score', icon: CheckSquare },
    { href: '/gate-checks', label: 'Gate Check 관문 심사', icon: Sliders },
    { href: '/issues', label: 'Risk / Issue / Escalation', icon: ShieldAlert, alertBadge: true },
    { href: '/deliverables', label: '16종 PM Standard 산출물', icon: FileCheck2 },
    { href: '/academy', label: 'PM Academy & 역량 평가', icon: Award },
    { href: '/lessons-learned', label: 'Lessons Learned & DB', icon: BookOpen },
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
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
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

        {/* Core Subtitle Banner */}
        <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-blue-950/50 border border-blue-800/40 text-blue-300/90 text-xs leading-relaxed">
          <span className="font-bold text-blue-400">조직 표준 기반</span>의 프로젝트 경영체계 전환
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={19} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'} />
                <span className="truncate">{item.label}</span>

                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {item.badge}
                  </span>
                )}

                {item.alertBadge && (
                  <span className="ml-auto flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-950 text-rose-400 border border-rose-800/60 animate-pulse">
                    <AlertTriangle size={10} /> Red 1건
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer PMO Contact & Mode */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-300">PMO 운영센터</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
              운영 표준 가동 중
            </span>
          </div>
          <p className="text-slate-400 leading-tight">
            PMO 책임자: 김지훈 (pmo@daumis.co.kr)
          </p>
        </div>
      </aside>
    </>
  );
}
