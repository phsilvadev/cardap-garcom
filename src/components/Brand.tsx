import { View, Text } from 'react-native';
import { AppText } from './ui/AppText';
export function Brand({ centered = false }: { centered?: boolean }) {
  return (
    <View
      className={`min-w-[140px] shrink-0 ${centered ? 'items-center' : ''}`}
    >
      <Text
        accessibilityLabel="Cardap"
        className={`font-wordmark text-[30px] leading-[44px] text-ink ${centered ? 'text-center' : ''}`}
      >
        cardap<Text className="text-brand">.</Text>
      </Text>
      <AppText
        variant="eyebrow"
        className={`mt-0.5 text-[9px] tracking-[2.5px] ${centered ? 'text-center' : ''}`}
      >
        Garçons
      </AppText>
    </View>
  );
}
