'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  INITIAL_PROJECTS, 
  INITIAL_ISSUES, 
  PM_STANDARD_16_ITEMS, 
  Project 
} from '@/utils/pmoData';
import { getFirebaseProjects, getFirebaseIssues } from '@/services/firestoreService';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight, 
  ShieldAlert, 
  Layers, 
  DollarSign, 
  ArrowUpRight,
  Sparkles,
  Users,
  Search,
  Filter,
  Activity,
  FolderKanban
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, Role } from '@/context/AuthContext';
import { Crown, Briefcase, ShieldCheck, Settings } from 'lucide-react';

export default function PortfolioDashboard() {
  const { role, setRole } = useAuth();
  const currentRole: Role = role === 'USER' ? 'PM' : role;

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [issues, setIssues] = useState(INITIAL_ISSUES);

  useEffect(() => {
    getFirebaseProjects().then(data => {
      setProjects(data || []);
    });
    getFirebaseIssues().then(data => {
      setIssues(data || []);
    });
  }, []);

  // Financial & Stats calculations
  const totalAmount = projects.reduce((acc, p) => acc + p.contractAmount, 0);
  const totalProfit = projects.reduce((acc, p) => acc + p.expectedProfit, 0);
  const redProjectsCount = projects.filter(p => p.healthStatus === 'Red').length;
  const yellowProjectsCount = projects.filter(p => p.healthStatus === 'Yellow').length;
  const greenProjectsCount = projects.filter(p => p.healthStatus === 'Green').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              {currentRole === 'EXECUTIVE' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                  <Crown size={13} /> 👑 경영진 뷰
                </span>
              )}
              {currentRole === 'PM' && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                  <Briefcase size={13} /> 🎯 프로젝트 PM 뷰
                </span>
              )}
              {currentRole === 'ADMIN' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                  <ShieldCheck size={13} /> ⚙️ 사이트 관리자 뷰
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {currentRole === 'EXECUTIVE' && 'PMO 포트폴리오 종합 보고 대시보드'}
              {currentRole === 'PM' && 'PM 프로젝트 관리 & Step 01~07 작업 현황'}
              {currentRole === 'ADMIN' && 'PMO 포털 시스템 관리자 운영 콘솔'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentRole === 'EXECUTIVE' && '전사 프로젝트 위험·수익성·품질 가시화 및 6대 관문 결재 종합 대시보드'}
              {currentRole === 'PM' && '프로젝트 착수부터 주간 점검, Gate Check, 16종 산출물 등록까지 일괄 CRUD 프로세스'}
              {currentRole === 'ADMIN' && '사용자 계정 권한 부여, PMO 16종 템플릿 마스터, 교육 체계 및 시스템 운영 통제'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentRole === 'EXECUTIVE' && (
              <>
                <Link
                  href="/gate-checks"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/30 flex items-center gap-2"
                >
                  <Layers size={16} /> Gate Review 결재 ({redProjectsCount}건 확인)
                </Link>
                <Link
                  href="/issues"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <ShieldAlert size={16} /> Red 이슈 현황
                </Link>
              </>
            )}

            {currentRole === 'PM' && (
              <>
                <Link
                  href="/weekly-check"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Activity size={16} /> 금주 점검표 작성 (Step 03)
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <FolderKanban size={16} /> 신규 프로젝트 등록 (Step 02)
                </Link>
              </>
            )}

            {currentRole === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  <Users size={16} /> 계정 & 권한 설정
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Settings size={16} /> PMO 마스터 템플릿
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Role-Specific Core Proposition & Quick Workflow Banner */}
        {currentRole === 'PM' && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-800/40 shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-xs font-bold tracking-wide">
                프로젝트 담당자(PM) 데이터 구축 가이드 (Step 01 ➔ Step 07)
              </span>
              <span className="text-xs text-indigo-300 font-semibold">순차적 CRUD 작업 가이드</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
              <Link href="/academy" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 01</div>
                <div className="font-bold text-white text-xs truncate">PM 역량/프로필</div>
              </Link>
              <Link href="/projects" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 02</div>
                <div className="font-bold text-white text-xs truncate">프로젝트 착수</div>
              </Link>
              <Link href="/weekly-check" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 03</div>
                <div className="font-bold text-white text-xs truncate">주간점검 & Health</div>
              </Link>
              <Link href="/gate-checks" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 04</div>
                <div className="font-bold text-white text-xs truncate">Gate Review</div>
              </Link>
              <Link href="/deliverables" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 05</div>
                <div className="font-bold text-white text-xs truncate">16종 PM 표준</div>
              </Link>
              <Link href="/issues" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 06</div>
                <div className="font-bold text-white text-xs truncate">Risk/Issue 등록</div>
              </Link>
              <Link href="/lessons-learned" className="p-3 rounded-xl bg-slate-900/80 border border-indigo-800/40 hover:border-indigo-500 transition-all space-y-1 block">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 07</div>
                <div className="font-bold text-white text-xs truncate">Lessons Learned</div>
              </Link>
            </div>
          </div>
        )}

        {currentRole === 'ADMIN' && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-800/40 shadow-xl relative overflow-hidden space-y-3">
            <span className="px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 text-xs font-bold tracking-wide">
              사이트 관리자 통제 센터 (System Master Console)
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              전사 사용자 역할 지정 및 PMO 품질 통제 시스템
            </h2>
            <p className="text-sm text-slate-300/90 max-w-3xl leading-relaxed">
              사용자별 권한(경영진, PM, 관리자)을 관리하고 16종 PM Standard 표준 템플릿 양식과 관문 심사 항목을 마스터 수준에서 설정합니다.
            </p>
          </div>
        )}

        {currentRole === 'EXECUTIVE' && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-blue-400">
              <Building2 size={240} />
            </div>
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 text-xs font-bold tracking-wide">
                PMO 핵심 제안 (Core Proposition)
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                &quot;잘하는 PM의 경험&quot;을 &quot;누구나 실행할 수 있는 회사의 표준&quot;으로 전환
              </h2>
              <p className="text-sm text-slate-300/90 max-w-3xl leading-relaxed">
                개인 경험 의존 및 문제 발생 후 사후 개입 방식을 탈피하고, <strong className="text-blue-400 font-semibold">16종 PM Standard</strong>, <strong className="text-blue-400 font-semibold">Health Score 조기경보</strong>, <strong className="text-blue-400 font-semibold">Gate Review</strong> 체계를 연결하여 프로젝트 손익 및 리스크를 조기 회복합니다.
              </p>
            </div>
          </div>
        )}

        {/* Executive Key Metrics (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="pmo-card space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>전사 프로젝트 계약 총액</span>
              <DollarSign size={18} className="text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalAmount.toFixed(1)}</span>
              <span className="text-sm font-semibold text-slate-400">억 원 (4개 프로젝트)</span>
            </div>
            <div className="text-xs text-blue-400/90 flex items-center gap-1 font-medium">
              <TrendingUp size={13} /> 전사 목표 대비 100% 정상 가동
            </div>
          </div>

          <div className="pmo-card space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>전사 예상 손익 (Profitability)</span>
              <TrendingUp size={18} className={totalProfit >= 0 ? "text-emerald-400" : "text-rose-400"} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalProfit > 0 ? `+${totalProfit.toFixed(1)}` : totalProfit.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">억 원</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              C 프로젝트(-0.7억) 조기 회복 조치 필요
            </div>
          </div>

          <div className="pmo-card space-y-3 border-rose-900/40 bg-rose-950/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>위험 프로젝트 (Red Flag)</span>
              <AlertTriangle size={18} className="text-rose-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">{redProjectsCount}</span>
              <span className="text-sm font-semibold text-slate-400">건 (경영진 선제 개입)</span>
            </div>
            <div className="text-xs text-rose-400/90 flex items-center gap-1 font-bold">
              <ShieldAlert size={13} /> C 프로젝트 Recovery Plan 회의 필요
            </div>
          </div>

          <div className="pmo-card space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Health Score 분포</span>
              <Activity size={18} className="text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                Green {greenProjectsCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
                Yellow {yellowProjectsCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-400 border border-rose-800/60">
                Red {redProjectsCount}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              전체 평균 Health Score: <strong className="text-slate-200">79.3점</strong>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Left Portfolio Table / Right Critical Escalations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Monthly Portfolio Status Table (PDF Page 7 Format) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="pmo-card space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderKanban className="text-blue-400" size={20} />
                    월간 Portfolio 현황보고 (경영진 관점)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    보고서 부록 B 1페이지 월간 Dashboard 양식 준수
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  전체 프로젝트 상세보기 <ChevronRight size={14} />
                </Link>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase bg-slate-900/60">
                      <th className="py-3 px-3">프로젝트명</th>
                      <th className="py-3 px-3">계약액</th>
                      <th className="py-3 px-3">진척률</th>
                      <th className="py-3 px-3">Health</th>
                      <th className="py-3 px-3">예상손익</th>
                      <th className="py-3 px-3">핵심 Risk</th>
                      <th className="py-3 px-3">경영진 요청사항</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">
                          <Link href={`/projects/${p.id}`} className="hover:text-blue-400 transition-colors">
                            {p.name}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-normal">{p.clientName} | PM: {p.pmName}</div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-200">{p.contractAmount.toFixed(1)}억</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  p.progressPct > 60 ? 'bg-blue-500' : 'bg-indigo-500'
                                }`} 
                                style={{ width: `${p.progressPct}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-300">{p.progressPct}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-flex items-center gap-1 ${
                            p.healthStatus === 'Green'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
                              : p.healthStatus === 'Yellow'
                              ? 'bg-amber-950 text-amber-400 border-amber-800/80'
                              : 'bg-rose-950 text-rose-400 border-rose-800/80 animate-pulse'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              p.healthStatus === 'Green' ? 'bg-emerald-400' : p.healthStatus === 'Yellow' ? 'bg-amber-400' : 'bg-rose-400'
                            }`} />
                            {p.healthStatus} ({p.healthScore}점)
                          </span>
                        </td>
                        <td className={`py-3.5 px-3 font-bold ${
                          p.expectedProfit > 0 ? 'text-emerald-400' : p.expectedProfit < 0 ? 'text-rose-400' : 'text-slate-300'
                        }`}>
                          {p.expectedProfit > 0 ? `+${p.expectedProfit.toFixed(1)}억` : `${p.expectedProfit.toFixed(1)}억`}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-300 max-w-[140px] truncate" title={p.keyRisk}>
                          {p.keyRisk}
                        </td>
                        <td className="py-3.5 px-3">
                          {p.executiveActionNeeded !== '-' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800/70 text-xs font-semibold inline-flex items-center gap-1">
                              <AlertTriangle size={12} /> {p.executiveActionNeeded}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PM Standard 16 Deliverables Status Overview */}
            <div className="pmo-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="text-indigo-400" size={20} />
                    PM Standard 최소 산출물 16종 이행 체계
                  </h3>
                  <p className="text-xs text-slate-400">
                    프로젝트 착수부터 종료까지 최소 필수 산출물 준수 현황
                  </p>
                </div>
                <Link href="/deliverables" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  16종 산출물 등록 <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PM_STANDARD_16_ITEMS.slice(0, 8).map((item) => (
                  <div key={item.no} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-semibold">
                      <span>No.{item.no}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-400">{item.timing}</span>
                    </div>
                    <div className="font-bold text-slate-200 truncate" title={item.name}>{item.name}</div>
                    <div className="text-[11px] text-slate-400">Owner: {item.owner}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Red Flag Escalations & Executive Decision Required */}
          <div className="space-y-6">
            {/* Escalation Center */}
            <div className="pmo-card space-y-4 border-rose-900/40 bg-slate-900/90">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="text-rose-400" size={20} />
                  Red Flag & Escalation 안건
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/80 text-[10px] font-extrabold">
                  경영진 승인 대기
                </span>
              </div>

              <div className="space-y-3">
                {issues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      issue.severity === 'Red'
                        ? 'bg-rose-950/20 border-rose-800/50'
                        : 'bg-amber-950/20 border-amber-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">{issue.projectCode}</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        issue.severity === 'Red' ? 'bg-rose-900 text-rose-300' : 'bg-amber-900 text-amber-300'
                      }`}>
                        {issue.type} ({issue.severity})
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm leading-snug">{issue.title}</div>
                    <div className="text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                      <strong className="text-rose-400">영향:</strong> {issue.impact}
                    </div>
                    <div className="text-slate-400">
                      <strong>대응방안:</strong> {issue.countermeasure}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>담당: {issue.assignee}</span>
                      <span>기한: {issue.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/issues"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1"
              >
                Risk / Issue 대장 전체보기 <ChevronRight size={14} />
              </Link>
            </div>

            {/* Quick Gate Check Status */}
            <div className="pmo-card space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="text-blue-400" size={18} />
                단계별 Gate Review 현황 (G1~G6)
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {[
                  { gate: 'G1 착수 Gate', code: 'G1', status: 'PASS', date: '2026-05-01' },
                  { gate: 'G2 요구사항 Gate', code: 'G2', status: 'HOLD', date: '2026-09-15', alert: true },
                  { gate: 'G3 설계 Gate', code: 'G3', status: 'PASS', date: '2026-08-10' },
                  { gate: 'G4 개발 Gate', code: 'G4', status: 'CONDITIONAL_PASS', date: '2026-09-30' },
                ].map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">{g.gate}</div>
                      <div className="text-[11px] text-slate-400">심사 예정/완료: {g.date}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                      g.status === 'PASS' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : g.status === 'HOLD'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
