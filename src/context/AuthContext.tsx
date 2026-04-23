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

const CACHE_KEY = 'workcheck_profile_v8';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);
  const isInitialized = useRef(false);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  // [속도 최적화] 브라우저에 남은 세션이 있는지 즉시 확인 (네트워크 없이)
  useEffect(() => {
    if (isInitialized.current) return;
    
    const checkInstantAccess = async () => {
      // 1. 로컬 스토리지에서 캐시된 프로필 먼저 로드
      const cached = localStorage.getItem(CACHE_KEY);
      let preUser = null;
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          if (parsed.cached_uid) {
            preUser = { id: parsed.cached_uid };
            // 캐시가 있으면 로딩을 미리 풀어서 화면을 즉시 보여줍니다. (속도 개선 핵심)
            setLoading(false);
          }
        } catch (e) { /* ignore */ }
      }

      // 2. 백그라운드에서 실제 세션 검증 (보안 유지)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setSupabaseUser(user);

        if (user) {
          // 세션이 확인되면 최신 프로필 동기화
          await fetchProfile(user.id, true);
        } else {
          // 세션이 없으면 (로그아웃 됨) 즉시 차단하고 리다이렉트
          localStorage.removeItem(CACHE_KEY);
          setProfile(null);
          setLoading(false);
          if (!isPublicPath) router.replace('/login');
        }
      } catch (err) {
        setLoading(false);
      } finally {
        isInitialized.current = true;
      }
    };

    checkInstantAccess();

    // 상태 변화 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        const user = session?.user ?? null;
        setSupabaseUser(user);
        
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
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const fetchProfile = async (userId: string, isBackground = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
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
    } finally {
      isFetching.current = false;
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
    // 세션이 없거나 초기화되지 않은 경우는 null
    if (!supabaseUser && isInitialized.current) return null;
    
    // 초기화 중이거나 세션이 있는 경우에만 데이터 반환
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
  }, [supabaseUser, profile]);

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
