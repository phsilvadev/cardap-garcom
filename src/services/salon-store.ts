import type {
  WaiterState,
  SalonResponse,
  Product,
  PendingOperation,
  SalonAction,
} from '../types/salon';
import {
  emptyWaiterState,
  fromSalonResponse,
  salonError,
  definitiveError,
  accessError,
} from '../utils/salon-state.ts';
type Snapshot = {
  state: WaiterState;
  loading: boolean;
  ready: boolean;
  error: string;
  busy: boolean;
  pending: PendingOperation | null;
  confirmedOperation: PendingOperation | null;
};
type Dependencies = {
  uid: string;
  storeId: string;
  call: <T>(action: string, fields?: Record<string, unknown>) => Promise<T>;
  storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  requestId: () => string;
};
export function createSalonStore(deps: Dependencies) {
  const key = `cardap-salon-pending:${deps.uid}:${deps.storeId}`;
  let snapshot: Snapshot = {
    state: emptyWaiterState(),
    loading: true,
    ready: false,
    error: '',
    busy: false,
    pending: null,
    confirmedOperation: null,
  };
  let disposed = false,
    initialized = false,
    starting = false,
    reading = false,
    locked = false,
    revision = 0;
  const listeners = new Set<() => void>();
  const update = (patch: Partial<Snapshot>) => {
    if (!disposed) {
      snapshot = { ...snapshot, ...patch };
      listeners.forEach((fn) => fn());
    }
  };
  async function read() {
    if (disposed || reading) return;
    const version = revision;
    reading = true;
    try {
      const [data, menu] = await Promise.all([
        deps.call<SalonResponse>('list'),
        deps.call<{ products: Product[] }>('menu'),
      ]);
      if (disposed || version !== revision) return;
      update({
        state: fromSalonResponse(data, menu, deps.uid, deps.storeId),
        loading: false,
        ready: true,
        error: '',
      });
    } catch (error) {
      if (!disposed && version === revision)
        update({
          loading: false,
          ready: false,
          error: salonError(error),
          ...(accessError(error) ? { state: emptyWaiterState() } : {}),
        });
    } finally {
      reading = false;
    }
  }
  async function refresh() {
    if (!initialized) return start();
    if (!locked) await read();
  }
  async function start() {
    if (initialized || disposed || starting) return;
    starting = true;
    try {
      const saved = await deps.storage.getItem(key);
      if (disposed) return;
      if (saved) {
        const value = JSON.parse(saved) as PendingOperation;
        if (
          !['open', 'send', 'serve', 'requestBill', 'clean'].includes(
            value.action,
          ) ||
          !/^[a-zA-Z0-9_-]{8,80}$/.test(value.requestId) ||
          !value.fields ||
          typeof value.fields !== 'object' ||
          Array.isArray(value.fields)
        )
          throw new Error('Envio pendente inválido.');
        update({ pending: value });
      }
      initialized = true;
      await read();
    } catch {
      update({
        loading: false,
        ready: false,
        error:
          'Não foi possível recuperar o último envio. Tente atualizar novamente antes de continuar.',
      });
    } finally {
      starting = false;
    }
  }
  async function send(operation: PendingOperation, retry = false) {
    if (
      disposed ||
      locked ||
      !initialized ||
      (!retry && (!snapshot.ready || snapshot.pending))
    )
      return false;
    locked = true;
    revision++;
    update({ busy: true, error: '' });
    try {
      // Persist before sending. Every retry uses the exact same ID and fields.
      await deps.storage.setItem(key, JSON.stringify(operation));
      if (disposed) return false;
      update({ pending: operation });
      await deps.call(operation.action, {
        ...operation.fields,
        requestId: operation.requestId,
      });
      await deps.storage.removeItem(key);
      if (disposed) return false;
      update({ pending: null, confirmedOperation: operation });
      // Ignore any read started before the mutation, then load confirmed state.
      while (reading && !disposed)
        await new Promise((resolve) => setTimeout(resolve, 10));
      await read();
      return !disposed;
    } catch (error) {
      if (disposed) return false;
      if (definitiveError(error)) {
        try {
          await deps.storage.removeItem(key);
          update({ pending: null });
        } catch {
          /* Keep the same operation for a safe retry. */
        }
      }
      update({
        error: salonError(error),
        ready: false,
        ...(accessError(error) ? { state: emptyWaiterState() } : {}),
      });
      return false;
    } finally {
      locked = false;
      update({ busy: false });
    }
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (fn: () => void) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    start,
    refresh,
    mutate: async (action: SalonAction, fields: Record<string, unknown>) => {
      try {
        return await send({
          action,
          fields: JSON.parse(JSON.stringify(fields)),
          requestId: deps.requestId(),
        });
      } catch {
        update({
          error:
            'Não foi possível preparar o envio com segurança. Tente novamente.',
        });
        return false;
      }
    },
    retryPending: () =>
      snapshot.pending ? send(snapshot.pending, true) : Promise.resolve(false),
    dispose: () => {
      disposed = true;
      revision++;
      listeners.clear();
    },
  };
}
