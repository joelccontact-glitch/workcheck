'use client';

import React from 'react';
import { User, MapPin, Clock, Search } from 'lucide-react';

const DUMMY_TEAM = [
  { id: 1, name: '이수민', rank: '대리', status: 'WORKING', time: '09:02', location: '본사' },
  { id: 2, name: '박지훈', rank: '사원', status: 'WORKING', time: '08:45', location: '강남현장' },
  { id: 3, name: '최유진', rank: '과장', status: 'OFF', time: '-', location: '-' },
  { id: 4, name: '정우성', rank: '사원', status: 'WORKING', time: '09:15', location: '본사' },
  { id: 5, name: '김태리', rank: '대리', status: 'OFF', time: '-', location: '-' },
];

export default function TeamList() {
  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>팀원 현황</h3>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
          <input 
            type="text" 
            placeholder="팀원 검색..." 
            style={{ 
              padding: '0.4rem 0.75rem 0.4rem 2rem', 
              fontSize: '0.75rem', 
              borderRadius: 'var(--radius)',
              border: '1px solid hsl(var(--border))',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {DUMMY_TEAM.map((member) => (
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
              backgroundColor: member.status === 'WORKING' ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted))',
              color: member.status === 'WORKING' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              marginRight: '1rem'
            }}>
              <User size={20} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                {member.name} <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{member.rank}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                  <Clock size={12} />
                  {member.time === '-' ? '출근전' : member.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                  <MapPin size={12} />
                  {member.location}
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '0.25rem 0.6rem', 
              borderRadius: '1rem', 
              fontSize: '0.7rem', 
              fontWeight: 600,
              backgroundColor: member.status === 'WORKING' ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--muted))',
              color: member.status === 'WORKING' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))'
            }}>
              {member.status === 'WORKING' ? '근무 중' : '미출근'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
