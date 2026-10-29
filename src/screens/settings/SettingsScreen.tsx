import { useToast } from '@/contexts/ToastContext';
import {
  ChevronRight,
  ChartNoAxesCombined,
  CircleHelp,
  LogOut,
  UserRound,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useState } from 'react';
export function SettingsScreen() {
  const auth = useAuth();
  const { showToast } = useToast();
  const navigation = useAppNavigation();
  const [leaving, setLeaving] = useState(false);
  const logout = async () => {
    setLeaving(true);
    try {
      await auth.logout();
    } catch {
      showToast('Não foi possível sair. Tente novamente.', 'error');
    } finally {
      setLeaving(false);
    }
  };
  return (
    <Screen>
      <AppText variant="eyebrow" className="mt-3">
        Seu espaço no Cardap
      </AppText>
      <AppText variant="title" className="mt-3">
        Sua conta.
      </AppText>
      <View className="mb-8 mt-8 flex-row items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <AppText variant="heading" className="text-2xl">
            {auth.user?.name[0]}
          </AppText>
        </View>
        <View className="flex-1">
          <AppText variant="heading">{auth.user?.name}</AppText>
          <AppText variant="muted" className="mt-1">
            {auth.user?.storeName}
          </AppText>
        </View>
      </View>
      {[
        {
          icon: UserRound,
          label: 'Meus dados',
          description: 'Seu cadastro e vínculo com a loja',
          screen: 'Profile' as const,
        },
        {
          icon: ChartNoAxesCombined,
          label: 'Meu atendimento',
          description: 'Mesas e pedidos atendidos',
          screen: 'Progress' as const,
        },
        {
          icon: CircleHelp,
          label: 'Ajuda',
          description: 'Respostas para seguir com tranquilidade',
          screen: 'Help' as const,
        },
      ].map((item) => (
        <Pressable
          key={item.screen}
          accessibilityRole="button"
          className="flex-row items-center gap-4 border-t border-line py-6"
          onPress={() => navigation.navigate(item.screen)}
        >
          <item.icon size={22} color="#0A0A0A" />
          <View className="flex-1">
            <AppText variant="label" className="font-semibold">
              {item.label}
            </AppText>
            <AppText variant="muted" className="mt-1">
              {item.description}
            </AppText>
          </View>
          <ChevronRight size={20} color="#666666" />
        </Pressable>
      ))}
      <View className="mt-10">
        <AppButton
          label="Sair da conta"
          icon={<LogOut size={19} color="#BA2525" />}
          variant="danger"
          loading={leaving}
          onPress={() => void logout()}
        />
      </View>
      <AppText variant="muted" className="mt-8 text-center text-xs">
        Cardap Garçom · 1.0.0
      </AppText>
    </Screen>
  );
}
