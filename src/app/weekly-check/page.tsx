'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { calculateHealthScore, INITIAL_PROJECTS, Project } from '@/utils/pmoData';
import { getFirebaseProjects } from '@/services/firestoreService';
import { 
  CheckSquare, 
  AlertTriangle, 
  Activity, 
  Save, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Calculator,
  RotateCcw
} from 'lucide-react';

export default function WeeklyCheckPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('3'); // Default to C project (Red)
  const [weekLabel, setWeekLabel] = useState('2026년 9월 2주차 (2026-W37)');

  // 12 Checklist Scores & Choices
  const [scheduleScore, setScheduleScore] = useState(10); // 20
  const [costScore, setCostScore] = useState(8);       // 15
  const [qualityScore, setQualityScore] = useState(10);   // 15
  const [reqScore, setReqScore] = useState(8);          // 15
  const [resourceScore, setResourceScore] = useState(5);  // 10
  const [clientScore, setClientScore] = useState(5);    // 10
  const [riskScore, setRiskScore] = useState(7);        // 10
  const [issueScore, setIssueScore] = useState(3);       // 5

  // Critical Red Flag Toggle Rule
  const [hasCriticalRedFlag, setHasCriticalRedFlag] = useState(true);
  const [redFlagReason, setRedFlagReason] = useState('일정 지연 >10% & 요구사항 승인 지연 (Recovery Plan 필요)');

  useEffect(() => {
    getFirebaseProjects().then(data => {
      setProjects(data || []);
    });
  }, []);

  // Selected Project
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  // Calculate Health Score
  const healthResult = calculateHealthScore(
    {
      schedule: scheduleScore,
      cost: costScore,
      quality: qualityScore,
      requirement: reqScore,
      resource: resourceScore,
      client: clientScore,
      risk: riskScore,
      issue: issueScore
    },
    hasCriticalRedFlag
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Weekly Inspection & Health Calculator
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <CheckSquare className="text-blue-400" size={28} />
              주간 프로젝트 점검표 & Health Score 산정
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              보고서 6페이지 주간 프로젝트 점검표 양식 및 8페이지 Health Score 판정 엔진
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Save size={18} /> 주간 점검표 확정 및 저장
            </button>
          </div>
        </header>

        {/* Project Selector Bar */}
        <div className="pmo-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">점검 대상 프로젝트</label>
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

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">점검 보고주 (Week)</label>
              <input
                type="text"
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Calculated Real-time Score Display Badge */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400">자동 산출 Health Status</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xl font-black ${
                    healthResult.status === 'Green'
                      ? 'text-emerald-400'
                      : healthResult.status === 'Yellow'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {healthResult.status} ({healthResult.totalScore}점)
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                healthResult.status === 'Green'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : healthResult.status === 'Yellow'
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
              }`}>
                {healthResult.status}
              </span>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} /> {currentProject.name} 주간 점검표가 성공적으로 확정 및 저장되었습니다!
            </div>
          )}
        </div>

        {/* Critical Red Flag Rule Card (Rule explanation from PDF Page 8) */}
        <div className="pmo-card border-rose-900/50 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">
                Critical Red Flag 강제 승격 규정
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/80">
              <input
                type="checkbox"
                checked={hasCriticalRedFlag}
                onChange={(e) => setHasCriticalRedFlag(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-950 border-slate-700"
              />
              Critical Red Flag 발생 (체크 시 점수 무관 Red 승격)
            </label>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            판정 규정: 85~100점 Green / 70~84점 Yellow / 69점 이하 Red. <strong className="text-rose-400">단, Critical Red Flag(일정지연 &gt;10%, Critical 이슈 장기화, 핵심인력 이탈, 무승인 범위확대, 원가초과 예상)가 발생하면 점수와 무관하게 Red로 승격한다.</strong>
          </p>

          {hasCriticalRedFlag && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-rose-300 mb-1">Red Flag 사유 명시</label>
              <input
                type="text"
                value={redFlagReason}
                onChange={(e) => setRedFlagReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-rose-800/80 text-xs text-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          )}
        </div>

        {/* 12 Areas Inspection Matrix Table (PDF Page 6 & 8 Format) */}
        <div className="pmo-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator size={20} className="text-blue-400" />
              12개 영역별 점검 항목 및 배점 산정
            </h3>
            <span className="text-xs font-bold text-slate-400">
              총점 배점: 100점 만점
            </span>
          </div>

          <div className="space-y-4">
            {/* 1. 일정 (20점 만점) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-blue-400 uppercase">01. 일정 관리 (배점 20점)</span>
                  <div className="text-sm font-bold text-white mt-0.5">계획 대비 진척 및 Critical Path 지연 여부</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-400">{scheduleScore}</span> / 20점
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setScheduleScore(20)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    scheduleScore === 20 ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Green (20점)</div>
                  <div className="text-[11px] font-normal opacity-80">계획 대비 ±5% 이내</div>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleScore(12)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    scheduleScore === 12 ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Yellow (12점)</div>
                  <div className="text-[11px] font-normal opacity-80">-5% ~ -10% 지연</div>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleScore(5)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    scheduleScore === 5 ? 'bg-rose-950 border-rose-700 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Red (5점)</div>
                  <div className="text-[11px] font-normal opacity-80">-10% 초과 지연</div>
                </button>
              </div>
            </div>

            {/* 2. 원가/공수 (15점 만점) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-blue-400 uppercase">02. 원가 / 공수 소진 (배점 15점)</span>
                  <div className="text-sm font-bold text-white mt-0.5">잔여 공수 대비 잔여 업무 적정성</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-400">{costScore}</span> / 15점
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCostScore(15)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    costScore === 15 ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Green (15점)</div>
                  <div className="text-[11px] font-normal opacity-80">계획 범위 충족</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCostScore(8)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    costScore === 8 ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Yellow (8점)</div>
                  <div className="text-[11px] font-normal opacity-80">5~10% 초과</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCostScore(3)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    costScore === 3 ? 'bg-rose-950 border-rose-700 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Red (3점)</div>
                  <div className="text-[11px] font-normal opacity-80">10% 초과 손실</div>
                </button>
              </div>
            </div>

            {/* 3. 품질 (15점 만점) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-blue-400 uppercase">03. 품질 & 결함 (배점 15점)</span>
                  <div className="text-sm font-bold text-white mt-0.5">Critical/High 결함 증가 및 오픈 준비도</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-400">{qualityScore}</span> / 15점
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setQualityScore(15)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    qualityScore === 15 ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Green (15점)</div>
                  <div className="text-[11px] font-normal opacity-80">Critical 0건 / 안정</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQualityScore(10)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    qualityScore === 10 ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Yellow (10점)</div>
                  <div className="text-[11px] font-normal opacity-80">High 결함 증가</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQualityScore(3)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    qualityScore === 3 ? 'bg-rose-950 border-rose-700 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Red (3점)</div>
                  <div className="text-[11px] font-normal opacity-80">Critical 장기화</div>
                </button>
              </div>
            </div>

            {/* 4. 요구사항/변경 (15점 만점) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-blue-400 uppercase">04. 요구사항 & 변경 통제 (배점 15점)</span>
                  <div className="text-sm font-bold text-white mt-0.5">승인되지 않은 변경 및 범위 확대 여부</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-400">{reqScore}</span> / 15점
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReqScore(15)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    reqScore === 15 ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Green (15점)</div>
                  <div className="text-[11px] font-normal opacity-80">통제 완료</div>
                </button>
                <button
                  type="button"
                  onClick={() => setReqScore(8)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    reqScore === 8 ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Yellow (8점)</div>
                  <div className="text-[11px] font-normal opacity-80">변경 증가 중</div>
                </button>
                <button
                  type="button"
                  onClick={() => setReqScore(3)}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    reqScore === 3 ? 'bg-rose-950 border-rose-700 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>Red (3점)</div>
                  <div className="text-[11px] font-normal opacity-80">범위 통제 실패</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
