import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react-native';
import { Image, Pressable, TextInput, View } from 'react-native';
import { Brand } from '@/components/Brand';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useLogin } from '@/hooks/use-login';
export function LoginScreen() {
  const navigation = useAppNavigation();
  const control = useLogin();
  return (
    <Screen>
      <Brand />
      <View className="mb-9 mt-10 flex-row items-center gap-4">
        <Image
          source={require('@assets/branding/cardap-garcom-icon.png')}
          style={{ width: 64, height: 64 }}
          resizeMode="contain"
          accessibilityLabel="Logo Cardap Garçom"
          className="rounded-3xl"
        />
        <View className="flex-1">
          <AppText variant="eyebrow">Cada mesa, de perto</AppText>
          <AppText variant="label" className="mt-1">
            Da mesa direto para a cozinha.
          </AppText>
        </View>
      </View>
      <AppText variant="title" className="text-[34px] leading-[40px]">
        Bom ter você{`\n`}por perto.
      </AppText>
      <AppText variant="muted" className="mb-8 mt-3">
        Entre com o acesso fornecido pelo seu restaurante.
      </AppText>
      <View className="gap-5">
        <View className="gap-2">
          <AppText variant="label" nativeID="email-label">
            E-mail
          </AppText>
          <View className="min-h-14 flex-row items-center gap-3 rounded-2xl border border-line px-4">
            <Mail size={19} color="#666666" />
            <TextInput
              accessibilityLabel="E-mail"
              className="min-h-14 flex-1 font-sans text-base text-ink outline-none"
              placeholder="seu@email.com"
              placeholderTextColor="#8A8A8A"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              value={control.email}
              onChangeText={control.setEmail}
              editable={!control.busy}
            />
          </View>
        </View>
        <View className="gap-2">
          <AppText variant="label">Senha</AppText>
          <View className="min-h-14 flex-row items-center gap-3 rounded-2xl border border-line px-4">
            <LockKeyhole size={19} color="#666666" />
            <TextInput
              accessibilityLabel="Senha"
              className="min-h-14 flex-1 font-sans text-base text-ink outline-none"
              placeholder="Sua senha"
              placeholderTextColor="#8A8A8A"
              secureTextEntry={!control.visible}
              autoComplete="current-password"
              textContentType="password"
              autoCapitalize="none"
              autoCorrect={false}
              value={control.password}
              onChangeText={control.setPassword}
              editable={!control.busy}
              returnKeyType="go"
              onSubmitEditing={() => void control.submit()}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                control.visible ? 'Ocultar senha' : 'Mostrar senha'
              }
              hitSlop={10}
              onPress={control.toggleVisible}
            >
              {control.visible ? (
                <EyeOff size={20} color="#666666" />
              ) : (
                <Eye size={20} color="#666666" />
              )}
            </Pressable>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          className="self-end py-1"
          onPress={() => navigation.navigate('AccessHelp')}
        >
          <AppText variant="label" className="underline">
            Preciso de ajuda para entrar
          </AppText>
        </Pressable>
        {control.error && (
          <AppText accessibilityRole="alert" className="text-sm text-danger">
            {control.error}
          </AppText>
        )}
        <AppButton
          label="Entrar no app"
          loading={control.busy}
          onPress={() => void control.submit()}
          icon={<ArrowUpRight size={19} color="#0A0A0A" />}
        />
      </View>
      <View className="mt-10 border-t border-line pt-6">
        <AppText variant="muted" className="text-center text-xs">
          O acesso é criado pelo restaurante.{`\n`}Ainda não tem o seu? Fale com
          o responsável pela loja.
        </AppText>
      </View>
    </Screen>
  );
}
