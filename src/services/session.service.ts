import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/config/firebase';
import type { WaiterProfile } from '@/types/waiter';
export async function getWaiterSession(): Promise<WaiterProfile> {
  const { data } = await httpsCallable<Record<string, never>, WaiterProfile>(
    functions,
    'waiterGetSession',
  )({});
  if (
    !data ||
    data.uid !== auth.currentUser?.uid ||
    !data.storeId ||
    !data.employeeId ||
    typeof data.name !== 'string' ||
    typeof data.storeName !== 'string' ||
    data.role !== 'waiter'
  )
    throw new Error('Não foi possível confirmar seu vínculo de garçom.');
  return data;
}
