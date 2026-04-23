'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'ADMIN' | 'USER';

interface Profile {
  full_name: string;
  role: Role;
  department_id?: number;
  team: string;
  rank: string;
  total_leave: number;
  used_leave: number;
  work_start_time: string;
  work_end_time: string;
  cached_uid?: string;
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

const CACHE_KEY = 'workcheck_profile_v5';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false); // 세션 확인 완료 여부
  const isFetching = useRef(false);
  const loadingStateRef = useRef(true);

  useEffect(() => {
    loadingStateRef.current = loading;
  }, [loading]);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  // 1. 캐시 로드
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        // 캐시가 있어도 일단 세션 확인 전까지는 loading을 완전히 풀지 않음 (깜빡임 방지)
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
        const actualRole = (data.role as Role) || 'USER';
        const finalRole = (intentRole === 'ADMIN' && actualRole !== 'ADMIN') ? 'USER' : (intentRole || actualRole);

        const newProfile: Profile = {
          full_name: data.full_name || '사용자',
          role: finalRole,
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
          console.log('[Auth] SIGNED_OUT detected');
          setProfile(null);
          setSupabaseUser(null);
          localStorage.clear(); // 모든 로컬 데이터 삭제
          setLoading(false);
          // 즉시 로그인 페이지로 강제 이동 (Next.js router 대신 window.location 사용으로 확실히 초기화)
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
    console.log('[Auth] Starting signOut...');
    
    // 1. 로컬 캐시 먼저 파기
    localStorage.clear();
    sessionStorage.clear();
    
    // 2. Supabase 로그아웃 호출
    await supabase.auth.signOut();
    
    // 3. 상태 초기화
    setProfile(null);
    setSupabaseUser(null);
    setLoading(false);
    
    // 4. 강력한 페이지 이동 (모든 메모리 초기화)
    window.location.href = '/login';
  };

  const refreshProfile = async () => {
    if (supabaseUser) await fetchProfile(supabaseUser.id, true);
  };

  const setRole = (newRole: Role) => {
    if (profile) {
      const updated = { ...profile, role: newRole };
      setProfile(updated);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    }
  };

  const userData = useMemo(() => {
    // 세션 확인이 끝났는데 유저가 없으면 무조건 null 반환
    if (sessionChecked && !supabaseUser) return null;
    
    // 세션 확인 중일 때만 캐시된 정보를 임시로 사용
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
      role: profile?.role || 'USER', 
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
