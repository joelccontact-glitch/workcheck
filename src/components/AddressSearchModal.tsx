'use client';

import React, { useState } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';

interface AddressSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchModalProps {
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function AddressSearchModal({ onSelect, onClose }: AddressSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // OpenStreetMap Nominatim API 사용 (한국어 결과 우선)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&accept-language=ko`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Address search failed:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div className="card animate-in shadow-2xl" style={modalStyle}>
        <header style={headerStyle}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="hsl(var(--primary))" /> 근무지 주소 검색
          </h3>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </header>

        <form onSubmit={handleSearch} style={searchFormStyle}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={searchIconStyle} />
            <input 
              type="text" 
              placeholder="도로명 주소 또는 건물명 입력 (예: 서울특별시청)" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={inputStyle}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={searchBtnStyle} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : '검색'}
          </button>
        </form>

        <div style={resultsContainerStyle}>
          {loading ? (
            <div className="flex-center" style={{ height: '200px' }}><Loader2 className="animate-spin" /></div>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelect(parseFloat(item.lat), parseFloat(item.lon), item.display_name)}
                style={resultItemStyle}
                className="hover-bg"
              >
                <div style={iconContainerStyle}><Navigation size={14} /></div>
                <div style={{ flex: 1 }}>
                  <div style={addressTextStyle}>{item.display_name}</div>
                  <div style={coordsTextStyle}>위도: {parseFloat(item.lat).toFixed(5)}, 경도: {parseFloat(item.lon).toFixed(5)}</div>
                </div>
              </div>
            ))
          ) : query && !loading ? (
            <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--muted-foreground))' }}>검색 결과가 없습니다.</div>
          ) : (
            <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
              정확한 주소지를 입력하시면<br/>위도와 경도를 자동으로 찾아드립니다.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hover-bg:hover {
          background-color: hsl(var(--primary)/0.05) !important;
          border-color: hsl(var(--primary)/0.2) !important;
        }
      `}</style>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  width: '100%', maxWidth: '500px', backgroundColor: 'white',
  borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
};

const headerStyle: React.CSSProperties = {
  padding: '1.25rem 1.5rem', borderBottom: '1px solid hsl(var(--border))',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const closeBtnStyle: React.CSSProperties = {
  border: 'none', background: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))'
};

const searchFormStyle: React.CSSProperties = {
  padding: '1.25rem', display: 'flex', gap: '0.75rem', borderBottom: '1px solid hsl(var(--border)/0.5)'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px',
  border: '1px solid hsl(var(--border))', outline: 'none', fontSize: '0.9rem'
};

const searchIconStyle: React.CSSProperties = {
  position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
  color: 'hsl(var(--muted-foreground))'
};

const searchBtnStyle: React.CSSProperties = {
  padding: '0 1.5rem', borderRadius: '12px', minWidth: '80px'
};

const resultsContainerStyle: React.CSSProperties = {
  maxHeight: '400px', overflowY: 'auto', padding: '0.5rem'
};

const resultItemStyle: React.CSSProperties = {
  padding: '1rem', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
  display: 'flex', alignItems: 'flex-start', gap: '1rem', border: '1px solid transparent',
  marginBottom: '0.25rem'
};

const iconContainerStyle: React.CSSProperties = {
  width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'hsl(var(--muted))',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--muted-foreground))',
  marginTop: '2px'
};

const addressTextStyle: React.CSSProperties = {
  fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem', lineHeight: '1.4'
};

const coordsTextStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 500
};
