import { ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { EmptyState } from '@/components/EmptyState';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/contexts/AuthContext';
export function AccessIssueScreen() {
  const auth = useAuth();
  return (
    <Screen>
      <Brand />
      <EmptyState
        icon={<ShieldCheck size={32} color="#0A0A0A" />}
        title="Vamos conferir seu acesso"
        description={
          auth.error ||
          'Não foi possível confirmar seu vínculo com o restaurante.'
        }
      >
        <View className="gap-3">
          <AppButton
            label="Tentar novamente"
            onPress={() => void auth.refresh()}
          />
          <AppButton
            label="Voltar para o login"
            variant="secondary"
            onPress={() => void auth.logout()}
          />
        </View>
      </EmptyState>
    </Screen>
  );
}
