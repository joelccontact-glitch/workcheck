'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, UserCog, Check, X, Loader2, Search, Filter, ShieldAlert, UserCheck } from 'lucide-react';

export default function TeamList() {
  const supabase = createClient();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    if (data) setTeams(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleRoleToggle = async (id: string, currentRoles: string, roleToToggle: string) => {
    // 역할을 쉼표로 구분하여 관리 (예: "ADMIN,USER")
    let roleArray = currentRoles ? currentRoles.split(',').map(r => r.trim()).filter(Boolean) : [];
    
    if (roleArray.includes(roleToToggle)) {
      roleArray = roleArray.filter(r => r !== roleToToggle);
    } else {
      roleArray.push(roleToToggle);
    }

    const newRoleString = roleArray.join(',');
    const { error } = await supabase.from('profiles').update({ role: newRoleString }).eq('id', id);
    
    if (!error) {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, role: newRoleString } : t));
    }
  };

  const filteredTeams = teams.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card animate-in shadow-lg" style={{ padding: '1.5rem', borderRadius: '24px', border: 'none', background: 'white' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>직원 권한 관리 ({teams.length})</h3>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>직원별로 관리자/사용자 권한을 복수로 부여할 수 있습니다.</p>
        </div>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            type="text" placeholder="이름 또는 팀 검색..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}><Loader2 className="animate-spin" color="hsl(var(--primary))" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTeams.map((member) => {
            const roles = member.role ? member.role.split(',') : [];
            const isAdmin = roles.includes('ADMIN');
            const isUser = roles.includes('USER');

            return (
              <div key={member.id} className="glass" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid hsl(var(--border)/0.5)', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: '14px', 
                      backgroundColor: isAdmin ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--muted))', 
                      color: isAdmin ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
                    }}>
                      {member.full_name?.[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>{member.full_name}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isAdmin && <span title="관리자 권한" style={badgeStyle('ADMIN')}><Shield size={10} /> ADMIN</span>}
                          {isUser && <span title="사용자 권한" style={badgeStyle('USER')}><UserCheck size={10} /> USER</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>{member.rank} / {member.team}</div>
                    </div>
                  </div>

                  {/* 권한 토글 스위치 (복수 선택 가능) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'hsl(var(--muted)/0.3)', padding: '0.5rem', borderRadius: '12px' }}>
                    <label style={checkboxLabelStyle}>
                      <input 
                        type="checkbox" 
                        checked={isUser} 
                        onChange={() => handleRoleToggle(member.id, member.role, 'USER')}
                        style={checkboxStyle}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>사용자</span>
                    </label>
                    <div style={{ width: '1px', height: '16px', backgroundColor: 'hsl(var(--border))' }} />
                    <label style={checkboxLabelStyle}>
                      <input 
                        type="checkbox" 
                        checked={isAdmin} 
                        onChange={() => handleRoleToggle(member.id, member.role, 'ADMIN')}
                        style={checkboxStyle}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isAdmin ? 'hsl(var(--primary))' : 'inherit' }}>관리자</span>
                    </label>
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
  fontSize: '0.6rem',
  fontWeight: 800,
  padding: '0.15rem 0.4rem',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  backgroundColor: type === 'ADMIN' ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--success)/0.1)',
  color: type === 'ADMIN' ? 'hsl(var(--primary))' : 'hsl(var(--success))',
  border: `1px solid ${type === 'ADMIN' ? 'hsl(var(--primary)/0.2)' : 'hsl(var(--success)/0.2)'}`
});

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  userSelect: 'none',
  padding: '0 0.5rem'
};

const checkboxStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  accentColor: 'hsl(var(--primary))',
  cursor: 'pointer'
};
