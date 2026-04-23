'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'ADMIN' | 'USER';

interface Profile {
  full_name: string;
  role: string;
  department_id?: number;
  team: string;
  rank: string;
  total_leave: number;
  used_leave: number;
  work_start_time: string;
  work_end_time: string;
  cached_uid?: string;
  active_role: Role;
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

const CACHE_KEY = 'workcheck_profile_v9';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);
  const fetchLock = useRef(false);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // 1. [절대 보안] Failsafe Timeout (5초)
    // 어떤 이유로든 5초 안에 초기화가 안 되면 로딩을 강제로 풉니다.
    const failsafe = setTimeout(() => {
      setLoading(false);
      setSessionVerified(true);
    }, 5000);

    const init = async () => {
      try {
        // [캐시 로드] 성능을 위해 먼저 로컬 데이터를 로드
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setProfile(parsed);
          } catch (e) { /* ignore */ }
        }

        // [서버 검증] 실제 세션 확인
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        
        setSupabaseUser(user);
        setSessionVerified(true);

        if (user) {
          await fetchProfile(user.id, true);
        } else {
          setLoading(false);
          if (!isPublicPath) router.replace('/login');
        }
      } catch (err) {
        console.error('[Auth] Init failed', err);
        setLoading(false);
      } finally {
        clearTimeout(failsafe);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        const user = session?.user ?? null;
        setSupabaseUser(user);
        setSessionVerified(true);
        
        if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          await fetchProfile(user.id, true);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSupabaseUser(null);
          localStorage.removeItem(CACHE_KEY);
          setLoading(false);
          if (!isPublicPath) router.replace('/login');
        }
      }
    );

    return () => {
      clearTimeout(failsafe);
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const fetchProfile = async (userId: string, isBackground = false) => {
    if (fetchLock.current) return;
    fetchLock.current = true;
    
    if (!isBackground) setLoading(true);

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const intentRole = localStorage.getItem('login_intent_role') as Role;
        const dbRoles = (data.role || 'USER').split(',').map((r: string) => r.trim());
        
        let finalRole: Role = 'USER';
        if (intentRole && dbRoles.includes(intentRole)) {
          finalRole = intentRole;
        } else if (dbRoles.includes('ADMIN')) {
          finalRole = 'ADMIN';
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
      }
    } catch (err) {
      console.error('[Auth] Fetch Profile failed', err);
    } finally {
      fetchLock.current = false;
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    localStorage.removeItem(CACHE_KEY);
    await supabase.auth.signOut();
    setProfile(null);
    setSupabaseUser(null);
    setLoading(false);
    router.replace('/login');
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
    // [보안 가드] 세션 확인이 끝났는데 유저가 없으면 무조건 null
    if (sessionVerified && !supabaseUser) return null;
    
    // 세션 확인 중일 때만 캐시를 사용해 임시로 보여줌
    const targetUser = supabaseUser || (profile?.cached_uid ? { id: profile.cached_uid } : null);
    if (!targetUser) return null;
    
    return {
      id: targetUser.id,
      email: (supabaseUser as any)?.email || '',
      name: profile?.full_name || '사용자',
      team: profile?.team || '소속 없음',
      rank: profile?.rank || '직급 없음',
      total_leave: profile?.total_leave || 15,
      used_leave: profile?.used_leave || 0,
      work_start_time: profile?.work_start_time || '09:00:00',
      work_end_time: profile?.work_end_time || '18:00:00'
    };
  }, [supabaseUser, profile, sessionVerified]);

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
