'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { INITIAL_LESSONS_LEARNED, INITIAL_PROJECTS, LessonsLearnedItem } from '@/utils/pmoData';
import { getFirebaseLessonsLearned, addFirebaseLessonLearned } from '@/services/firestoreService';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  X,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function LessonsLearnedPage() {
  const [items, setItems] = useState<LessonsLearnedItem[]>(INITIAL_LESSONS_LEARNED);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Item Form State
  const [selectedProjectId, setSelectedProjectId] = useState('3');
  const [newCategory, setNewCategory] = useState<LessonsLearnedItem['category']>('요구사항');
  const [newType, setNewType] = useState<LessonsLearnedItem['type']>('실패사례');
  const [newTitle, setNewTitle] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newGuide, setNewGuide] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.includes(searchTerm) || item.causeAnalysis.includes(searchTerm) || item.preventionGuide.includes(searchTerm);
    const matchesCat = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesType = selectedType === '전체' || item.type === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  useEffect(() => {
    getFirebaseLessonsLearned().then(data => {
      setItems(data || []);
    });
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCause || !newGuide) return;

    const proj = INITIAL_PROJECTS.find(p => p.id === selectedProjectId) || INITIAL_PROJECTS[0];

    const newItem: LessonsLearnedItem = {
      id: `L-00${items.length + 1}`,
      projectCode: proj.code,
      projectName: proj.name,
      category: newCategory,
      type: newType,
      title: newTitle,
      causeAnalysis: newCause,
      preventionGuide: newGuide
    };

    setItems([newItem, ...items]);
    await addFirebaseLessonLearned(newItem);
    setIsModalOpen(false);
    setNewTitle('');
    setNewCause('');
    setNewGuide('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Project DB & Lessons Learned Repository
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="text-indigo-400" size={28} />
              Lessons Learned 및 Project DB 지식 검색기
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              보고서 13페이지 Project DB: 성공/실패 사례 축적 및 유사 프로젝트 리스크 사전 예측
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Plus size={18} /> 신규 Lessons Learned 등록
          </button>
        </header>

        {/* Goal Banner (PDF Page 13 Goal) */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
          <strong className="text-indigo-300 text-sm font-bold block">최종 목표:</strong>
          <p className="text-slate-300">
            &quot;우리 회사가 어떤 프로젝트에서 돈을 벌고, 어떤 조건에서 위험해지는지&quot;를 데이터로 설명하고 재활용할 수 있는 지식 체계를 구축합니다.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="제목, 원인분석, 예방 가이드 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Filter size={14} /> 카테고리:
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', '일정', '원가', '품질', '요구사항', '인력', '고객/계약'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-slate-400 font-semibold ml-2">
                사례 구분:
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {['전체', '성공사례', '실패사례'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Learned List Cards */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="pmo-card p-12 text-center space-y-3">
              <BookOpen size={40} className="mx-auto text-slate-600" />
              <h3 className="text-lg font-bold text-slate-300">축적된 Lessons Learned 사례가 없습니다</h3>
              <p className="text-xs text-slate-400">신규 사례를 등록하거나 검색 필터 조건을 변경해주세요.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
            <div key={item.id} className="pmo-card pmo-card-hover space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400">{item.id}</span>
                    <span className="text-xs font-semibold text-slate-400">{item.projectName} ({item.projectCode})</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-semibold text-[10px]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border shrink-0 ${
                  item.type === '성공사례'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-rose-400 font-bold block">원인 분석 (Cause Analysis):</strong>
                  <p className="text-slate-300 leading-relaxed">{item.causeAnalysis}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 font-bold block">재발 방지 가이드 (Prevention Guide):</strong>
                  <p className="text-slate-300 leading-relaxed">{item.preventionGuide}</p>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* New Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="pmo-card max-w-lg w-full bg-slate-900 border-slate-800 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-400" /> 신규 Lessons Learned 등록
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 text-xs">
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
                    <label className="block text-slate-300 font-semibold mb-1">카테고리</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {['일정', '원가', '품질', '요구사항', '인력', '고객/계약'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">사례 구분</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="성공사례">성공사례</option>
                      <option value="실패사례">실패사례</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">제목</label>
                  <input
                    type="text"
                    required
                    placeholder="교훈 제목"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">원인 분석</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="발생 원인 분석"
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">재발 방지 가이드</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="향후 프로젝트 적용 표준 가이드"
                    value={newGuide}
                    onChange={(e) => setNewGuide(e.target.value)}
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
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                  >
                    Lessons Learned 등록
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
