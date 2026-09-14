'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Role = 'ADMIN' | 'EXECUTIVE' | 'PM' | 'USER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  team: string;
  rank: string;
  role: Role;
  active_role: Role;
  work_start_time?: string;
  work_end_time?: string;
  total_leave?: number;
  used_leave?: number;
}

export const PRESET_USERS: Record<string, UserProfile> = {
  EXECUTIVE: {
    id: 'user-exec-01',
    email: 'kim@daumis.co.kr',
    name: '김철수',
    team: '경영전략실',
    rank: '전무',
    role: 'EXECUTIVE',
    active_role: 'EXECUTIVE'
  },
  PM: {
    id: 'user-pm-01',
    email: 'pm.park@daumis.co.kr',
    name: '박민우',
    team: 'SI사업1팀',
    rank: '수석',
    role: 'PM',
    active_role: 'PM'
  },
  ADMIN: {
    id: 'user-admin-01',
    email: 'pmo@daumis.co.kr',
    name: '김지훈',
    team: 'PMO본부',
    rank: '이사',
    role: 'ADMIN',
    active_role: 'ADMIN'
  }
};

interface AuthContextType {
  role: Role;
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setRole: (role: Role) => void;
  loginAsPreset: (presetKey: 'EXECUTIVE' | 'PM' | 'ADMIN' | string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'daumis_pmo_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(PRESET_USERS.ADMIN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(USER_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as UserProfile;
        // Ensure assigned role limits active_role
        if (parsed.role !== 'ADMIN') {
          parsed.active_role = parsed.role;
        }
        setCurrentUser(parsed);
      } else {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(PRESET_USERS.ADMIN));
      }
    } catch (e) {
      setCurrentUser(PRESET_USERS.ADMIN);
    }
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    localStorage.removeItem(USER_SESSION_KEY);
    setCurrentUser(null);
    setLoading(false);
    router.replace('/login');
  };

  const setRole = (requestedRole: Role) => {
    if (!currentUser) return;

    // Superuser (ADMIN) can switch between any active role view freely
    if (currentUser.role === 'ADMIN') {
      const targetRoleKey = requestedRole === 'USER' ? 'PM' : requestedRole;
      const updated = { ...currentUser, active_role: targetRoleKey };
      setCurrentUser(updated);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
    } else {
      // Non-admin roles (EXECUTIVE, PM) are strictly locked to their assigned role
      const lockedRole = currentUser.role === 'USER' ? 'PM' : currentUser.role;
      const updated = { ...currentUser, active_role: lockedRole };
      setCurrentUser(updated);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
    }
  };

  const loginAsPreset = (presetKey: string) => {
    let target = PRESET_USERS[presetKey];
    if (!target) {
      if (presetKey.includes('kim')) target = PRESET_USERS.EXECUTIVE;
      else if (presetKey.includes('park') || presetKey.includes('pm')) target = PRESET_USERS.PM;
      else target = PRESET_USERS.ADMIN;
    }
    const userSession: UserProfile = {
      ...target,
      active_role: target.role
    };
    setCurrentUser(userSession);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
    router.push('/');
  };

  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider value={{ 
      role: currentUser?.active_role || 'ADMIN', 
      user: currentUser, 
      loading,
      signOut: handleSignOut,
      refreshProfile,
      setRole,
      loginAsPreset
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      role: 'ADMIN' as Role,
      user: PRESET_USERS.ADMIN,
      loading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
      setRole: () => {},
      loginAsPreset: () => {}
    };
  }
  return context;
}
