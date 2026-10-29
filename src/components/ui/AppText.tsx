import { Text, type TextProps } from 'react-native';
const variants = {
  body: 'font-sans text-base leading-6 text-ink',
  muted: 'font-sans text-sm leading-5 text-muted',
  eyebrow: 'font-semibold text-xs uppercase tracking-[2px] text-muted',
  title: 'font-bold text-3xl leading-9 text-ink',
  heading: 'font-semibold text-xl leading-7 text-ink',
  label: 'font-medium text-sm text-ink',
};
export function AppText({
  variant = 'body',
  className = '',
  ...props
}: TextProps & { variant?: keyof typeof variants }) {
  return <Text className={`${variants[variant]} ${className}`} {...props} />;
}
