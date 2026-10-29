import { KeyRound, Store, MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppNavigation } from '@/hooks/useAppNavigation';
const steps = [
  {
    icon: Store,
    title: 'Fale com o restaurante',
    body: 'Peça ao responsável para conferir seu cadastro como garçom e liberar o acesso ao app.',
  },
  {
    icon: MessageCircle,
    title: 'Receba seu link de acesso',
    body: 'O responsável compartilha um link individual com você. Abra esse link para definir sua senha.',
  },
  {
    icon: KeyRound,
    title: 'Volte e entre no app',
    body: 'Use o e-mail do seu cadastro e a senha que acabou de definir. Se o link venceu, solicite um novo.',
  },
];
export function AccessHelpScreen() {
  const navigation = useAppNavigation();
  return (
    <Screen>
      <PageHeader
        title="Vamos ajudar você a entrar."
        description="Primeiro acesso ou esqueceu a senha? O restaurante ajuda a resolver."
      />
      <View className="gap-7">
        {steps.map((step, index) => (
          <View key={step.title} className="flex-row gap-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-50">
              <step.icon size={21} color="#0A0A0A" />
            </View>
            <View className="flex-1">
              <AppText variant="label" className="font-semibold">
                {index + 1}. {step.title}
              </AppText>
              <AppText variant="muted" className="mt-2">
                {step.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <View className="mt-10">
        <AppButton
          label="Voltar para entrar"
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
