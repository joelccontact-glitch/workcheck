'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserCog, User } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole } = useAuth();

  return (
    <div style={{ 
      display: 'inline-flex', 
      padding: '4px', 
      backgroundColor: 'hsl(var(--muted))', 
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <button 
        onClick={() => setRole('USER')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          backgroundColor: role === 'USER' ? 'white' : 'transparent',
          color: role === 'USER' ? 'black' : 'hsl(var(--muted-foreground))',
          boxShadow: role === 'USER' ? 'var(--shadow-sm)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        <User size={14} /> 사용자
      </button>
      <button 
        onClick={() => setRole('ADMIN')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          backgroundColor: role === 'ADMIN' ? 'white' : 'transparent',
          color: role === 'ADMIN' ? 'black' : 'hsl(var(--muted-foreground))',
          boxShadow: role === 'ADMIN' ? 'var(--shadow-sm)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        <UserCog size={14} /> 관리자
      </button>
    </div>
  );
}
