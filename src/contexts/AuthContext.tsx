import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { AppState } from 'react-native';
import { auth } from '@/config/firebase';
import { login as signIn, logout as signOut } from '@/services/auth.service';
import { getWaiterSession } from '@/services/session.service';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { WaiterProfile } from '@/types/waiter';
type AuthValue = {
  user: WaiterProfile | null;
  hasIdentity: boolean;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};
const Context = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WaiterProfile | null>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profileRef = useRef<WaiterProfile | null>(null);
  const generation = useRef(0);
  const mounted = useRef(true);
  const refresh = useCallback(async () => {
    const current = ++generation.current;
    const uid = auth.currentUser?.uid;
    const keepCurrentScreen = Boolean(uid && profileRef.current?.uid === uid);
    setHasIdentity(Boolean(uid));
    if (!keepCurrentScreen) {
      setLoading(true);
      profileRef.current = null;
      setUser(null);
    }
    setError('');
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const profile = await getWaiterSession();
      if (
        mounted.current &&
        current === generation.current &&
        auth.currentUser?.uid === uid
      ) {
        profileRef.current = profile;
        setUser(profile);
      }
    } catch (cause) {
      if (mounted.current && current === generation.current) {
        const code = (cause as { code?: string })?.code;
        const accessDenied = [
          'functions/permission-denied',
          'functions/unauthenticated',
          'functions/failed-precondition',
          'auth/user-disabled',
          'auth/user-token-expired',
          'auth/invalid-user-token',
          'auth/user-not-found',
        ].includes(code ?? '');
        if (!keepCurrentScreen || accessDenied) {
          profileRef.current = null;
          setUser(null);
        }
        setError(getErrorMessage(cause));
      }
    } finally {
      if (mounted.current && current === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    const unsubscribe = onIdTokenChanged(auth, () => {
      void refresh();
    });
    const foreground = AppState.addEventListener('change', (state) => {
      if (state === 'active' && auth.currentUser) void refresh();
    });
    return () => {
      mounted.current = false;
      generation.current++;
      unsubscribe();
      foreground.remove();
    };
  }, [refresh]);
  const login = async (email: string, password: string) => {
    setError('');
    try {
      await signIn(email, password);
    } catch (cause) {
      const message = getErrorMessage(cause);
      setError(message);
      throw new Error(message);
    }
  };
  const logout = async () => {
    generation.current++;
    profileRef.current = null;
    setUser(null);
    setError('');
    await signOut();
  };
  return (
    <Context.Provider
      value={{ user, hasIdentity, loading, error, login, logout, refresh }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error('AuthProvider não encontrado.');
  return value;
}
