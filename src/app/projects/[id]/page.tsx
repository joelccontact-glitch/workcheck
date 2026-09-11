'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  INITIAL_PROJECTS, 
  PM_STANDARD_16_ITEMS, 
  GATES_DEFINITION, 
  INITIAL_ISSUES, 
  Project, 
  PMDeliverable 
} from '@/utils/pmoData';
import { 
  FolderKanban, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Layers, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  Activity,
  AlertTriangle,
  Upload,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // Find target project or default to project 1
  const project = INITIAL_PROJECTS.find(p => p.id === id) || INITIAL_PROJECTS[0];

  // 16 Standard Deliverables state for this project
  const [deliverables, setDeliverables] = useState<PMDeliverable[]>(
    PM_STANDARD_16_ITEMS.map(item => ({
      ...item,
      status: item.no <= 5 ? '승인완료' : item.no <= 8 ? '검토중' : item.no <= 11 ? '작성중' : '미작성'
    }))
  );

  const stages: Project['stage'][] = [
    '수주/이관', '착수', '요구사항', '설계/개발', '테스트', '오픈/안정화', '종료'
  ];

  const handleStatusChange = (no: number, newStatus: PMDeliverable['status']) => {
    setDeliverables(prev =>
      prev.map(d => (d.no === no ? { ...d, status: newStatus } : d))
    );
  };

  const completedCount = deliverables.filter(d => d.status === '승인완료').length;
  const deliverablePct = Math.round((completedCount / 16) * 100);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Nav & Header */}
        <div className="space-y-4">
          <Link
            href="/projects"
            className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} /> 프로젝트 목록으로 돌아가기
          </Link>

          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400">{project.code}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  project.healthStatus === 'Green'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : project.healthStatus === 'Yellow'
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                }`}>
                  Health: {project.healthStatus} ({project.healthScore}점)
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
                {project.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                고객사: <strong className="text-slate-200">{project.clientName}</strong> | 담당 PM: <strong className="text-slate-200">{project.pmName}</strong> ({project.pmLevel})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/weekly-check"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Activity size={16} /> 주간 점검 작성
              </Link>
            </div>
          </header>
        </div>

        {/* 7 Stage Life Cycle Progression Tracker */}
        <div className="pmo-card space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            7단계 프로젝트 Life Cycle 진행도
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {stages.map((stg, idx) => {
              const currentIdx = stages.indexOf(project.stage);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stg}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-blue-950/80 border-blue-500/80 text-blue-300 ring-2 ring-blue-500/40 shadow-lg shadow-blue-950/50'
                      : isPast
                      ? 'bg-slate-900 border-slate-700/80 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1">STAGE 0{idx + 1}</div>
                  <div className="text-xs font-extrabold truncate">{stg}</div>
                  {isCurrent && (
                    <span className="mt-1.5 inline-block text-[9px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold animate-pulse">
                      현재 단계
                    </span>
                  )}
                  {isPast && (
                    <CheckCircle2 size={14} className="mx-auto mt-1 text-emerald-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Key Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="pmo-card space-y-2">
            <div className="text-xs font-semibold text-slate-400">계약금액</div>
            <div className="text-2xl font-black text-white">{project.contractAmount.toFixed(1)}억 원</div>
            <div className="text-xs text-slate-400">수주/이관 승인 완료</div>
          </div>

          <div className="pmo-card space-y-2">
            <div className="text-xs font-semibold text-slate-400">공정 진척률</div>
            <div className="text-2xl font-black text-blue-400">{project.progressPct}%</div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progressPct}%` }} />
            </div>
          </div>

          <div className="pmo-card space-y-2">
            <div className="text-xs font-semibold text-slate-400">예상 손익</div>
            <div className={`text-2xl font-black ${project.expectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {project.expectedProfit > 0 ? `+${project.expectedProfit.toFixed(1)}억` : `${project.expectedProfit.toFixed(1)}억`}
            </div>
            <div className="text-xs text-slate-400">공수/범위 손익 영향 반영</div>
          </div>

          <div className="pmo-card space-y-2">
            <div className="text-xs font-semibold text-slate-400">16종 PM Standard 이행률</div>
            <div className="text-2xl font-black text-indigo-400">{deliverablePct}%</div>
            <div className="text-xs text-slate-400">16개 필수 산출물 중 {completedCount}개 승인</div>
          </div>
        </div>

        {/* PM Standard 16 Deliverables Management Section (Main Deliverable Table) */}
        <div className="pmo-card space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={20} className="text-blue-400" />
                PM Standard 최소 산출물 16종 관리 대장
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                보고서 4페이지 규정 PM Standard 16종 작성 및 상태 관리
              </p>
            </div>
            <div className="text-xs font-bold text-slate-300">
              이행 준수율: <span className="text-blue-400 text-sm font-black">{deliverablePct}%</span> ({completedCount}/16 완료)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-bold text-slate-400 uppercase bg-slate-900/80">
                  <th className="py-3 px-3">No.</th>
                  <th className="py-3 px-3">산출물명</th>
                  <th className="py-3 px-3">작성 시점</th>
                  <th className="py-3 px-3">Owner</th>
                  <th className="py-3 px-3">현재 상태</th>
                  <th className="py-3 px-3">상태 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deliverables.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-400">#{item.no}</td>
                    <td className="py-3 px-3 font-bold text-white text-sm">
                      {item.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-semibold text-[11px]">
                        {item.timing}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">{item.owner}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        item.status === '승인완료'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : item.status === '검토중'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : item.status === '작성중'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.no, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="미작성">미작성</option>
                        <option value="작성중">작성중</option>
                        <option value="검토중">검토중</option>
                        <option value="승인완료">승인완료</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gate Checks (G1~G6) for this Project */}
        <div className="pmo-card space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers size={20} className="text-indigo-400" />
            Gate Check (G1~G6) 관문 심사 내역
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GATES_DEFINITION.map((gate) => (
              <div key={gate.code} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-400 text-sm">{gate.code}</span>
                    <span className="font-bold text-white text-sm">{gate.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                    PASS
                  </span>
                </div>
                <div className="text-slate-400">
                  <strong>필수 확인사항:</strong> {gate.checkItems}
                </div>
                <div className="text-slate-400">
                  <strong>통과 기준:</strong> {gate.passCriteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
