'use client';

import React, { useEffect, useState } from 'react';
import { User, MapPin, Clock, Search, Trash2, Loader2, MailCheck } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  rank: string;
  status: string;
  last_sign_in: string | null;
  verified: boolean;
}

export default function TeamList() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setTeam(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} 사원을 삭제하시겠습니까?`)) return;
    
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeam(team.filter(m => m.id !== id));
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  const filteredTeam = team.filter(m => 
    m.name.includes(searchTerm) || m.email.includes(searchTerm)
  );

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>팀원 현황 (실시간)</h3>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            type="text" 
            placeholder="팀원 검색..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              padding: '0.4rem 0.75rem 0.4rem 2rem', 
              fontSize: '0.75rem', 
              borderRadius: 'var(--radius)',
              border: '1px solid hsl(var(--border))',
              outline: 'none',
              backgroundColor: 'hsl(var(--background))'
            }} 
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}>
          <Loader2 className="animate-spin" size={24} color="hsl(var(--primary))" />
        </div>
      ) : filteredTeam.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>
          검색된 팀원이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTeam.map((member) => (
            <div key={member.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem', 
              borderRadius: 'var(--radius)', 
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              border: '1px solid hsl(var(--border) / 0.5)'
            }}>
              <div className="flex-center" style={{ 
                width: 40, height: 40, borderRadius: '12px', 
                backgroundColor: member.verified ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted))',
                color: member.verified ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                marginRight: '1rem'
              }}>
                <User size={20} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {member.name} 
                  {member.verified && <MailCheck size={14} color="hsl(var(--success))" />}
                  <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{member.rank}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                    {member.email}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                    접속: {member.last_sign_in ? new Date(member.last_sign_in).toLocaleDateString() : '미기록'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.7rem', 
                  fontWeight: 600,
                  backgroundColor: member.verified ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--destructive) / 0.1)',
                  color: member.verified ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
                }}>
                  {member.verified ? '인증완료' : '인증대기'}
                </div>
                <button 
                  onClick={() => handleDelete(member.id, member.name)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
