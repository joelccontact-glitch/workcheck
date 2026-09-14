'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { GATES_DEFINITION, INITIAL_PROJECTS, GateCheck, Project } from '@/utils/pmoData';
import { getFirebaseProjects } from '@/services/firestoreService';
import { useAuth, Role } from '@/context/AuthContext';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Building2, 
  ChevronRight,
  Filter,
  FileCheck2,
  Lock,
  Crown,
  Briefcase,
  CheckSquare
} from 'lucide-react';

export default function GateChecksPage() {
  const { role } = useAuth();
  const currentRole: Role = role === 'USER' ? 'PM' : role;

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('3'); // C project
  const [gates, setGates] = useState<GateCheck[]>(
    GATES_DEFINITION.map((g, idx) => ({
      ...g,
      result: idx === 0 ? 'PASS' : idx === 1 ? 'HOLD' : idx === 2 ? 'PASS' : 'CONDITIONAL_PASS',
      dueMonth: '2026-09',
      reviewer: '김지훈 책임 (PMO)'
    }))
  );

  useEffect(() => {
    getFirebaseProjects().then(data => {
      setProjects(data || []);
    });
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  const handleResultChange = (code: string, newResult: GateCheck['result']) => {
    setGates(prev =>
      prev.map(g => (g.code === code ? { ...g, result: newResult } : g))
    );
  };

  const handleApproveAll = () => {
    setGates(prev => prev.map(g => ({ ...g, result: 'PASS' })));
    alert(`[경영진 승인 처리] ${selectedProject.name} 프로젝트의 모든 Gate Review가 'PASS' 승인 완료되었습니다.`);
  };

  const handleHoldAction = () => {
    setGates(prev => prev.map(g => g.code === 'G2' ? { ...g, result: 'HOLD' } : g));
    alert(`[경영진 지시] ${selectedProject.name} 프로젝트 G2 요구사항 Gate가 HOLD 처리되었으며, Recovery 회의 소집 통보가 전송되었습니다.`);
  };

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
                  <Crown size={13} /> 👑 경영진 최종 결재 & 승인 콘솔
                </span>
              )}
              {currentRole === 'PM' && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                  <Briefcase size={13} /> 🎯 PM Gate Review 자가진단 제출 (Step 04)
                </span>
              )}
              {currentRole === 'ADMIN' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                  <Sliders size={13} /> ⚙️ Gate Review 마스터 설정
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sliders className="text-blue-400" size={28} />
              Gate Check 관문 심사 센터 (G1~G6)
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentRole === 'EXECUTIVE' ? '경영진 전용: PASS / CONDITIONAL PASS / HOLD 관문 최종 승인 및 경영진 개입 지시' :
               currentRole === 'PM' ? '프로젝트 PM 전용: 6대 관문 필수 서류 자가점검 및 경영진 결재 요청 제출' :
               '관리자 전용: Gate Review 통과 규정 및 심사자 마스터 관리'}
            </p>
          </div>

          {currentRole === 'EXECUTIVE' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleApproveAll}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <CheckCircle2 size={16} /> 일괄 PASS 승인
              </button>
              <button
                onClick={handleHoldAction}
                className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <ShieldAlert size={16} /> G2 HOLD 처리
              </button>
            </div>
          )}

          {currentRole === 'PM' && (
            <button
              onClick={() => alert(`[PM 제출] ${selectedProject.name} 프로젝트의 Gate Review 자가진단표가 PMO 및 경영진에 결재 요청 제출되었습니다.`)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <CheckSquare size={16} /> Gate 심사 요청서 제출
            </button>
          )}
        </header>

        {/* Project Filter */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-semibold text-slate-400 mb-1">심사 대상 프로젝트 선택</label>
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

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">현재 프로젝트 단계: <strong className="text-blue-400">{selectedProject.stage}</strong></div>
              <div className="text-slate-400">Gate 심사 판정: <strong className="text-slate-200">G2 요구사항 Gate HOLD 수검 상태</strong></div>
            </div>
          </div>
        </div>

        {/* Decision Rules Banner */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs space-y-1 text-slate-300">
          <div className="font-bold text-blue-300 flex items-center gap-1.5 text-sm">
            <Lock size={16} /> Gate 결과 판정 및 진입 규정
          </div>
          <p>
            • <strong>PASS</strong>: 다음 단계 즉시 진입 가능.
            <br />
            • <strong>CONDITIONAL PASS</strong>: 조건·담당자·완료일을 명시하고 조건부 진입 허용.
            <br />
            • <strong className="text-rose-400">HOLD</strong>: 경영진 또는 PMO의 재승인 전 다음 단계 진행을 강력 제한함.
          </p>
        </div>

        {/* 6 Gate Review Cards (G1 to G6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gates.map((gate) => (
            <div 
              key={gate.code}
              className={`pmo-card space-y-4 relative border ${
                gate.result === 'PASS'
                  ? 'border-emerald-800/60 bg-slate-900/80'
                  : gate.result === 'HOLD'
                  ? 'border-rose-800/80 bg-rose-950/20'
                  : 'border-amber-800/80 bg-amber-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-slate-950 font-black text-blue-400 text-sm border border-slate-800">
                  {gate.code}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                  gate.result === 'PASS'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : gate.result === 'HOLD'
                    ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {gate.result}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{gate.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5">시점: {gate.timing}</div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-blue-300">필수 확인사항:</strong>
                  <p className="text-slate-400 mt-0.5">{gate.checkItems}</p>
                </div>
                <div>
                  <strong className="text-emerald-300">통과 기준:</strong>
                  <p className="text-slate-400 mt-0.5">{gate.passCriteria}</p>
                </div>
              </div>

              {/* Gate Result Selection Box based on Role */}
              <div className="pt-2 space-y-1">
                <label className="block text-[11px] font-bold text-slate-400">
                  {currentRole === 'EXECUTIVE' ? '👑 경영진 최종 결재 판정' : '심사 판정 변경'}
                </label>
                <select
                  value={gate.result}
                  onChange={(e) => handleResultChange(gate.code, e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PASS">PASS (즉시 진입)</option>
                  <option value="CONDITIONAL_PASS">CONDITIONAL PASS (조건부 진입)</option>
                  <option value="HOLD">HOLD (진행 제한)</option>
                </select>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>심사자: {gate.reviewer}</span>
                <span>보고주: {gate.dueMonth}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
