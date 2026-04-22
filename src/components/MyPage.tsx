'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { User, Mail, Building, Shield, Bell, LogOut, Smartphone, Key, Save, Loader2, Edit3, Clock } from 'lucide-react';

export default function MyPage() {
  const { user, role, signOut, refreshProfile } = useAuth();
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    team: user?.team || '',
    rank: user?.rank || '',
    work_start_time: user?.work_start_time || '09:00:00',
    work_end_time: user?.work_end_time || '18:00:00',
  });

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        team: formData.team,
        rank: formData.rank,
        work_start_time: formData.work_start_time,
        work_end_time: formData.work_end_time,
      })
      .eq('id', user.id);

    if (!error) {
      await refreshProfile();
      setIsEditing(false);
    } else {
      alert('오류가 발생했습니다: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.6) 100%)', opacity: 0.1 }} />
        
        <div style={{ position: 'relative' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '4px solid white', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}>
            {user.name[0]}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px', margin: '0 auto' }}>
              <input 
                value={formData.full_name} 
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                style={editInputStyle} placeholder="실명"
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  value={formData.team} 
                  onChange={e => setFormData({...formData, team: e.target.value})}
                  style={editInputStyle} placeholder="부서"
                />
                <input 
                  value={formData.rank} 
                  onChange={e => setFormData({...formData, rank: e.target.value})}
                  style={editInputStyle} placeholder="직급"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{user.name}</h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{user.rank} | {user.team}</p>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <span style={{ padding: '6px 14px', borderRadius: '2rem', backgroundColor: 'hsl(var(--muted))', fontSize: '0.8rem', fontWeight: 600 }}>사원번호: 20240401</span>
            <span style={{ padding: '6px 14px', borderRadius: '2rem', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))', fontSize: '0.8rem', fontWeight: 600 }}>{role}</span>
          </div>
        </div>

        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
          className={isEditing ? "btn btn-primary" : "btn btn-outline"}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : isEditing ? <><Save size={18} /> 저장</> : <><Edit3 size={18} /> 수정</>}
        </button>
      </div>

      {/* Info Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> 근무 시간 설정
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>근무 시작 시간</label>
              <input 
                type="time" disabled={!isEditing}
                value={formData.work_start_time}
                onChange={e => setFormData({...formData, work_start_time: e.target.value})}
                style={isEditing ? activeInputStyle : disabledInputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>근무 종료 시간</label>
              <input 
                type="time" disabled={!isEditing}
                value={formData.work_end_time}
                onChange={e => setFormData({...formData, work_end_time: e.target.value})}
                style={isEditing ? activeInputStyle : disabledInputStyle}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} /> 보안 및 계정
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <InfoItem icon={<Mail size={16} />} label="이메일" value={user.email} />
             <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <button className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '0.75rem', width: '100%' }}>
                 <Key size={16} /> 비밀번호 변경
               </button>
               <button onClick={signOut} className="btn" style={{ justifyContent: 'flex-start', gap: '0.75rem', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', border: 'none' }}>
                 <LogOut size={16} /> 로그아웃
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ color: 'hsl(var(--muted-foreground))' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>{label}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' };
const activeInputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid hsl(var(--primary))', outline: 'none', fontSize: '1rem', fontWeight: 700 };
const disabledInputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted)/0.3)', outline: 'none', fontSize: '1rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' };
const editInputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid hsl(var(--primary))', outline: 'none', fontSize: '1.125rem', fontWeight: 700, textAlign: 'center' };
