'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth, Role } from '@/context/AuthContext';
import { getFirebaseUsers, addFirebaseUser, updateFirebaseUser, forceResetAndSeedInitialFirebaseData } from '@/services/firestoreService';
import { 
  Users, 
  ShieldCheck, 
  Crown, 
  Briefcase, 
  Search,
  Plus,
  UserPlus,
  X,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  team: string;
  rank: string;
  role: Role;
  assignedProject: string;
  status: '승인완료' | '승인대기' | '비활성화';
}

const INITIAL_USERS: SystemUser[] = [
  { id: '1', name: '김철수', email: 'kim@daumis.co.kr', team: '경영전략실', rank: '전무', role: 'EXECUTIVE', assignedProject: '전사 포트폴리오 관제', status: '승인완료' },
  { id: '2', name: '박민우', email: 'pm.park@daumis.co.kr', team: 'SI사업1팀', rank: '수석', role: 'PM', assignedProject: '차세대 금융 시스템 구축', status: '승인완료' },
  { id: '3', name: '이수진', email: 'pm.lee@daumis.co.kr', team: '공공사업팀', rank: '책임', role: 'PM', assignedProject: '공공기관 데이터 통합 포털', status: '승인완료' },
  { id: '4', name: '최현석', email: 'pm.choi@daumis.co.kr', team: '클라우드사업팀', rank: '수석', role: 'PM', assignedProject: 'AI 기반 품질검수 자동화', status: '승인완료' },
  { id: '5', name: '김지훈', email: 'pmo@daumis.co.kr', team: 'PMO본부', rank: '이사', role: 'ADMIN', assignedProject: '시스템 최고 총괄 관리자', status: '승인완료' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Permission Guard: non-ADMIN users cannot access Admin Console
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />
        <main className="flex-1 lg:ml-72 p-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 font-bold text-2xl shadow-xl">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">⛔ 접근 권한 제한 (403 Permission Denied)</h2>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            사이트 관리자(슈퍼유저) 계정만 계정 생성, 역할 부여 및 사용자 관리 센터에 진입할 수 있습니다.
          </p>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 inline-block mt-2"
          >
            대시보드 메인으로 돌아가기
          </a>
        </main>
      </div>
    );
  }

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTeam, setNewTeam] = useState('PMO본부');
  const [newRank, setNewRank] = useState('수석');
  const [newRole, setNewRole] = useState<Role>('PM');
  const [newProject, setNewProject] = useState('신규 프로젝트');
  const [newPassword, setNewPassword] = useState('daumis1234!');

  useEffect(() => {
    getFirebaseUsers().then(data => {
      setUsers(data as any || []);
    });
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    await updateFirebaseUser(userId, { role: newRole });
  };

  const handleStatusChange = async (userId: string, newStatus: SystemUser['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    await updateFirebaseUser(userId, { status: newStatus });
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`${name} 사용자 계정을 정말로 삭제하시겠습니까?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUserObj: SystemUser = {
      id: String(Date.now()),
      name: newName,
      email: newEmail,
      team: newTeam,
      rank: newRank,
      role: newRole,
      assignedProject: newProject,
      status: '승인완료'
    };

    setUsers([newUserObj, ...users]);
    await addFirebaseUser(newUserObj as any);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    alert(`[신규 계정 생성 완료]\n• 사용자: ${newName} (${newRole} 권한)\n• 로그인 ID: ${newEmail}\n• 초기 임시 비밀번호: ${newPassword}\n\n계정이 Firebase DB에 정상 등록되었습니다.`);
  };

  const handleResetInitialData = async () => {
    if (confirm('Firebase DB의 모든 컬렉션을 초기 표준 데모 데이터로 재설정하시겠습니까?')) {
      await forceResetAndSeedInitialFirebaseData();
      const freshUsers = await getFirebaseUsers();
      setUsers(freshUsers as any);
      alert('Firebase DB가 초기 표준 데모 데이터로 성공적으로 복원되었습니다.');
    }
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
              사용자 계정 & 역할/권한 부여 시스템
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              신규 계정 생성, 역할(경영진 / PM / 관리자) 지정, 승인/비활성화 통제 및 담당 프로젝트 설정
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetInitialData}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Firebase DB 데이터 초기화 및 데모 데이터 복원"
            >
              <RotateCcw size={16} className="text-amber-400" /> 데이터 복원
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <UserPlus size={18} /> 계정 생성
            </button>
          </div>
        </header>

        {/* Role Overview Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="pmo-card border-amber-900/40 bg-amber-950/10 space-y-2">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Crown size={16} /> 👑 경영진</span>
              <span className="text-lg font-black">{users.filter(u => u.role === 'EXECUTIVE').length} 명</span>
            </div>
            <p className="text-xs text-slate-400">전사 포트폴리오 가시화, 리스크 에스컬레이션 및 Gate Review 승인 권한</p>
          </div>

          <div className="pmo-card border-indigo-900/40 bg-indigo-950/10 space-y-2">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Briefcase size={16} /> 🎯 프로젝트 PM</span>
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
                <option value="EXECUTIVE">👑 경영진 뷰</option>
                <option value="PM">🎯 프로젝트 PM 뷰</option>
                <option value="ADMIN">⚙️ 사이트 관리자</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] bg-slate-900/60 whitespace-nowrap">
                  <th className="p-3.5">사용자명 / 직급</th>
                  <th className="p-3.5">이메일 계정</th>
                  <th className="p-3.5">소속 부서</th>
                  <th className="p-3.5">담당 프로젝트</th>
                  <th className="p-3.5">역할(권한) 지정</th>
                  <th className="p-3.5 text-center">계정 상태</th>
                  <th className="p-3.5 text-center">관리 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                      <Users size={32} className="mx-auto text-slate-600 mb-2" />
                      <div>등록된 사용자 계정이 없습니다.</div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
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
                        <option value="EXECUTIVE" className="bg-slate-900 text-amber-300">👑 경영진</option>
                        <option value="PM" className="bg-slate-900 text-indigo-300">🎯 프로젝트 PM</option>
                        <option value="ADMIN" className="bg-slate-900 text-purple-300">⚙️ 사이트 관리자</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-center">
                      <select
                        value={u.status}
                        onChange={e => handleStatusChange(u.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none ${
                          u.status === '승인완료' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                          u.status === '승인대기' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                          'bg-rose-950 text-rose-400 border-rose-800'
                        }`}
                      >
                        <option value="승인완료">승인완료</option>
                        <option value="승인대기">승인대기</option>
                        <option value="비활성화">비활성화</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                        title="사용자 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add User */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="text-purple-400" size={20} />
                  신규 사용자 계정 생성 & 역할 부여
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">사용자 이름</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 홍길동"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">직급</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 수석, 이사, 전무"
                      value={newRank}
                      onChange={e => setNewRank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">이메일 계정</label>
                  <input
                    type="email"
                    required
                    placeholder="hong@daumis.co.kr"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">소속 부서</label>
                    <input
                      type="text"
                      value={newTeam}
                      onChange={e => setNewTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">부여할 역할 (권한)</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as Role)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    >
                      <option value="EXECUTIVE">👑 경영진</option>
                      <option value="PM">🎯 프로젝트 PM</option>
                      <option value="ADMIN">⚙️ 사이트 관리자</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">담당 프로젝트</label>
                  <input
                    type="text"
                    value={newProject}
                    onChange={e => setNewProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">초기 임시 비밀번호</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    placeholder="daumis1234!"
                  />
                </div>

                {/* Password Policy & Activation Guide Box */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200 space-y-1">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <KeyRound size={13} /> 계정 비밀번호 & 로그인 정책 안내
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    • <strong>상용/실운영 방식</strong>: 생성 시 이메일로 <strong>초대/비밀번호 설정 링크</strong>가 발송되어 사용자가 비밀번호를 직접 설정합니다.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    • <strong>데모 시연 방식</strong>: 초기 비밀번호는 <code className="bg-purple-900/60 px-1 py-0.5 rounded text-amber-300 font-mono">daumis1234!</code>로 설정되며, 이메일만 입력 시 바로 접속할 수 있습니다.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    계정 생성 및 권한 부여
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
