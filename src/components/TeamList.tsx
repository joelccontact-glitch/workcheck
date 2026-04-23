'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, UserCog, Check, X, Loader2, Search, Save, UserCheck, AlertCircle } from 'lucide-react';

export default function TeamList() {
  const supabase = createClient();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    if (data) {
      // 초기 역할 데이터를 배열 형태로 가공하여 상태 관리
      setTeams(data.map((t: any) => ({
        ...t,
        roleList: t.role ? t.role.split(',').map((r: string) => r.trim()).filter(Boolean) : ['USER']
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // 로컬 상태만 변경 (체크박스 클릭 시)
  const handleCheckRole = (id: string, roleToToggle: string) => {
    setTeams(prev => prev.map((t: any) => {
      if (t.id === id) {
        const current = [...t.roleList];
        const next = current.includes(roleToToggle)
          ? current.filter(r => r !== roleToToggle)
          : [...current, roleToToggle];
        return { ...t, roleList: next.length > 0 ? next : ['USER'] }; // 최소 하나의 권한은 유지
      }
      return t;
    }));
  };

  // 실제 DB에 저장
  const handleSaveRole = async (id: string, roleList: string[]) => {
    setSavingId(id);
    const roleString = roleList.join(',');
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: roleString })
      .eq('id', id);
    
    if (error) {
      alert('권한 저장 중 오류가 발생했습니다: ' + error.message);
    } else {
      // 저장 성공 시 피드백을 위해 잠시 대기 후 상태 해제
      setTimeout(() => setSavingId(null), 500);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card animate-in shadow-xl" style={{ padding: '1.5rem', borderRadius: '28px', border: 'none', background: 'white' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCog size={24} color="hsl(var(--primary))" /> 직원 권한 통합 관리 ({teams.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
            체크박스로 권한을 선택한 후 <span style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>'저장'</span> 버튼을 눌러주세요.
          </p>
        </div>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            type="text" placeholder="이름 또는 부서 검색..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '14px', border: '1px solid hsl(var(--border))', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}><Loader2 className="animate-spin" color="hsl(var(--primary))" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredTeams.map((member) => {
            const isAdmin = member.roleList.includes('ADMIN');
            const isUser = member.roleList.includes('USER');

            return (
              <div key={member.id} className="glass" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid hsl(var(--border)/0.4)', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: '16px', 
                      backgroundColor: isAdmin ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--muted)/0.3)', 
                      color: isAdmin ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem'
                    }}>
                      {member.full_name?.[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>{member.full_name}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isAdmin && <span style={badgeStyle('ADMIN')}><Shield size={10} /> 관리자</span>}
                          {isUser && <span style={badgeStyle('USER')}><UserCheck size={10} /> 사용자</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>{member.rank} / {member.team}</div>
                    </div>
                  </div>

                  {/* 권한 선택 및 저장 영역 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'hsl(var(--muted)/0.2)', padding: '0.625rem 1.25rem', borderRadius: '14px' }}>
                      <label style={checkboxLabelStyle}>
                        <input 
                          type="checkbox" 
                          checked={isUser} 
                          onChange={() => handleCheckRole(member.id, 'USER')}
                          style={checkboxStyle}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>사용자</span>
                      </label>
                      <div style={{ width: '1px', height: '20px', backgroundColor: 'hsl(var(--border))' }} />
                      <label style={checkboxLabelStyle}>
                        <input 
                          type="checkbox" 
                          checked={isAdmin} 
                          onChange={() => handleCheckRole(member.id, 'ADMIN')}
                          style={checkboxStyle}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isAdmin ? 'hsl(var(--primary))' : 'inherit' }}>관리자</span>
                      </label>
                    </div>

                    <button 
                      onClick={() => handleSaveRole(member.id, member.roleList)}
                      disabled={savingId === member.id}
                      className="btn"
                      style={{ 
                        padding: '0.625rem 1.25rem', borderRadius: '12px', 
                        backgroundColor: savingId === member.id ? 'hsl(var(--success))' : 'hsl(var(--primary))',
                        color: 'white', fontWeight: 700, fontSize: '0.875rem', border: 'none',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '90px', justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    >
                      {savingId === member.id ? <><Check size={16} /> 완료</> : <><Save size={16} /> 저장</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const badgeStyle = (type: string) => ({
  fontSize: '0.65rem',
  fontWeight: 800,
  padding: '0.2rem 0.5rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: type === 'ADMIN' ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--success)/0.1)',
  color: type === 'ADMIN' ? 'hsl(var(--primary))' : 'hsl(var(--success))',
  border: `1px solid ${type === 'ADMIN' ? 'hsl(var(--primary)/0.3)' : 'hsl(var(--success)/0.3)'}`
});

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
  cursor: 'pointer',
  userSelect: 'none'
};

const checkboxStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  accentColor: 'hsl(var(--primary))',
  cursor: 'pointer'
};
