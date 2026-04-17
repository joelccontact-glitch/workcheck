'use client';

import React from 'react';
import { Settings, MapPin, Shield, Save, Loader2, Plus, Trash2, Crosshair, History as HistoryIcon } from 'lucide-react';
import { DEFAULT_WORK_ZONE, WorkZone } from '@/utils/geoUtils';
import { useGeolocation } from '@/hooks/useGeolocation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { role } = useAuth();
  const router = useRouter();
  const { coords, loading: locLoading } = useGeolocation();
  
  const [zones, setZones] = React.useState<WorkZone[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (role === 'USER') {
      alert('관리자 권한이 필요합니다.');
      router.push('/');
    }
    const saved = localStorage.getItem('work-zones');
    if (saved) {
      setZones(JSON.parse(saved));
    } else {
      setZones([DEFAULT_WORK_ZONE]);
    }
  }, [role, router]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('work-zones', JSON.stringify(zones));
    setTimeout(() => {
      setIsSaving(false);
      alert('근무지 설정이 저장되었습니다.');
      window.dispatchEvent(new Event('zone-updated'));
    }, 500);
  };

  const addZone = () => {
    const newZone: WorkZone = {
      id: Date.now().toString(),
      name: `새 근무지 ${zones.length + 1}`,
      latitude: coords?.latitude || DEFAULT_WORK_ZONE.latitude,
      longitude: coords?.longitude || DEFAULT_WORK_ZONE.longitude,
      radius: 200
    };
    setZones([...zones, newZone]);
  };

  const updateZone = (id: string, updates: Partial<WorkZone>) => {
    setZones(zones.map(z => z.id === id ? { ...z, ...updates } : z));
  };

  const deleteZone = (id: string) => {
    if (zones.length === 1) {
      alert('최소 하나의 근무지는 등록되어야 합니다.');
      return;
    }
    setZones(zones.filter(z => z.id !== id));
  };

  const setAsCurrent = (id: string) => {
    if (!coords) {
      alert('위치 정보를 가져올 수 없습니다.');
      return;
    }
    updateZone(id, { latitude: coords.latitude, longitude: coords.longitude });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '1rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>관리 시스템 설정</h1>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>복수 근무지 관리 및 보안 정책을 설정합니다.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-outline"
                style={{ backgroundColor: 'white' }}
                onClick={() => alert('지난 1년간의 근무지 변경 이력을 다운로드합니다.')}
              >
                <HistoryIcon size={18} /> 기록 보전 (1년)
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                설정 저장
              </button>
            </div>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Multi-Work Zone Section */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                    <MapPin size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem' }}>등록된 근무지 목록</h3>
                </div>
                <button className="btn btn-outline" onClick={addZone} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <Plus size={16} /> 근무지 추가
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {zones.map((zone) => (
                  <div key={zone.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>근무지 명칭</label>
                          <input 
                            type="text" 
                            value={zone.name} 
                            onChange={e => updateZone(zone.id, { name: e.target.value })}
                            style={inputStyle}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={labelStyle}>반경(m)</label>
                          <input 
                            type="number" 
                            value={zone.radius} 
                            onChange={e => updateZone(zone.id, { radius: parseInt(e.target.value) })}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteZone(zone.id)}
                        style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                      <div>
                        <label style={labelStyle}>위도 (Latitude)</label>
                        <input 
                          type="number" 
                          value={zone.latitude} 
                          onChange={e => updateZone(zone.id, { latitude: parseFloat(e.target.value) })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>경도 (Longitude)</label>
                        <input 
                          type="number" 
                          value={zone.longitude} 
                          onChange={e => updateZone(zone.id, { longitude: parseFloat(e.target.value) })}
                          style={inputStyle}
                        />
                      </div>
                      <button 
                        className="btn btn-outline"
                        onClick={() => setAsCurrent(zone.id)}
                        disabled={locLoading}
                        style={{ height: '2.5rem', padding: '0 0.75rem' }}
                        title="현재 위치로 설정"
                      >
                        <Crosshair size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Section */}
            <section className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: '1.125rem' }}>보안 및 데이터 정책</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <ToggleItem label="자동 근무지 기록 보전 활성화" description="근무지 변경 및 출퇴근 기록을 1년간 의무 보존합니다." checked />
                 <ToggleItem label="GPS 위변조 실시간 차단" description="비정상적인 위치 신호 감지 시 출퇴근을 즉시 차단합니다." checked />
                 <ToggleItem label="등록되지 않은 장소 알림" description="근무지 밖에서 앱 실행 시 푸시 알림을 발송합니다." />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'hsl(var(--muted-foreground))',
  marginBottom: '0.4rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em'
};

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--background))',
  outline: 'none',
  fontSize: '0.875rem',
  transition: 'border-color 0.2s'
};

function ToggleItem({ label, description, checked = false }: { label: string, description?: string, checked?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{description}</div>}
      </div>
      <div style={{ 
        width: '40px', 
        height: '22px', 
        borderRadius: '11px', 
        backgroundColor: checked ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
        position: 'relative',
        cursor: 'pointer'
      }}>
        <div style={{ 
          width: '18px', 
          height: '18px', 
          borderRadius: '50%', 
          backgroundColor: 'white', 
          position: 'absolute', 
          top: '2px', 
          left: checked ? '20px' : '2px',
          transition: 'all 0.2s'
        }} />
      </div>
    </div>
  );
}
