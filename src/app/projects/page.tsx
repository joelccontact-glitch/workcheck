'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { INITIAL_PROJECTS, Project } from '@/utils/pmoData';
import { getFirebaseProjects, addFirebaseProject } from '@/services/firestoreService';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Building2, 
  Activity, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  X,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('전체');
  const [selectedHealth, setSelectedHealth] = useState<string>('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newPm, setNewPm] = useState('');
  const [newAmount, setNewAmount] = useState('5.0');
  const [newStage, setNewStage] = useState<Project['stage']>('착수');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.clientName.includes(searchTerm) || p.pmName.includes(searchTerm);
    const matchesStage = selectedStage === '전체' || p.stage === selectedStage;
    const matchesHealth = selectedHealth === '전체' || p.healthStatus === selectedHealth;
    return matchesSearch && matchesStage && matchesHealth;
  });

  useEffect(() => {
    getFirebaseProjects().then(data => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newClient || !newPm) return;

    const newProject: Project = {
      id: String(Date.now()),
      code: newCode,
      name: newName,
      clientName: newClient,
      pmName: newPm,
      pmLevel: 'PM Level 1',
      contractAmount: parseFloat(newAmount) || 5.0,
      progressPct: 10,
      stage: newStage,
      healthStatus: 'Green',
      healthScore: 90,
      expectedProfit: (parseFloat(newAmount) || 5.0) * 0.1,
      keyRisk: '-',
      executiveActionNeeded: '-',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    };

    setProjects([newProject, ...projects]);
    await addFirebaseProject(newProject);
    setIsModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewClient('');
    setNewPm('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Project Management
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FolderKanban className="text-blue-400" size={28} />
              프로젝트 통합 현황
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              전사 프로젝트 단계별 Life Cycle 및 Health Status 통합 관리
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Plus size={18} /> 신규 프로젝트 등록
          </button>
        </header>

        {/* Filter & Search Toolbar */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="프로젝트명, 코드, 고객사, PM 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Filter size={14} /> 단계:
              </div>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', '수주/이관', '착수', '요구사항', '설계/개발', '테스트', '오픈/안정화', '종료'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-slate-400 font-semibold ml-2">
                Health:
              </div>
              <select
                value={selectedHealth}
                onChange={(e) => setSelectedHealth(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', 'Green', 'Yellow', 'Red'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="pmo-card pmo-card-hover space-y-4 relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-blue-400 tracking-wide">{p.code}</span>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    고객사: <strong className="text-slate-300">{p.clientName}</strong> | 담당 PM: <strong className="text-slate-300">{p.pmName}</strong>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 inline-flex items-center gap-1.5 ${
                  p.healthStatus === 'Green'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : p.healthStatus === 'Yellow'
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    p.healthStatus === 'Green' ? 'bg-emerald-400' : p.healthStatus === 'Yellow' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  {p.healthStatus} ({p.healthScore}점)
                </span>
              </div>

              {/* Metrics Badge row */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">계약금액</div>
                  <div className="font-extrabold text-slate-100">{p.contractAmount.toFixed(1)}억 원</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">현재 단계</div>
                  <div className="font-bold text-blue-400">{p.stage}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">예상 손익</div>
                  <div className={`font-extrabold ${p.expectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {p.expectedProfit > 0 ? `+${p.expectedProfit.toFixed(1)}억` : `${p.expectedProfit.toFixed(1)}억`}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>공정 진척률</span>
                  <span className="font-bold text-slate-200">{p.progressPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" 
                    style={{ width: `${p.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Risk & Executive Request if any */}
              {p.executiveActionNeeded !== '-' && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-rose-400">
                    <AlertTriangle size={14} /> 경영진 지원 요청사항
                  </div>
                  <div>{p.executiveActionNeeded}</div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Link
                  href={`/projects/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  상세 세부관리 & 16종 산출물 <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* New Project Registration Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="pmo-card max-w-lg w-full bg-slate-900 border-slate-800 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle size={20} className="text-blue-400" /> 신규 프로젝트 착수 등록
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">프로젝트 코드</label>
                  <input
                    type="text"
                    required
                    placeholder="예: PRJ-2026-E"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">프로젝트명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: E 프로젝트 (차세대 AI 플랫폼)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">고객사</label>
                    <input
                      type="text"
                      required
                      placeholder="고객사명"
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">담당 PM</label>
                    <input
                      type="text"
                      required
                      placeholder="PM 성명/직급"
                      value={newPm}
                      onChange={(e) => setNewPm(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">계약금액 (억원)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">초기 단계</label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {['수주/이관', '착수', '요구사항', '설계/개발', '테스트', '오픈/안정화', '종료'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                  >
                    프로젝트 착수 등록
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
