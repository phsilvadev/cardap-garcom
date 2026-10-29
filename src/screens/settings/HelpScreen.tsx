import { useToast } from '@/contexts/ToastContext';
import { Linking, View } from 'react-native';
import { Phone } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/contexts/AuthContext';
const questions = [
  [
    'Quem cria meu acesso?',
    'O responsável pelo restaurante cadastra você como garçom e compartilha o link para definir sua senha.',
  ],
  [
    'Esqueci a senha. O que faço?',
    'Solicite um novo link ao responsável pela loja.',
  ],
  [
    'Servir o pedido fecha a comanda?',
    'Não. A mesa pode fazer novas rodadas. O caixa confirma o pagamento e encerra o atendimento.',
  ],
  [
    'Como corrijo um pedido já enviado?',
    'Fale com a cozinha e com o responsável pela loja antes de enviar uma nova rodada.',
  ],
];
export function HelpScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const phone = user?.storePhone.replace(/\D/g, '') ?? '';
  const contact = async () => {
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      showToast('Não foi possível abrir o telefone neste aparelho.', 'error');
    }
  };
  return (
    <Screen>
      <PageHeader
        title="Pode contar com a gente."
        description="Algumas respostas para facilitar seu caminho."
      />
      {questions.map(([question, answer]) => (
        <View key={question} className="mb-6 border-b border-line pb-6">
          <AppText variant="label" className="font-semibold">
            {question}
          </AppText>
          <AppText variant="muted" className="mt-2">
            {answer}
          </AppText>
        </View>
      ))}
      {phone && (
        <AppButton
          label="Ligar para o restaurante"
          variant="secondary"
          icon={<Phone size={19} color="#0A0A0A" />}
          onPress={() => void contact()}
        />
      )}
      {!phone && (
        <AppText variant="muted" className="mt-4 text-center">
          Fale diretamente com o responsável pela sua loja.
        </AppText>
      )}
    </Screen>
  );
}
