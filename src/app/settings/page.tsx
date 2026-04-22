'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Tablet, Moon, Check, X, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const { user, loading, role, refreshProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTeam, setEditTeam] = useState('');
  const [editRank, setEditRank] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditTeam(user.team);
      setEditRank(user.rank);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100%' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid hsl(var(--primary))', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editName,
        team: editTeam,
        rank: editRank
      })
      .eq('id', user.id);

    if (!error) {
      await refreshProfile();
      setIsEditing(false);
    } else {
      alert('저장 중 오류가 발생했습니다: ' + error.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1rem' }}>
          <header style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>환경 설정</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>개인 프로필 및 앱 알림 설정을 관리합니다.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '24px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
                    {editName.substring(0, 1)}
                  </div>
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '300px' }}>
                        <input 
                          type="text" value={editName} onChange={e => setEditName(e.target.value)} 
                          style={inputStyle} placeholder="이름" 
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="text" value={editTeam} onChange={e => setEditTeam(e.target.value)} style={inputStyle} placeholder="팀" />
                          <input type="text" value={editRank} onChange={e => setEditRank(e.target.value)} style={inputStyle} placeholder="직급" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h3>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem' }}>{user.team} / {user.rank}</p>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isEditing ? (
                      <>
                        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                          {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} 저장
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                          <X size={16} /> 취소
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>프로필 수정</button>
                    )}
                  </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <SettingItem icon={<Bell size={18} />} title="푸시 알림" description="출퇴근 시간 및 결재 승인 알림을 받습니다." toggle />
                <SettingItem icon={<Tablet size={18} />} title="기기 생체 설정" description="로그인 및 출퇴근 시 생체인증을 사용합니다." toggle />
                <SettingItem icon={<Moon size={18} />} title="다크 모드" description="시스템 다크 모드 설정을 따릅니다." toggle />
              </div>
            </div>

            <div className="card" style={{ border: '1px solid hsl(var(--destructive) / 0.2)' }}>
              <h3 style={{ fontSize: '1rem', color: 'hsl(var(--destructive))', marginBottom: '1rem' }}>계정 관리</h3>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>계정 탈퇴 시 모든 근무 기록이 삭제되며 복구할 수 없습니다.</p>
              <button 
                onClick={signOut}
                className="btn btn-outline" style={{ color: 'hsl(var(--destructive))', borderColor: 'hsl(var(--destructive) / 0.3)' }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', 
  border: '1px solid hsl(var(--border))', outline: 'none', fontSize: '0.875rem'
};

function SettingItem({ icon, title, description, toggle = false }: { icon: React.ReactNode, title: string, description: string, toggle?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'hsl(var(--muted) / 0.2)' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ color: 'hsl(var(--muted-foreground))' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{description}</div>
        </div>
      </div>
      {toggle && (
        <div style={{ 
          width: '36px', 
          height: '20px', 
          borderRadius: '10px', 
          backgroundColor: 'hsl(var(--primary))',
          position: 'relative'
        }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px' }} />
        </div>
      )}
    </div>
  );
}
