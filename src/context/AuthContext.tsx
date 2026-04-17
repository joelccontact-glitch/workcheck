'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'ADMIN' | 'USER';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: {
    name: string;
    team: string;
    rank: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('USER');
  
  const user = {
    name: role === 'ADMIN' ? '관리자 (Admin)' : '홍길동',
    team: role === 'ADMIN' ? '인사관리팀' : '개발팀',
    rank: role === 'ADMIN' ? '팀장' : '과장',
  };

  useEffect(() => {
    const saved = localStorage.getItem('user-role');
    if (saved) setRole(saved as Role);
  }, []);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('user-role', newRole);
    window.location.reload(); // Simple way to refresh UI state
  };

  return (
    <AuthContext.Provider value={{ role, setRole: handleSetRole, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
