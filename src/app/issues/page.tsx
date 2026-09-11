'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { INITIAL_ISSUES, INITIAL_PROJECTS, IssueItem } from '@/utils/pmoData';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2,
  X,
  FileText
} from 'lucide-react';

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [filterSeverity, setFilterSeverity] = useState<string>('전체');
  const [filterType, setFilterType] = useState<string>('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('3');
  const [newType, setNewType] = useState<IssueItem['type']>('Issue');
  const [newTitle, setNewTitle] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newSeverity, setNewSeverity] = useState<IssueItem['severity']>('Yellow');
  const [newCountermeasure, setNewCountermeasure] = useState('');
  const [newAssignee, setNewAssignee] = useState('PMO 책임자');
  const [newDueDate, setNewDueDate] = useState('2026-09-30');

  const filteredIssues = issues.filter(i => {
    const matchesSev = filterSeverity === '전체' || i.severity === filterSeverity;
    const matchesType = filterType === '전체' || i.type === filterType;
    return matchesSev && matchesType;
  });

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const proj = INITIAL_PROJECTS.find(p => p.id === selectedProjectId) || INITIAL_PROJECTS[0];

    const newItem: IssueItem = {
      id: `I-00${issues.length + 1}`,
      projectCode: proj.code,
      projectName: proj.name,
      type: newType,
      title: newTitle,
      impact: newImpact,
      severity: newSeverity,
      countermeasure: newCountermeasure,
      assignee: newAssignee,
      dueDate: newDueDate,
      status: 'Open'
    };

    setIssues([newItem, ...issues]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewImpact('');
    setNewCountermeasure('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Risk & Issue Escalation Matrix
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="text-rose-400" size={28} />
              Risk / Issue / Escalation 통합 대장
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              보고서 12페이지 Escalation 체계: 문제를 조기에 발견하고 회복시키는 PM 및 PMO 관리 대장
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2"
          >
            <Plus size={18} /> 신규 Risk/Issue 등록
          </button>
        </header>

        {/* Escalation Rules Summary Bar (PDF Page 12 Rules) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/50 text-xs space-y-1">
            <div className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Green 등급
            </div>
            <div className="text-slate-300 font-medium">PM 수준에서 해결 가능</div>
            <div className="text-slate-400">PM 조치: 일상 관리 | PMO: 정기 모니터링</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/50 text-xs space-y-1">
            <div className="font-extrabold text-amber-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Yellow 등급
            </div>
            <div className="text-slate-300 font-medium">일정/원가/품질 영향 가능</div>
            <div className="text-slate-400">PM 조치: 회복계획 수립 | PMO: 집중 관리</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 text-xs space-y-1 animate-pulse">
            <div className="font-extrabold text-rose-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Red 등급 (Escalation)
            </div>
            <div className="text-slate-300 font-medium">계약·손익·오픈 직접 영향</div>
            <div className="text-slate-400">PM 조치: 즉시 보고 | 경영진: 의사결정 개입</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Filter size={14} /> 등급:
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', 'Green', 'Yellow', 'Red'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-slate-400 font-semibold ml-2">
                유형:
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', 'Risk', 'Issue', 'Escalation'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Issues List Table */}
        <div className="pmo-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-bold text-slate-400 uppercase bg-slate-900/80">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">프로젝트</th>
                  <th className="py-3 px-3">유형 / 등급</th>
                  <th className="py-3 px-3">이슈 내용</th>
                  <th className="py-3 px-3">영향 (Impact)</th>
                  <th className="py-3 px-3">대응 방안</th>
                  <th className="py-3 px-3">담당 / 기한</th>
                  <th className="py-3 px-3">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-400">{issue.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{issue.projectCode}</div>
                      <div className="text-[11px] text-slate-400">{issue.projectName}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                        issue.severity === 'Red'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : issue.severity === 'Yellow'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}>
                        {issue.type} ({issue.severity})
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-100 text-sm max-w-[200px]">
                      {issue.title}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-[160px]">
                      {issue.impact}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-[200px]">
                      {issue.countermeasure}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{issue.assignee}</div>
                      <div className="text-[11px] text-slate-400">{issue.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-bold text-[10px]">
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for adding Risk / Issue */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="pmo-card max-w-lg w-full bg-slate-900 border-slate-800 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert size={20} className="text-rose-400" /> 신규 Risk / Issue 등록
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddIssue} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">대상 프로젝트</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">유형</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Risk">Risk (위험)</option>
                      <option value="Issue">Issue (이슈)</option>
                      <option value="Escalation">Escalation (경영진 보고)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">심각도 등급</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Green">Green (일반)</option>
                      <option value="Yellow">Yellow (주의)</option>
                      <option value="Red">Red (위험)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">이슈 제목</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 고객 요구사항 변경으로 인한 2주 지연"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">영향 (Impact)</label>
                  <input
                    type="text"
                    placeholder="예: 일정 1주일 지연 및 공수 추가 0.2억"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">대응 방안</label>
                  <textarea
                    rows={2}
                    placeholder="대응책 및 조치 사항"
                    value={newCountermeasure}
                    onChange={(e) => setNewCountermeasure(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
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
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-600/30"
                  >
                    Risk/Issue 등록
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
