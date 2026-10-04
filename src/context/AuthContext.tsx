import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Storage } from '../utils/storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for caching demo/local user session if offline or placeholder key
const LOCAL_AUTH_KEY = 'vocabai_active_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Load user profile from public.profiles table
  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    try {
      if (isConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, created_at')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setProfile(data as UserProfile);
          return data as UserProfile;
        }

        // If profile doesn't exist yet, insert it
        if (email) {
          const newProfile: UserProfile = {
            id: userId,
            name: email.split('@')[0],
            email,
            created_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert(newProfile);
          setProfile(newProfile);
          return newProfile;
        }
      }
    } catch (err) {
      console.warn('Profile fetch note:', err);
    }

    // Fallback profile from storage or metadata
    const cached = localStorage.getItem(`vocabai_profile_${userId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        return parsed;
      } catch (e) {
        // ignore
      }
    }

    const fallback: UserProfile = {
      id: userId,
      name: email ? email.split('@')[0] : 'Foydalanuvchi',
      email: email || '',
      created_at: new Date().toISOString(),
    };
    setProfile(fallback);
    return fallback;
  }, [isConfigured]);

  // Set active user into app & storage
  const handleUserChange = useCallback(
    async (newUser: User | null, newSession: Session | null) => {
      setUser(newUser);
      setSession(newSession);

      if (newUser) {
        Storage.setCurrentUserId(newUser.id);
        const userEmail = newUser.email || '';
        const userMetaName = newUser.user_metadata?.name || userEmail.split('@')[0];

        const prof = await fetchProfile(newUser.id, userEmail);
        if (prof && userMetaName && prof.name === userEmail.split('@')[0]) {
          prof.name = userMetaName;
          setProfile({ ...prof });
        }
      } else {
        Storage.setCurrentUserId(null);
        setProfile(null);
      }
    },
    [fetchProfile]
  );

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isConfigured) {
          const {
            data: { session: initialSession },
          } = await supabase.auth.getSession();

          if (mounted && initialSession?.user) {
            await handleUserChange(initialSession.user, initialSession);
          } else if (mounted) {
            await handleUserChange(null, null);
          }
        } else {
          // Check local session
          const localUserJson = localStorage.getItem(LOCAL_AUTH_KEY);
          if (localUserJson && mounted) {
            try {
              const localUser = JSON.parse(localUserJson);
              const fakeUser: any = {
                id: localUser.id,
                email: localUser.email,
                user_metadata: { name: localUser.name },
                aud: 'authenticated',
                created_at: localUser.created_at,
              };
              await handleUserChange(fakeUser, null);
              setProfile(localUser);
            } catch (e) {
              localStorage.removeItem(LOCAL_AUTH_KEY);
            }
          }
        }
      } catch (err) {
        console.warn('Auth init check:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for Supabase auth state changes
    let subscription: any = null;
    if (isConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (mounted) {
          if (newSession?.user) {
            await handleUserChange(newSession.user, newSession);
          } else {
            await handleUserChange(null, null);
          }
          setLoading(false);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isConfigured, handleUserChange]);

  // Login
  const login = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      if (isConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          await handleUserChange(data.user, data.session);
          return { error: null };
        }
      } else {
        // Local auth mode
        const existingUsersJson = localStorage.getItem('vocabai_registered_users_v1');
        const existingUsers: Array<{
          id: string;
          email: string;
          name: string;
          passwordHash: string;
          created_at: string;
        }> = existingUsersJson ? JSON.parse(existingUsersJson) : [];

        const found = existingUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (!found) {
          return {
            error: "Bunday email bilan foydalanuvchi topilmadi. Iltimos ro'yxatdan o'ting.",
          };
        }

        if (found.passwordHash !== password) {
          return { error: "Noto'g'ri parol kiritildi. Qaytadan urinib ko'ring." };
        }

        const localProfile: UserProfile = {
          id: found.id,
          name: found.name,
          email: found.email,
          created_at: found.created_at,
        };

        const fakeUser: any = {
          id: found.id,
          email: found.email,
          user_metadata: { name: found.name },
          aud: 'authenticated',
          created_at: found.created_at,
        };

        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localProfile));
        localStorage.setItem(`vocabai_profile_${found.id}`, JSON.stringify(localProfile));
        await handleUserChange(fakeUser, null);
        return { error: null };
      }
      return { error: 'Noma\'lum xatolik yuz berdi.' };
    } catch (err: any) {
      return { error: err?.message || 'Tizimga kirishda xatolik yuz berdi.' };
    }
  };

  // Register
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const trimmedEmail = email.trim();
      const trimmedName = name.trim() || trimmedEmail.split('@')[0];

      if (isConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              name: trimmedName,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          // Create profile record in public.profiles table
          const newProfile: UserProfile = {
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            created_at: new Date().toISOString(),
          };

          try {
            await supabase.from('profiles').insert(newProfile);
          } catch (e) {
            console.warn('Error inserting profile to table:', e);
          }

          localStorage.setItem(
            `vocabai_profile_${data.user.id}`,
            JSON.stringify(newProfile)
          );

          await handleUserChange(data.user, data.session);
          return { error: null };
        }
      } else {
        // Local auth registration mode
        const existingUsersJson = localStorage.getItem('vocabai_registered_users_v1');
        const existingUsers: Array<{
          id: string;
          email: string;
          name: string;
          passwordHash: string;
          created_at: string;
        }> = existingUsersJson ? JSON.parse(existingUsersJson) : [];

        if (existingUsers.some((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
          return { error: "Ushbu email allaqachon ro'yxatdan o'tgan. Iltimos tizimga kiring." };
        }

        const newId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        const newUserRecord = {
          id: newId,
          email: trimmedEmail,
          name: trimmedName,
          passwordHash: password,
          created_at: new Date().toISOString(),
        };

        existingUsers.push(newUserRecord);
        localStorage.setItem('vocabai_registered_users_v1', JSON.stringify(existingUsers));

        const localProfile: UserProfile = {
          id: newId,
          name: trimmedName,
          email: trimmedEmail,
          created_at: newUserRecord.created_at,
        };

        const fakeUser: any = {
          id: newId,
          email: trimmedEmail,
          user_metadata: { name: trimmedName },
          aud: 'authenticated',
          created_at: newUserRecord.created_at,
        };

        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localProfile));
        localStorage.setItem(`vocabai_profile_${newId}`, JSON.stringify(localProfile));
        await handleUserChange(fakeUser, null);
        return { error: null };
      }

      return { error: 'Ro\'yxatdan o\'tishda xatolik yuz berdi.' };
    } catch (err: any) {
      return { error: err?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (isConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('SignOut note:', err);
    } finally {
      localStorage.removeItem(LOCAL_AUTH_KEY);
      await handleUserChange(null, null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
