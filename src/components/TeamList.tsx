'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, UserCog, Check, X, Loader2, Search, Save, UserCheck, AlertCircle } from 'lucide-react';

export default function TeamList() {
  const supabase = createClient();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // 로딩 세이프티: 7초 후에도 반응 없으면 로딩 강제 종료
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('서버 응답 시간이 초과되었습니다.');
    }, 7000);

    try {
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (dbError) throw dbError;

      if (data) {
        setTeams(data.map((t: any) => ({
          ...t,
          roleList: t.role ? t.role.split(',').map((r: string) => r.trim()).filter(Boolean) : ['USER']
        })));
      }
    } catch (err: any) {
      console.error('[TeamList] Fetch error:', err);
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCheckRole = (id: string, roleToToggle: string) => {
    setTeams(prev => prev.map((t: any) => {
      if (t.id === id) {
        const current = [...t.roleList];
        const next = current.includes(roleToToggle)
          ? current.filter(r => r !== roleToToggle)
          : [...current, roleToToggle];
        return { ...t, roleList: next.length > 0 ? next : ['USER'] };
      }
      return t;
    }));
  };

  const handleSaveRole = async (id: string, roleList: string[]) => {
    setSavingId(id);
    const roleString = roleList.join(',');
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: roleString })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // 상태 업데이트
      setTeams(prev => prev.map(t => t.id === id ? { ...t, role: roleString } : t));
    } catch (err: any) {
      alert('저장 실패: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setTimeout(() => setSavingId(null), 500);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card animate-in shadow-xl" style={{ padding: '1.5rem', borderRadius: '28px', border: 'none', background: 'white', minHeight: '400px' }}>
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
        <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 className="animate-spin" color="hsl(var(--primary))" size={40} />
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>팀원 정보를 불러오고 있습니다...</p>
        </div>
      ) : error ? (
        <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'hsl(var(--destructive))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={48} />
            <p style={{ fontWeight: 700 }}>{error}</p>
          </div>
          <button onClick={() => fetchTeams()} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>다시 시도하기</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredTeams.length === 0 ? (
            <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--muted-foreground))' }}>검색 결과가 없거나 팀원이 존재하지 않습니다.</div>
          ) : (
            filteredTeams.map((member) => {
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
                          display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '90px', justifyContent: 'center'
                        }}
                      >
                        {savingId === member.id ? <><Check size={16} /> 완료</> : <><Save size={16} /> 저장</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
  border: `1px solid ${type === 'ADMIN' ? 'hsl(var(--primary)/0.3)' : 'hsl(var(--success)/0.3)}`
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
