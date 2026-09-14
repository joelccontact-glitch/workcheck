'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { INITIAL_ISSUES, INITIAL_PROJECTS, IssueItem } from '@/utils/pmoData';
import { getFirebaseIssues, addFirebaseIssue } from '@/services/firestoreService';
import { useAuth, Role } from '@/context/AuthContext';
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
  FileText,
  Crown,
  Briefcase
} from 'lucide-react';

export default function IssuesPage() {
  const { role } = useAuth();
  const currentRole: Role = role === 'USER' ? 'PM' : role;

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

  useEffect(() => {
    getFirebaseIssues().then(data => {
      setIssues(data || []);
    });
  }, []);

  const handleAddIssue = async (e: React.FormEvent) => {
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
    await addFirebaseIssue(newItem);
    setIsModalOpen(false);
    setNewTitle('');
    setNewImpact('');
    setNewCountermeasure('');
  };

  const handleExecutiveCallMeeting = () => {
    alert('[경영진 긴급 지시] C 프로젝트(차세대 금융) Red 리스크에 대한 경영진 긴급 Recovery 회의 소집이 전사 PMO 팀에 전송되었습니다.');
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
                  <Crown size={13} /> 👑 경영진 긴급 Escalation 보고 콘솔
                </span>
              )}
              {currentRole === 'PM' && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                  <Briefcase size={13} /> 🎯 PM Risk / Issue 등록 & 대응 (Step 06)
                </span>
              )}
              {currentRole === 'ADMIN' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                  <ShieldAlert size={13} /> ⚙️ Escalation 매트릭스 마스터 설정
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="text-rose-400" size={28} />
              Risk / Issue / Escalation 통합 대장
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentRole === 'EXECUTIVE' ? '경영진 전용: Red/Yellow 위험 프로젝트 선제 개입 및 경영진 의사결정 회의 조치' :
               currentRole === 'PM' ? 'PM 전용: 프로젝트 위험 및 이슈 발생 즉시 등록 후 회복계획 작성 (Step 06)' :
               '관리자 전용: Escalation 3단계 등급 매트릭스 및 전사 경보 기준 관리'}
            </p>
          </div>

          {currentRole === 'EXECUTIVE' && (
            <button
              onClick={handleExecutiveCallMeeting}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Crown size={16} /> 긴급 Recovery 회의 소집
            </button>
          )}

          {currentRole === 'PM' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Plus size={18} /> Risk/Issue 등록
            </button>
          )}
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
                  <th className="py-3.5 px-3">ID / 등급</th>
                  <th className="py-3.5 px-3">프로젝트</th>
                  <th className="py-3.5 px-3">유형 / 리스크·이슈 항목</th>
                  <th className="py-3.5 px-3">영향도 (Impact)</th>
                  <th className="py-3.5 px-3">대응 및 회복 계획 (Action Plan)</th>
                  <th className="py-3.5 px-3">담당자</th>
                  <th className="py-3.5 px-3 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <ShieldAlert size={36} className="mx-auto text-slate-600 mb-2" />
                      <div className="font-bold text-sm text-slate-300">등록된 Risk / Issue가 없습니다.</div>
                      <div className="text-xs text-slate-500 mt-1">신규 리스크를 등록하거나 필터 옵션을 변경하세요.</div>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-3 space-y-1">
                      <div className="font-mono font-bold text-slate-300">{item.id}</div>
                      <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[10px] ${
                        item.severity === 'Red' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        item.severity === 'Yellow' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-white text-xs">{item.projectName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.projectCode}</div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-[10px] font-bold text-blue-400 uppercase mb-0.5">{item.type}</div>
                      <div className="font-bold text-slate-100 text-sm">{item.title}</div>
                    </td>
                    <td className="py-4 px-3 text-slate-300 max-w-xs leading-relaxed">
                      {item.impact}
                    </td>
                    <td className="py-4 px-3 text-slate-300 max-w-xs leading-relaxed">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-blue-200">
                        {item.countermeasure}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-200">{item.assignee}</div>
                      <div className="text-[10px] text-slate-500">기한: {item.dueDate}</div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for New Risk/Issue */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="text-rose-400" size={20} />
                  신규 Risk / Issue 등록 (Step 06)
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddIssue} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">대상 프로젝트</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {INITIAL_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">구분</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="Risk">Risk (위험 요인)</option>
                      <option value="Issue">Issue (발생 현안)</option>
                      <option value="Escalation">Escalation (경영진 개입)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">위험 등급</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    >
                      <option value="Green" className="text-emerald-400">Green (PM 자체 해결)</option>
                      <option value="Yellow" className="text-amber-400">Yellow (PMO 집중 관리)</option>
                      <option value="Red" className="text-rose-400">Red (경영진 직보고 Escalation)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">리스크/이슈 제목</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 고객사 추가 요건 수용에 따른 개발 공수 부족"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">영향도 (Impact)</label>
                  <textarea
                    rows={2}
                    placeholder="프로젝트 일정, 원가, 품질에 미치는 영향 상세 작성..."
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">대응 및 회복 계획 (Action Plan)</label>
                  <textarea
                    rows={2}
                    placeholder="조치 방안 및 회복 로드맵 상세 입력..."
                    value={newCountermeasure}
                    onChange={(e) => setNewCountermeasure(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    등록 저장
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
