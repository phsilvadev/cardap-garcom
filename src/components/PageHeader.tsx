import { ArrowLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { AppText } from './ui/AppText';
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const navigation = useAppNavigation();
  return (
    <View className="mb-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={12}
        onPress={() => navigation.goBack()}
        className="mb-7 h-11 w-11 items-center justify-center rounded-full border border-line"
      >
        <ArrowLeft size={20} color="#0A0A0A" />
      </Pressable>
      <AppText variant="title">{title}</AppText>
      {description && (
        <AppText variant="muted" className="mt-2">
          {description}
        </AppText>
      )}
    </View>
  );
}
