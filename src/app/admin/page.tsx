'use client';

import React from 'react';
import { Settings, MapPin, Shield, Save, Loader2 } from 'lucide-react';
import { DEFAULT_WORK_ZONE, WorkZone } from '@/utils/geoUtils';
import { useGeolocation } from '@/hooks/useGeolocation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { role } = useAuth();
  const router = useRouter();
  const { coords, loading: locLoading } = useGeolocation();
  const [zone, setZone] = React.useState<WorkZone>(DEFAULT_WORK_ZONE);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (role === 'USER') {
      alert('관리자 권한이 필요합니다.');
      router.push('/');
    }
    const saved = localStorage.getItem('work-zone');
    if (saved) setZone(JSON.parse(saved));
  }, [role, router]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('work-zone', JSON.stringify(zone));
    setTimeout(() => {
      setIsSaving(false);
      alert('설정이 저장되었습니다.');
      window.dispatchEvent(new Event('zone-updated'));
    }, 500);
  };

  const setAsCurrent = () => {
    if (!coords) {
      alert('위치 정보를 가져올 수 없습니다. 브라우저 권한을 확인해 주세요.');
      return;
    }
    setZone({
      ...zone,
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1rem' }}>
          <header style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>관리자 설정</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>사내 프로젝트 근무지 및 보안 설정을 관리합니다.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Work Zone Detail */}
            <section className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                    <MapPin size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem' }}>근무지 설정 (Work Zone)</h3>
                </div>
                <button 
                  className="btn btn-outline" 
                  onClick={setAsCurrent}
                  disabled={locLoading}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                >
                  {locLoading ? '위치 확인 중...' : '현재 위치로 설정'}
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>근무지 명칭</label>
                  <input 
                    type="text" 
                    value={zone.name} 
                    onChange={e => setZone({...zone, name: e.target.value})}
                    style={inputStyle} 
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>위도 (Latitude)</label>
                    <input 
                      type="number" 
                      value={zone.latitude} 
                      onChange={e => setZone({...zone, latitude: parseFloat(e.target.value)})}
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>경도 (Longitude)</label>
                    <input 
                      type="number" 
                      value={zone.longitude} 
                      onChange={e => setZone({...zone, longitude: parseFloat(e.target.value)})}
                      style={inputStyle} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>허용 반경 (Meters)</label>
                  <input 
                    type="number" 
                    value={zone.radius} 
                    onChange={e => setZone({...zone, radius: parseInt(e.target.value)})}
                    style={inputStyle} 
                  />
                </div>
              </div>
            </section>

            {/* Security / GPS settings */}
            <section className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: '1.125rem' }}>보안 및 인증 설정</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <ToggleItem label="GPS 위변조 방지 활성화" checked />
                 <ToggleItem label="Wi-Fi SSID 확인 병행" description="사내 Wi-Fi 연결 여부를 추가로 체크합니다." />
                 <ToggleItem label="대리 출석 방지 (생체인증)" description="출퇴근 시 기기 생체인증을 요구합니다." />
              </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline">취소</button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                설정 저장하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.625rem 1rem',
  borderRadius: 'var(--radius)',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  outline: 'none',
  fontSize: '0.875rem'
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
