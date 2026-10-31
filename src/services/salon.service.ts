import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/config/firebase';
export async function salonOperation<T>(
  uid: string,
  storeId: string,
  action: string,
  fields: Record<string, unknown> = {},
): Promise<T> {
  if (auth.currentUser?.uid !== uid)
    throw Object.assign(
      new Error('Entre novamente com seu acesso de garçom.'),
      { code: 'functions/unauthenticated' },
    );
  const result = await httpsCallable<Record<string, unknown>, T>(
    functions,
    'salonOperations',
    { timeout: 15000 },
  )({ ...fields, storeId, action });
  if (auth.currentUser?.uid !== uid)
    throw Object.assign(new Error('A sessão mudou. Entre novamente.'), {
      code: 'functions/unauthenticated',
    });
  return result.data;
}
