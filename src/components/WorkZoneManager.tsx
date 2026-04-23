'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MapPin, Wifi, Globe, Trash2, Plus, Loader2, Check, AlertCircle, Save } from 'lucide-react';

export default function WorkZoneManager() {
  const supabase = createClient();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    radius: 200,
    allowed_ip: '',
    allowed_bssid: ''
  });

  const fetchZones = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('work_zones').select('*').order('created_at', { ascending: false });
    if (data) setZones(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleAddZone = async () => {
    if (!newZone.name) return alert('근무지 이름을 입력해주세요.');
    
    setLoading(true);
    const { error } = await supabase.from('work_zones').insert([newZone]);
    if (!error) {
      setIsAdding(false);
      setNewZone({ name: '', latitude: 0, longitude: 0, radius: 200, allowed_ip: '', allowed_bssid: '' });
      fetchZones();
    } else {
      alert('저장 실패: ' + error.message);
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id: number) => {
    if (!confirm('이 근무지를 삭제하시겠습니까?')) return;
    
    const { error } = await supabase.from('work_zones').delete().eq('id', id);
    if (!error) fetchZones();
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>전체 근무지 현황 관리</h3>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>직원들이 근태 태킹을 할 수 있는 허용 구역을 관리합니다.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn btn-primary"
          style={{ padding: '0.625rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isAdding ? <X size={18} /> : <><Plus size={18} /> 새 근무지 추가</>}
        </button>
      </header>

      {/* 새 근무지 추가 양식 */}
      {isAdding && (
        <div className="card shadow-lg" style={{ padding: '1.5rem', borderRadius: '24px', border: '2px solid hsl(var(--primary)/0.2)', backgroundColor: 'hsl(var(--primary)/0.02)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={labelStyle}>근무지 이름</label>
              <input 
                type="text" placeholder="예: 본사 사옥" 
                value={newZone.name} onChange={e => setNewZone({...newZone, name: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>허용 반경 (m)</label>
              <input 
                type="number" value={newZone.radius} onChange={e => setNewZone({...newZone, radius: Number(e.target.value)})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>위도 (Latitude)</label>
              <input 
                type="number" step="0.000001" value={newZone.latitude} onChange={e => setNewZone({...newZone, latitude: Number(e.target.value)})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>경도 (Longitude)</label>
              <input 
                type="number" step="0.000001" value={newZone.longitude} onChange={e => setNewZone({...newZone, longitude: Number(e.target.value)})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>허용 IP (선택)</label>
              <input 
                type="text" placeholder="예: 211.123.45.67" 
                value={newZone.allowed_ip} onChange={e => setNewZone({...newZone, allowed_ip: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>허용 WiFi BSSID (선택)</label>
              <input 
                type="text" placeholder="예: 00:11:22:33:44:55" 
                value={newZone.allowed_bssid} onChange={e => setNewZone({...newZone, allowed_bssid: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleAddZone} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '12px' }}>
              근무지 정보 저장하기
            </button>
          </div>
        </div>
      )}

      {/* 근무지 목록 */}
      {loading && !isAdding ? (
        <div className="flex-center" style={{ height: '200px' }}><Loader2 className="animate-spin" color="hsl(var(--primary))" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {zones.length === 0 ? (
            <div className="card flex-center" style={{ gridColumn: '1/-1', height: '200px', color: 'hsl(var(--muted-foreground))' }}>
              등록된 근무지가 없습니다. 새 근무지를 추가해 주세요.
            </div>
          ) : (
            zones.map((zone) => (
              <div key={zone.id} className="card shadow-sm hover-scale" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid hsl(var(--border)/0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{zone.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>반경 {zone.radius}m 허용</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteZone(zone.id)}
                    style={{ padding: '0.5rem', borderRadius: '10px', color: 'hsl(var(--destructive))', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={infoRowStyle}>
                    <Globe size={14} color="hsl(var(--muted-foreground))" />
                    <span>위치: {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}</span>
                  </div>
                  {zone.allowed_ip && (
                    <div style={infoRowStyle}>
                      <AlertCircle size={14} color="hsl(var(--muted-foreground))" />
                      <span>허용 IP: {zone.allowed_ip}</span>
                    </div>
                  )}
                  {zone.allowed_bssid && (
                    <div style={infoRowStyle}>
                      <Wifi size={14} color="hsl(var(--muted-foreground))" />
                      <span>WiFi: {zone.allowed_bssid}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: 'hsl(var(--muted-foreground))'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 1rem',
  borderRadius: '10px',
  border: '1px solid hsl(var(--border))',
  fontSize: '0.875rem',
  outline: 'none'
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'hsl(var(--foreground))',
  fontWeight: 500
};
