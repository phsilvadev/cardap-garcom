import {
  ArrowUpRight,
  ClipboardList,
  ConciergeBell,
  UsersRound,
  CircleHelp,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { PreviewNote } from '@/components/PreviewNote';
import { useAuth } from '@/contexts/AuthContext';
import { useTables } from '@/hooks/use-tables';
import { useAppNavigation } from '@/hooks/useAppNavigation';
export function HomeScreen() {
  const { user } = useAuth();
  const control = useTables();
  const navigation = useAppNavigation();
  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <Brand />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajuda"
          onPress={() => navigation.navigate('Help')}
          className="h-11 w-11 items-center justify-center rounded-full border border-line"
        >
          <CircleHelp size={21} color="#0A0A0A" />
        </Pressable>
      </View>
      <AppText variant="eyebrow" className="mt-9">
        Seu salão, bem cuidado
      </AppText>
      <AppText variant="title" className="mt-2">
        Olá, {user?.name.split(' ')[0]}.
      </AppText>
      <AppText variant="muted" className="mt-2">
        Um bom atendimento começa por aqui.
      </AppText>
      <View className="mt-6 rounded-3xl bg-brand p-6">
        <AppText variant="label">Seu restaurante</AppText>
        <AppText variant="heading" className="mt-3 text-2xl">
          {user?.storeName}
        </AppText>
        <AppText variant="body" className="mt-2 text-sm">
          Da mesa direto para a cozinha, com cada detalhe no lugar.
        </AppText>
      </View>
      <PreviewNote />
      <View className="my-7 flex-row gap-5 border-b border-line pb-6">
        <View className="flex-1">
          <UsersRound size={22} color="#0A0A0A" />
          <AppText variant="heading" className="mt-3">
            {control.occupied}
          </AppText>
          <AppText variant="muted" className="mt-1 text-xs">
            mesas em atendimento
          </AppText>
        </View>
        <View className="flex-1">
          <ConciergeBell size={22} color="#0A0A0A" />
          <AppText variant="heading" className="mt-3">
            {control.ready}
          </AppText>
          <AppText variant="muted" className="mt-1 text-xs">
            pedidos prontos
          </AppText>
        </View>
      </View>
      <AppButton
        label="Ver mesas"
        onPress={() => navigation.navigate('Tabs', { screen: 'Tables' })}
      />
      <AppButton
        label="Acompanhar pedidos"
        variant="secondary"
        className="mt-3"
        onPress={() => navigation.navigate('Tabs', { screen: 'Orders' })}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('WaiterGuide')}
        className="mt-6 flex-row items-center gap-3 py-5"
      >
        <ClipboardList size={22} color="#0A0A0A" />
        <AppText variant="label" className="flex-1">
          Como funciona o atendimento
        </AppText>
        <ArrowUpRight size={19} color="#0A0A0A" />
      </Pressable>
    </Screen>
  );
}
