'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'ADMIN' | 'USER';

interface Profile {
  full_name: string;
  role: string; // "ADMIN", "USER", 또는 "ADMIN,USER" 형태
  department_id?: number;
  team: string;
  rank: string;
  total_leave: number;
  used_leave: number;
  work_start_time: string;
  work_end_time: string;
  cached_uid?: string;
  active_role: Role; // 현재 세션에서 사용 중인 역할
}

interface AuthContextType {
  role: Role;
  user: {
    id: string;
    email: string;
    name: string;
    team: string;
    rank: string;
    total_leave: number;
    used_leave: number;
    work_start_time: string;
    work_end_time: string;
  } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'workcheck_profile_v6';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const isFetching = useRef(false);
  const loadingStateRef = useRef(true);

  useEffect(() => {
    loadingStateRef.current = loading;
  }, [loading]);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
      } catch (e) {
        console.error('Cache error', e);
      }
    }
  }, []);

  const fetchProfile = async (userId: string, isBackground = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    if (!isBackground) setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const intentRole = localStorage.getItem('login_intent_role') as Role;
        const dbRoles = (data.role || 'USER').split(',').map((r: string) => r.trim());
        
        // 실제 권한 목록에 사용자가 선택한 역할이 있는지 확인
        let finalRole: Role = 'USER';
        if (intentRole && dbRoles.includes(intentRole)) {
          finalRole = intentRole;
        } else if (dbRoles.includes('ADMIN')) {
          finalRole = 'ADMIN'; // 의도가 없으면 관리자 우선
        }

        const newProfile: Profile = {
          full_name: data.full_name || '사용자',
          role: data.role || 'USER',
          active_role: finalRole,
          department_id: data.department_id,
          team: data.team || '소속 없음',
          rank: data.rank || '직급 없음',
          total_leave: data.total_leave || 15,
          used_leave: data.used_leave || 0,
          work_start_time: data.work_start_time || '09:00:00',
          work_end_time: data.work_end_time || '18:00:00',
          cached_uid: userId
        };
        setProfile(newProfile);
        localStorage.setItem(CACHE_KEY, JSON.stringify(newProfile));
        localStorage.removeItem('login_intent_role');
      } else {
        if (!isPublicPath) router.replace('/signup');
      }
    } catch (err) {
      console.error('[Auth] Fetch error:', err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const authTimeout = setTimeout(() => {
      if (loadingStateRef.current) {
        setLoading(false);
        setSessionChecked(true);
      }
    }, 4000);

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user ?? null;
        setSupabaseUser(user);
        setSessionChecked(true);
        
        if (user) {
          await fetchProfile(user.id, true);
        } else {
          setLoading(false);
          localStorage.removeItem(CACHE_KEY);
          if (!isPublicPath) router.replace('/login');
        }
      } catch (err) {
        setLoading(false);
        setSessionChecked(true);
      } finally {
        clearTimeout(authTimeout);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        const user = session?.user ?? null;
        setSupabaseUser(user);
        setSessionChecked(true);
        
        if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          await fetchProfile(user.id, true);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSupabaseUser(null);
          localStorage.clear();
          setLoading(false);
          window.location.href = '/login';
        }
      }
    );

    return () => {
      clearTimeout(authTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    setLoading(true);
    localStorage.clear();
    sessionStorage.clear();
    await supabase.auth.signOut();
    setProfile(null);
    setSupabaseUser(null);
    setLoading(false);
    window.location.href = '/login';
  };

  const refreshProfile = async () => {
    if (supabaseUser) await fetchProfile(supabaseUser.id, true);
  };

  const setRole = (newRole: Role) => {
    if (profile) {
      const updated = { ...profile, active_role: newRole };
      setProfile(updated);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    }
  };

  const userData = useMemo(() => {
    if (sessionChecked && !supabaseUser) return null;
    const targetUser = supabaseUser || (profile?.cached_uid ? { id: profile.cached_uid, email: '' } : null);
    if (!targetUser) return null;

    return {
      id: targetUser.id,
      email: (targetUser as any).email || '',
      name: profile?.full_name || '사용자',
      team: profile?.team || '소속 없음',
      rank: profile?.rank || '직급 없음',
      total_leave: profile?.total_leave || 15,
      used_leave: profile?.used_leave || 0,
      work_start_time: profile?.work_start_time || '09:00:00',
      work_end_time: profile?.work_end_time || '18:00:00'
    };
  }, [supabaseUser, profile, sessionChecked]);

  return (
    <AuthContext.Provider value={{ 
      role: profile?.active_role || 'USER', 
      user: userData, 
      loading,
      signOut: handleSignOut,
      refreshProfile,
      setRole
    }}>
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
