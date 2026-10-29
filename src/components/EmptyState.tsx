import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from './ui/AppText';
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <View className="items-center py-14">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-[28px] bg-brand-50">
        {icon}
      </View>
      <AppText variant="heading" className="text-center">
        {title}
      </AppText>
      <AppText variant="muted" className="mt-3 max-w-xs text-center">
        {description}
      </AppText>
      {children && <View className="mt-7 w-full">{children}</View>}
    </View>
  );
}
