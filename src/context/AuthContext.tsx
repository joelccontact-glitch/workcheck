'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  const fetchProfile = async (userId: string) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    console.log('[Auth] Fetching profile for:', userId);
    
    // Failsafe timeout: 5초 후에도 응답 없으면 강제 로딩 해제
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[Auth] Profile fetch timed out.');
        setLoading(false);
      }
    }, 5000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth] Profile query error:', error.message, error.code);
        setProfile(null);
        if (!isPublicPath) router.replace('/signup');
      } else if (data) {
        console.log('[Auth] Profile loaded successfully');
        setProfile({
          full_name: data.full_name || '사용자',
          role: (data.role as Role) || 'USER',
          department_id: data.department_id,
          team: data.team || '소속 없음',
          rank: data.rank || '직급 없음',
          total_leave: data.total_leave || 15,
          used_leave: data.used_leave || 0,
          work_start_time: data.work_start_time || '09:00:00',
          work_end_time: data.work_end_time || '18:00:00'
        });
      } else {
        setProfile(null);
        if (!isPublicPath) router.replace('/signup');
      }
    } catch (err) {
      console.error('[Auth] Unexpected error during fetch:', err);
      setProfile(null);
    } finally {
      clearTimeout(timeoutId);
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user ?? null;
      setSupabaseUser(user);
      
      if (user) {
        await fetchProfile(user.id);
      } else {
        setLoading(false);
        if (!isPublicPath) router.replace('/login');
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setSupabaseUser(user);
        
        if (user && event === 'SIGNED_IN') {
          setLoading(true);
          await fetchProfile(user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
          if (!isPublicPath) router.replace('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setSupabaseUser(null);
    router.replace('/login');
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      await fetchProfile(supabaseUser.id);
    }
  };

  const setRole = (newRole: Role) => {
    if (profile) setProfile({ ...profile, role: newRole });
  };

  const userData = supabaseUser ? {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '사용자',
    team: profile?.team || '소속 없음',
    rank: profile?.rank || '직급 없음',
    total_leave: profile?.total_leave || 15,
    used_leave: profile?.used_leave || 0,
    work_start_time: profile?.work_start_time || '09:00:00',
    work_end_time: profile?.work_end_time || '18:00:00'
  } : null;

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
