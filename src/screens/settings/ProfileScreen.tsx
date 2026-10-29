import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { useAuth } from '@/contexts/AuthContext';
export function ProfileScreen() {
  const { user } = useAuth();
  return (
    <Screen>
      <PageHeader
        title="Seus dados."
        description="Seu cadastro é gerenciado pelo restaurante."
      />
      {[
        ['Nome completo', user?.name],
        ['E-mail', user?.email],
        ['Telefone', user?.phone],
        ['Restaurante', user?.storeName],
        ['Cargo', 'Garçom'],
      ].map(([label, value]) => (
        <View key={label} className="border-b border-line py-5">
          <AppText variant="muted" className="mb-2 text-xs">
            {label}
          </AppText>
          <AppText variant="label">{value || 'Não informado'}</AppText>
        </View>
      ))}
      <AppText variant="muted" className="mt-7">
        Precisa corrigir algum dado? Fale com o responsável pela loja.
      </AppText>
    </Screen>
  );
}
