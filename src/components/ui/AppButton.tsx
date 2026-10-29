import { Spinner } from '@/components/Spinner';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { AppText } from './AppText';
type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: ReactNode;
};
export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}: Props) {
  const background =
    variant === 'primary'
      ? 'bg-brand'
      : variant === 'danger'
        ? 'border border-red-200 bg-white'
        : 'border border-line bg-white';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      className={`min-h-14 flex-row items-center justify-center gap-3 rounded-full px-6 active:opacity-70 ${background} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {loading ? <Spinner size={20} color="#0A0A0A" /> : icon}
      <AppText
        variant="label"
        className={`font-semibold ${variant === 'danger' ? 'text-danger' : ''}`}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
