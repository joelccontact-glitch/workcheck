'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Loader2, Move, Search, MapPin, Navigation } from 'lucide-react';

const DynamicMap = dynamic(() => import('./WorkplaceMap'), { 
  ssr: false,
  loading: () => <div className="flex-center" style={{ height: '500px', backgroundColor: 'hsl(var(--muted)/0.3)' }}><Loader2 className="animate-spin" /> 지도 로딩 중...</div>
});

export default function AdminWorkplace() {
  const supabase = createClient();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Zone Form
  const [newName, setNewName] = useState('');
  const [lat, setLat] = useState(37.5665);
  const [lng, setLng] = useState(126.9780);
  const [radius, setRadius] = useState(30);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    const { data } = await supabase.from('work_zones').select('*').order('id', { ascending: false });
    if (data) setZones(data);
    setLoading(false);
  };

  // 1. 초기 지도가 나타날 경우 현재 위치를 파악하여 기본으로 나타나도록 처리
  useEffect(() => {
    fetchZones();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        (err) => console.warn('GPS location failed:', err)
      );
    }
  }, []);

  const handleAddZone = async () => {
    if (!newName) return alert('근무지 이름을 입력하세요.');
    setSaving(true);
    const { error } = await supabase.from('work_zones').insert({
      name: newName,
      latitude: lat,
      longitude: lng,
      radius: radius
    });

    if (!error) {
      setNewName('');
      fetchZones();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('이 근무지를 삭제할까요?')) return;
    const { error } = await supabase.from('work_zones').delete().eq('id', id);
    if (!error) fetchZones();
  };

  // 2. 주소검색 기능을 추가
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat: newLat, lon: newLng } = data[0];
        setLat(parseFloat(newLat));
        setLng(parseFloat(newLng));
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>근무지 설정</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>주소를 검색하거나 지도를 클릭하여 위치를 설정하세요.</p>
        </div>
        
        {/* Address Search Bar */}
        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="주소 검색 (예: 서울특별시청)"
            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-sm)', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', height: '2.25rem', padding: '0 1rem', fontSize: '0.75rem' }} disabled={searching}>
            {searching ? <Loader2 size={14} className="animate-spin" /> : '검색'}
          </button>
        </form>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        <div className="card shadow-lg" style={{ padding: '0', overflow: 'hidden', height: '500px', position: 'relative', border: 'none' }}>
           <DynamicMap 
             lat={lat} 
             lng={lng} 
             radius={radius} 
             zones={zones} 
             onMapClick={(la, ln) => { setLat(la); setLng(ln); }} 
           />
           <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 400, backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Navigation size={14} color="hsl(var(--primary))" /> 지도를 클릭하여 위치 지정
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} color="hsl(var(--primary))" /> 새 근무지 등록
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>근무지 이름</label>
                <input 
                  value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="예: 본사 사무실, 강남 지점" style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>위도 (Latitude)</label>
                  <input readOnly value={lat.toFixed(6)} style={disabledInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>경도 (Longitude)</label>
                  <input readOnly value={lng.toFixed(6)} style={disabledInputStyle} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={labelStyle}>허용 반경 (Radius)</label>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{radius}m</span>
                </div>
                <input 
                  type="range" min="5" max="30" step="1"
                  value={radius} onChange={e => setRadius(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
                  <span>5m</span>
                  <span>15m</span>
                  <span>30m (최대)</span>
                </div>
              </div>

              <button 
                onClick={handleAddZone}
                disabled={saving}
                className="btn btn-primary" style={{ height: '3rem', marginTop: '0.5rem' }}
              >
                {saving ? <Loader2 className="animate-spin" /> : '근무지 추가하기'}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>등록된 근무지 목록</h3>
            {loading ? (
              <div className="flex-center" style={{ height: '100px' }}><Loader2 className="animate-spin" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {zones.map(zone => (
                  <div key={zone.id} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <MapPin size={16} color="hsl(var(--primary))" />
                       <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{zone.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>반경 {zone.radius}m</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(zone.id)}
                      className="btn" style={{ padding: '0.5rem', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', border: 'none' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'hsl(var(--muted-foreground))' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', outline: 'none', fontSize: '0.875rem' };
const disabledInputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted)/0.3)', color: 'hsl(var(--muted-foreground))', outline: 'none', fontSize: '0.875rem' };
