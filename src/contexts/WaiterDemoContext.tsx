import { createContext, useContext, useReducer, type ReactNode } from 'react';
import {
  initialState,
  waiterReducer,
  type WaiterAction,
  type WaiterState,
} from '@/mocks/waiter-state';
const Context = createContext<
  { state: WaiterState; dispatch: (action: WaiterAction) => void } | undefined
>(undefined);
export function WaiterDemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(waiterReducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}
export function useWaiterDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('WaiterDemoProvider não encontrado.');
  return value;
}
