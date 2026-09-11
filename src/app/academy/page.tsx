'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { INITIAL_PM_PROFILES, PMProfile } from '@/utils/pmoData';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  User, 
  Sliders, 
  Calculator, 
  HelpCircle, 
  ChevronRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function AcademyPage() {
  const [pmProfiles] = useState<PMProfile[]>(INITIAL_PM_PROFILES);
  const [selectedPmId, setSelectedPmId] = useState<string>('3'); // 박준호 차장

  // 100 Pt Evaluation Inputs for Selected PM
  const [evalSchedule, setEvalSchedule] = useState(16); // 20
  const [evalCost, setEvalCost] = useState(12);         // 15
  const [evalQuality, setEvalQuality] = useState(12);      // 15
  const [evalClient, setEvalClient] = useState(12);       // 15
  const [evalResource, setEvalResource] = useState(8);    // 10
  const [evalRisk, setEvalRisk] = useState(8);          // 10
  const [evalReport, setEvalReport] = useState(8);        // 10
  const [evalSharing, setEvalSharing] = useState(4);      // 5

  const totalScore = evalSchedule + evalCost + evalQuality + evalClient + evalResource + evalRisk + evalReport + evalSharing;

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'S';
  if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else grade = 'D';

  const academyWeeks = [
    { week: 1, topic: 'PM 기본원칙', practice: 'Project Charter 작성' },
    { week: 2, topic: 'WBS / 일정', practice: '실제 프로젝트 WBS 작성' },
    { week: 3, topic: '요구사항 / 변경', practice: 'Change Request (CR) 실습' },
    { week: 4, topic: '원가 / 공수', practice: '공수·손익 시뮬레이션' },
    { week: 5, topic: 'Risk / Issue', practice: 'Risk Register 수립' },
    { week: 6, topic: '품질 / 테스트', practice: 'Defect/Quality Plan 작성' },
    { week: 7, topic: '고객 / 갈등관리', practice: '상황별 Role Play' },
    { week: 8, topic: '경영진 보고', practice: '1-page Executive Report' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              PM Academy & Competency Certification
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Award className="text-amber-400" size={28} />
              PM Academy 및 PM 역량 평가 체계
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              보고서 10페이지 PM Academy 8주 교육 및 11페이지 PM 100점 평가표 양식
            </p>
          </div>
        </header>

        {/* PM Competency Levels Table (PDF Page 10 Format) */}
        <div className="pmo-card space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-400" />
            PM 역량 등급 및 승급 기준 (Levels)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-extrabold text-blue-300 text-sm">PM Candidate</div>
              <div className="text-slate-400">대상: 예비 PM / PL</div>
              <div className="text-slate-300">핵심역량: WBS·이슈·회의·고객 기본</div>
              <div className="text-blue-400 font-semibold">승급기준: 교육 + PL 경험</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-extrabold text-emerald-400 text-sm">PM Level 1</div>
              <div className="text-slate-400">대상: 일반 PM</div>
              <div className="text-slate-300">핵심역량: 일정·원가·품질·요구사항</div>
              <div className="text-emerald-400 font-semibold">승급기준: 프로젝트 1건 종료</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-extrabold text-amber-400 text-sm">PM Level 2</div>
              <div className="text-slate-400">대상: Senior PM</div>
              <div className="text-slate-300">핵심역량: 리스크·계약·고객갈등·회복</div>
              <div className="text-amber-400 font-semibold">승급기준: 복수 프로젝트/우수평가</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-extrabold text-violet-400 text-sm">PM Level 3</div>
              <div className="text-slate-400">대상: Principal PM</div>
              <div className="text-slate-300">핵심역량: 대형/복합사업·경영진 대응</div>
              <div className="text-violet-400 font-semibold">승급기준: 전사 PM Mentor</div>
            </div>
          </div>
        </div>

        {/* 8-Week Recommended PM Academy Curriculum */}
        <div className="pmo-card space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-400" />
            권장 8주 PM Academy 커리큘럼 및 실습
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {academyWeeks.map((item) => (
              <div key={item.week} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 text-xs">{item.week}주차</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">실습</span>
                </div>
                <div className="font-bold text-white">{item.topic}</div>
                <div className="text-slate-400 text-[11px]">{item.practice}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PM 100 Pt Evaluation Form (PDF Page 11 Format) */}
        <div className="pmo-card space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator size={20} className="text-amber-400" />
                PM 평가표 (100점 만점)
              </h3>
              <p className="text-xs text-slate-400">
                평가 원칙: 프로젝트 결과만 평가하지 않고, 문제 발생 시 조기 발견/투명 보고/회복 능력을 종합 평가함
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="text-xs text-slate-400">
                평가 점수: <strong className="text-white text-base">{totalScore}점</strong> / 100점
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                grade === 'S' || grade === 'A'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : grade === 'B'
                  ? 'bg-blue-950 text-blue-400 border-blue-800'
                  : 'bg-rose-950 text-rose-400 border-rose-800'
              }`}>
                등급: {grade} 등급
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>1. 일정 관리 (배점 20점)</span>
                <span className="text-blue-400">{evalSchedule}점</span>
              </div>
              <input 
                type="range" min="0" max="20" value={evalSchedule} 
                onChange={(e) => setEvalSchedule(parseInt(e.target.value))} 
                className="w-full accent-blue-500" 
              />
              <div className="text-[11px] text-slate-400">기준일정 관리, 지연예측, 회복조치</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>2. 수익성 / 원가 (배점 15점)</span>
                <span className="text-blue-400">{evalCost}점</span>
              </div>
              <input 
                type="range" min="0" max="15" value={evalCost} 
                onChange={(e) => setEvalCost(parseInt(e.target.value))} 
                className="w-full accent-blue-500" 
              />
              <div className="text-[11px] text-slate-400">공수통제, 추가비용 예방, 손익관리</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>3. 품질 관리 (배점 15점)</span>
                <span className="text-blue-400">{evalQuality}점</span>
              </div>
              <input 
                type="range" min="0" max="15" value={evalQuality} 
                onChange={(e) => setEvalQuality(parseInt(e.target.value))} 
                className="w-full accent-blue-500" 
              />
              <div className="text-[11px] text-slate-400">결함 예방, 품질활동, 오픈 안정성</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>4. 고객 관리 (배점 15점)</span>
                <span className="text-blue-400">{evalClient}점</span>
              </div>
              <input 
                type="range" min="0" max="15" value={evalClient} 
                onChange={(e) => setEvalClient(parseInt(e.target.value))} 
                className="w-full accent-blue-500" 
              />
              <div className="text-[11px] text-slate-400">고객 커뮤니케이션, 갈등·협상</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
