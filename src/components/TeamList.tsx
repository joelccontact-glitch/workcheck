'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, UserCog, Check, X, Loader2, Search, Filter } from 'lucide-react';

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

  const handleUpdate = async (id: string, updates: any) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchTeams();
    }
  };

  const filteredTeams = teams.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card animate-in" style={{ padding: '1.5rem' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>전체 팀원 관리 ({teams.length})</h3>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            type="text" placeholder="이름 또는 팀 검색..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '0.875rem' }}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex-center" style={{ height: '200px' }}><Loader2 className="animate-spin" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTeams.map((member) => (
            <div key={member.id} className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid hsl(var(--border)/0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: member.role === 'ADMIN' ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--muted))', color: member.role === 'ADMIN' ? 'hsl(var(--primary))' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {member.full_name?.[0]}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>{member.full_name}</span>
                      {member.role === 'ADMIN' && <Shield size={12} color="hsl(var(--primary))" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{member.rank} | {member.team}</div>
                  </div>
                </div>

                {editingId === member.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select 
                      defaultValue={member.role}
                      onChange={(e) => handleUpdate(member.id, { role: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button onClick={() => setEditingId(null)} className="btn btn-outline" style={{ padding: '0.4rem' }}><X size={16} /></button>
                  </div>
                ) : (
                  <button onClick={() => setEditingId(member.id)} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.75rem', gap: '0.4rem' }}>
                    <UserCog size={14} /> 관리
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: '0.4rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.75rem', fontWeight: 600
};
