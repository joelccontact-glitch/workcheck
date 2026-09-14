'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { PM_STANDARD_16_ITEMS, INITIAL_PROJECTS, PMDeliverable, Project } from '@/utils/pmoData';
import { getFirebaseProjects } from '@/services/firestoreService';
import { useAuth, Role } from '@/context/AuthContext';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Upload, 
  ChevronRight,
  Sparkles,
  Crown,
  Briefcase,
  Plus
} from 'lucide-react';

export default function DeliverablesPage() {
  const { role } = useAuth();
  const currentRole: Role = role === 'USER' ? 'PM' : role;

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1');
  const [deliverables, setDeliverables] = useState<PMDeliverable[]>(
    PM_STANDARD_16_ITEMS.map((item) => ({
      ...item,
      status: item.no <= 5 ? '승인완료' : item.no <= 9 ? '검토중' : item.no <= 12 ? '작성중' : '미작성'
    }))
  );

  useEffect(() => {
    getFirebaseProjects().then(data => {
      if (data && data.length > 0) setProjects(data);
    });
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0] || INITIAL_PROJECTS[0];

  const handleStatusChange = (no: number, newStatus: PMDeliverable['status']) => {
    setDeliverables(prev =>
      prev.map(d => (d.no === no ? { ...d, status: newStatus } : d))
    );
  };

  const handleExecutiveApproveAll = () => {
    setDeliverables(prev => prev.map(d => ({ ...d, status: '승인완료' })));
    alert(`[경영진 최종 승인] ${selectedProject.name}의 16종 PM Standard 산출물이 모두 최종 승인 완료 처리되었습니다.`);
  };

  const completedCount = deliverables.filter(d => d.status === '승인완료').length;
  const inProgressCount = deliverables.filter(d => d.status === '작성중' || d.status === '검토중').length;
  const unstartedCount = deliverables.filter(d => d.status === '미작성').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              {currentRole === 'EXECUTIVE' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                  <Crown size={13} /> 👑 경영진 최종 승인 & 검토 콘솔
                </span>
              )}
              {currentRole === 'PM' && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                  <Briefcase size={13} /> 🎯 PM 16종 표준 산출물 등록 & 작성 (Step 05)
                </span>
              )}
              {currentRole === 'ADMIN' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                  <FileCheck2 size={13} /> ⚙️ PMO 16종 마스터 템플릿 양식 관리
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FileCheck2 className="text-indigo-400" size={28} />
              PM Standard 최소 산출물 16종 관리 체계
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentRole === 'EXECUTIVE' ? '경영진 전용: 프로젝트 산출물 최종 결재 승인 및 서식 품질 점검 보고' :
               currentRole === 'PM' ? 'PM 전용: 16종 표준 산출물 양식 다운로드, 작성 및 검토 승인 요청 (Step 05)' :
               '관리자 전용: 전사 16종 표준 서식 마스터 템플릿 제공 및 이행 현황 관리'}
            </p>
          </div>

          {currentRole === 'EXECUTIVE' && (
            <button
              onClick={handleExecutiveApproveAll}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
            >
              <Crown size={16} /> 16종 산출물 일괄 최종 승인
            </button>
          )}

          {currentRole === 'PM' && (
            <button
              onClick={() => alert(`[PM 산출물 업로드] 16종 표준 산출물 파일 첨부 모달이 시작됩니다.`)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Upload size={16} /> 신규 산출물 파일 업로드
            </button>
          )}
        </header>

        {/* Project Selector Bar */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-semibold text-slate-400 mb-1">프로젝트 선택</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name} (PM: {p.pmName})
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                승인완료: <strong className="text-sm font-black text-emerald-400">{completedCount}</strong> / 16
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300">
                작성/검토중: <strong className="text-sm font-black text-amber-400">{inProgressCount}</strong> / 16
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                미작성: <strong className="text-sm font-black text-slate-200">{unstartedCount}</strong> / 16
              </div>
            </div>
          </div>
        </div>

        {/* 16 Deliverables Grid / Table */}
        <div className="pmo-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-bold text-slate-400 uppercase bg-slate-900/80">
                  <th className="py-3 px-3">No.</th>
                  <th className="py-3 px-3">산출물 명칭</th>
                  <th className="py-3 px-3">작성 시점</th>
                  <th className="py-3 px-3">Owner (책임자)</th>
                  <th className="py-3 px-3">이행 상태</th>
                  <th className="py-3 px-3">역할별 상태 변경</th>
                  <th className="py-3 px-3">서식 / 작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deliverables.map((d) => (
                  <tr key={d.no} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-400">#{d.no}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{d.name}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-semibold text-[11px]">
                        {d.timing}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-300">{d.owner}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        d.status === '승인완료'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : d.status === '검토중'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : d.status === '작성중'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.no, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="미작성">미작성</option>
                        <option value="작성중">작성중</option>
                        <option value="검토중">검토중</option>
                        <option value="승인완료">👑 승인완료</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <button 
                        onClick={() => alert(`${d.name} 표준 서식 템플릿 다운로드가 시작되었습니다.`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Download size={13} /> 양식 다운
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
