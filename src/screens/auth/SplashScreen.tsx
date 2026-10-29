import { Spinner } from '@/components/Spinner';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brand } from '@/components/Brand';
import { AppText } from '@/components/ui/AppText';
export function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="w-full max-w-xs items-center"
          accessibilityLabel="Conferindo acesso"
          accessibilityState={{ busy: true }}
        >
          <Brand centered />
          <View className="mt-6 flex-row items-center justify-center gap-3">
            <Spinner size={20} color="#0A0A0A" />
            <AppText variant="muted" className="text-center text-[13px]">
              Preparando seu atendimento…
            </AppText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
