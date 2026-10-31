import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { useAuth } from './AuthContext';
import { createSalonStore } from '@/services/salon-store';
import { salonOperation } from '@/services/salon.service';
const Context = createContext<ReturnType<typeof createSalonStore> | undefined>(
  undefined,
);
export function WaiterProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? '',
    storeId = user?.storeId ?? '';
  const store = useMemo(
    () =>
      createSalonStore({
        uid,
        storeId,
        storage: AsyncStorage,
        requestId: randomUUID,
        call: (action, fields) => salonOperation(uid, storeId, action, fields),
      }),
    [uid, storeId],
  );
  const lifecycle = useMemo(
    () => ({ release: undefined as ReturnType<typeof setTimeout> | undefined }),
    [store],
  );
  useEffect(() => {
    clearTimeout(lifecycle.release);
    if (!uid || !storeId) return;
    void store.start();
    const update = () => {
      if (AppState.currentState === 'active') void store.refresh();
    };
    const interval = setInterval(update, 5000);
    const foreground = AppState.addEventListener('change', (value) => {
      if (value === 'active') void store.refresh();
    });
    return () => {
      clearInterval(interval);
      foreground.remove();
      lifecycle.release = setTimeout(() => store.dispose(), 0);
    };
  }, [store, uid, storeId, lifecycle]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useWaiter() {
  const store = useContext(Context);
  if (!store) throw new Error('WaiterProvider não encontrado.');
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return {
    ...snapshot,
    refresh: store.refresh,
    mutate: store.mutate,
    retryPending: store.retryPending,
    disabled: snapshot.busy || !snapshot.ready || !!snapshot.pending,
  };
}
