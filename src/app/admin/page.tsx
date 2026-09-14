'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth, Role } from '@/context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  Crown, 
  Briefcase, 
  Search
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  team: string;
  rank: string;
  role: Role;
  assignedProject: string;
  status: '승인완료' | '승인대기';
}

const INITIAL_USERS: SystemUser[] = [
  { id: '1', name: '김철수', email: 'kim@daumis.co.kr', team: '경영전략실', rank: '전무', role: 'EXECUTIVE', assignedProject: '전사 포트폴리오 관제', status: '승인완료' },
  { id: '2', name: '박민우', email: 'pm.park@daumis.co.kr', team: 'SI사업1팀', rank: '수석', role: 'PM', assignedProject: '차세대 금융 시스템 구축', status: '승인완료' },
  { id: '3', name: '이수진', email: 'pm.lee@daumis.co.kr', team: '공공사업팀', rank: '책임', role: 'PM', assignedProject: '공공기관 데이터 통합 포털', status: '승인완료' },
  { id: '4', name: '최현석', email: 'pm.choi@daumis.co.kr', team: '클라우드사업팀', rank: '수석', role: 'PM', assignedProject: 'AI 기반 품질검수 자동화', status: '승인완료' },
  { id: '5', name: '김지훈', email: 'pmo@daumis.co.kr', team: 'PMO본부', rank: '이사', role: 'ADMIN', assignedProject: '시스템 최고 총괄 관리자', status: '승인완료' },
];

export default function AdminPage() {
  const { role, setRole } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.includes(searchTerm) || u.email.includes(searchTerm) || u.team.includes(searchTerm);
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              <ShieldCheck size={14} /> 사이트 관리자 전용 콘솔 (Site Admin Center)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              사용자 계정 & 역할/권한 관리
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              임원, 프로젝트 PM, 시스템 관리자 역할 지정 및 권한 제어
            </p>
          </div>
        </header>

        {/* Role Overview Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="pmo-card border-amber-900/40 bg-amber-950/10 space-y-2">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Crown size={16} /> 👑 임원 (보고 받는 자)</span>
              <span className="text-lg font-black">{users.filter(u => u.role === 'EXECUTIVE').length} 명</span>
            </div>
            <p className="text-xs text-slate-400">전사 포트폴리오 가시화, 리스크 에스컬레이션 및 Gate Review 승인 권한</p>
          </div>

          <div className="pmo-card border-indigo-900/40 bg-indigo-950/10 space-y-2">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Briefcase size={16} /> 🎯 프로젝트 PM (작업자)</span>
              <span className="text-lg font-black">{users.filter(u => u.role === 'PM').length} 명</span>
            </div>
            <p className="text-xs text-slate-400">Step 01~07 프로세스를 거쳐 프로젝트 데이터, 주간점검표, 산출물 등록 권한</p>
          </div>

          <div className="pmo-card border-purple-900/40 bg-purple-950/10 space-y-2">
            <div className="flex items-center justify-between text-purple-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> ⚙️ 사이트 관리자</span>
              <span className="text-lg font-black">{users.filter(u => u.role === 'ADMIN').length} 명</span>
            </div>
            <p className="text-xs text-slate-400">사용자 계정 권한 지정, PMO 마스터 템플릿 양식 관리 및 전체 감사 권한</p>
          </div>
        </div>

        {/* User Search & Filter */}
        <div className="pmo-card space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="이름, 이메일, 부서 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 shrink-0">역할 필터:</span>
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">전체 보기</option>
                <option value="EXECUTIVE">👑 임원 뷰</option>
                <option value="PM">🎯 프로젝트 PM 뷰</option>
                <option value="ADMIN">⚙️ 사이트 관리자</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] bg-slate-900/60">
                  <th className="p-3.5">사용자명 / 직급</th>
                  <th className="p-3.5">이메일</th>
                  <th className="p-3.5">소속 부서</th>
                  <th className="p-3.5">담당 프로젝트</th>
                  <th className="p-3.5">역할(권한) 변경</th>
                  <th className="p-3.5 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300 font-black text-xs">
                        {u.name.substring(0, 1)}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{u.rank}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">{u.email}</td>
                    <td className="p-3.5 text-slate-300">{u.team}</td>
                    <td className="p-3.5 text-slate-300 font-medium">{u.assignedProject}</td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value as Role)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs border focus:outline-none transition-all ${
                          u.role === 'EXECUTIVE' ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' :
                          u.role === 'ADMIN' ? 'bg-purple-950/80 text-purple-300 border-purple-800/60' :
                          'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                        }`}
                      >
                        <option value="EXECUTIVE" className="bg-slate-900 text-amber-300">👑 임원 (보고 받는 자)</option>
                        <option value="PM" className="bg-slate-900 text-indigo-300">🎯 프로젝트 PM (작업자)</option>
                        <option value="ADMIN" className="bg-slate-900 text-purple-300">⚙️ 사이트 관리자 (운영자)</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
                        {u.status}
                      </span>
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
