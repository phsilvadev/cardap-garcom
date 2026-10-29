import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, Platform, Pressable, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { CircleCheck, CircleAlert, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
type ToastType = 'success' | 'error';
type Toast = { id: number; message: string; type: ToastType };
type Value = { showToast: (message: string, type?: ToastType) => void };
const Context = createContext<Value | undefined>(undefined);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);
  const insets = useSafeAreaInsets();
  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setToast(null);
  }, []);
  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      const id = ++nextId.current;
      setToast({ id, message, type });
      if (Platform.OS === 'ios')
        AccessibilityInfo.announceForAccessibility(message);
      timer.current = setTimeout(
        () => {
          setToast((current) => (current?.id === id ? null : current));
          timer.current = null;
        },
        type === 'error' ? 5000 : 3500,
      );
    },
    [],
  );
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const Icon = toast?.type === 'error' ? CircleAlert : CircleCheck;
  return (
    <Context.Provider value={{ showToast }}>
      {children}
      <View
        pointerEvents="box-none"
        className="absolute left-4 right-4 z-50 items-center"
        style={{ top: insets.top + 12, elevation: 10000 }}
      >
        {toast && (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.duration(180)}
            exiting={FadeOutUp.duration(140)}
            style={{ width: '100%', maxWidth: 576 }}
          >
            <View
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              className="w-full flex-row items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-lg"
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${toast.type === 'error' ? 'bg-red-50' : 'bg-brand-50'}`}
              >
                <Icon
                  size={20}
                  color={toast.type === 'error' ? '#BA2525' : '#0A0A0A'}
                />
              </View>
              <AppText variant="label" className="flex-1 leading-5">
                {toast.message}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar aviso"
                hitSlop={10}
                onPress={hide}
                className="h-8 w-8 items-center justify-center"
              >
                <X size={17} color="#666666" />
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Context.Provider>
  );
}
export function useToast() {
  const value = useContext(Context);
  if (!value) throw new Error('ToastProvider não encontrado.');
  return value;
}
