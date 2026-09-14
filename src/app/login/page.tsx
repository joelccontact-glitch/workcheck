'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Crown, 
  Briefcase, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const { loginAsPreset } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      loginAsPreset('ADMIN');
      return;
    }
    loginAsPreset(email);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white font-extrabold shadow-xl shadow-blue-500/25 mb-2">
            <Building2 size={30} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            다음정보시스템즈 <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100 bg-clip-text text-transparent">PMO 운영체계 포털</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            사용자 그룹별(경영진, 프로젝트 PM, 사이트 관리자) 역할에 맞는 독립 계정으로 접속하세요.
          </p>
        </div>

        {/* 1-Click Role-based Preset Account Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>역할별 1-Click 데모 계정 선택</span>
            <span className="text-blue-400 flex items-center gap-1"><Sparkles size={13} /> 원클릭 로그인</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Executive Card */}
            <div className="pmo-card border-amber-900/50 bg-slate-900/90 hover:border-amber-500 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
                    <Crown size={14} /> 👑 경영진
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">ID: kim@daumis.co.kr</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">김철수 전무</h3>
                  <p className="text-xs text-slate-400 font-semibold">경영전략실 총괄</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-amber-400 shrink-0" /> 전사 사업 손익 & 헬스맵 가시화</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-amber-400 shrink-0" /> G1~G6 Gate Review 결재 & 통제</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-amber-400 shrink-0" /> 16종 PM Standard 최종 승인</li>
                </ul>
              </div>

              <button
                onClick={() => loginAsPreset('EXECUTIVE')}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>👑 경영진 로그인</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* 2. PM Card */}
            <div className="pmo-card border-indigo-900/50 bg-slate-900/90 hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
                    <Briefcase size={14} /> 🎯 프로젝트 PM
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">ID: pm.park@daumis.co.kr</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">박민우 수석</h3>
                  <p className="text-xs text-slate-400 font-semibold">SI사업1팀 PM</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400 shrink-0" /> Step 01~07 순차적 데이터 입력</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400 shrink-0" /> 주간 점검표 & Health Score 작성</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400 shrink-0" /> 16종 산출물 업로드 & 자가진단</li>
                </ul>
              </div>

              <button
                onClick={() => loginAsPreset('PM')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>🎯 PM 로그인</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* 3. Site Admin Card */}
            <div className="pmo-card border-purple-900/50 bg-slate-900/90 hover:border-purple-500 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80 text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
                    <ShieldCheck size={14} /> ⚙️ 사이트 관리자
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">ID: pmo@daumis.co.kr</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">김지훈 이사</h3>
                  <p className="text-xs text-slate-400 font-semibold">PMO본부 책임자</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400 shrink-0" /> 전사 계정 생성 & 역할/권한 부여</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400 shrink-0" /> 계정 승인/비활성화/비번 초기화</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400 shrink-0" /> PMO 마스터 템플릿 양식 설정</li>
                </ul>
              </div>

              <button
                onClick={() => loginAsPreset('ADMIN')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>⚙️ 사이트 관리자 로그인</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Email Form */}
        <div className="pmo-card max-w-md mx-auto space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            일반 사용자 계정 로그인
          </div>
          <form onSubmit={handleCustomLogin} className="space-y-3 text-xs">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                placeholder="이메일 주소 (예: user@daumis.co.kr)"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/30"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
