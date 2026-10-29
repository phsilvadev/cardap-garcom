import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
export function useLogin() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [validation, setValidation] = useState('');
  const submit = async () => {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setValidation('Preencha seu e-mail e sua senha para entrar.');
      return;
    }
    setValidation('');
    setBusy(true);
    try {
      await auth.login(email, password);
    } catch {
    } finally {
      setBusy(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    visible,
    toggleVisible: () => setVisible((value) => !value),
    busy,
    error: validation || auth.error,
    submit,
  };
}
