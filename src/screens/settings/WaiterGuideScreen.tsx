import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
export function WaiterGuideScreen() {
  return (
    <Screen>
      <PageHeader
        title="Da mesa à cozinha."
        description="Um caminho simples para cuidar do atendimento."
      />
      {[
        [
          'Abra a mesa',
          'Confira o número da mesa e a quantidade de pessoas para abrir a comanda.',
        ],
        [
          'Monte o pedido',
          'Selecione os produtos, quantidades e observações. Revise com o cliente antes de enviar.',
        ],
        [
          'Envie para a cozinha',
          'O pedido entra em preparo. Novas rodadas ficam na mesma comanda.',
        ],
        [
          'Sirva o cliente',
          'Acompanhe os pedidos prontos e confirme quando todos os itens forem servidos.',
        ],
        [
          'Solicite a conta',
          'Depois de servir todos os pedidos, avise o caixa. O pagamento e o encerramento são feitos pelo responsável.',
        ],
      ].map(([title, body], index) => (
        <View key={title} className="mb-7 flex-row gap-4">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-50">
            <AppText variant="label">{index + 1}</AppText>
          </View>
          <View className="flex-1">
            <AppText variant="heading" className="text-lg">
              {title}
            </AppText>
            <AppText variant="muted" className="mt-2">
              {body}
            </AppText>
          </View>
        </View>
      ))}
    </Screen>
  );
}
