import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
export function PreviewNote() {
  return (
    <View className="mt-4 self-start rounded-full bg-brand-50 px-3 py-1.5">
      <AppText variant="muted" className="text-xs text-ink">
        Prévia com dados de exemplo
      </AppText>
    </View>
  );
}
