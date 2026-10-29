import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
}
export async function logout() {
  await signOut(auth);
}
