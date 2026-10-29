import { useRoute, type RouteProp } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { BaseBottomSheet } from '@/components/BaseBottomSheet';
import { PreviewNote } from '@/components/PreviewNote';
import { useTableDetails } from '@/hooks/use-table-details';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import type { RootStackParamList } from '@/types/navigation';
import { money, orderStatuses } from '@/mocks/waiter';
export function TableDetailsScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'TableDetails'>>();
  const control = useTableDetails(params.tableId);
  const navigation = useAppNavigation();
  if (!control.table)
    return (
      <Screen>
        <PageHeader title="Mesa não encontrada." />
      </Screen>
    );
  const table = control.table;
  return (
    <>
      <Screen>
        <PageHeader
          title={`${table.name}.`}
          description={
            table.active
              ? 'Acompanhe a comanda e envie novas rodadas.'
              : 'Abra a mesa para iniciar o atendimento.'
          }
        />
        <PreviewNote />
        {!table.active ? (
          <View className="mt-7">
            <AppButton
              label="Abrir mesa"
              onPress={() => control.sheetRef.current?.present()}
            />
          </View>
        ) : (
          <>
            <View className="my-6 rounded-3xl bg-brand p-6">
              <AppText variant="label">
                Total da comanda · {table.guests} pessoas
              </AppText>
              <AppText variant="title" className="mt-3">
                {money(control.total)}
              </AppText>
              <AppText variant="muted" className="mt-2 text-ink">
                {table.checkout
                  ? 'Conta solicitada ao caixa'
                  : 'Comanda aberta'}
              </AppText>
            </View>
            <AppButton
              label="Adicionar pedido"
              disabled={table.checkout}
              onPress={() =>
                navigation.navigate('NewOrder', { tableId: table.id })
              }
            />
            <AppText variant="heading" className="mb-4 mt-8">
              Pedidos desta mesa
            </AppText>
            <View className="gap-4">
              {control.orders.length ? (
                control.orders.map((order) => (
                  <View key={order.id} className="border-b border-line pb-5">
                    <View className="flex-row justify-between gap-3">
                      <AppText variant="label" className="font-semibold">
                        #{order.id}
                      </AppText>
                      <AppText variant="muted">
                        {orderStatuses[order.status].label}
                      </AppText>
                    </View>
                    <AppText variant="muted" className="mt-2">
                      {order.items
                        .map((item) => `${item.quantity} × ${item.name}`)
                        .join(' · ')}
                    </AppText>
                    {order.notes && (
                      <AppText variant="muted" className="mt-2 text-xs">
                        Obs.: {order.notes}
                      </AppText>
                    )}
                  </View>
                ))
              ) : (
                <AppText variant="muted">
                  A mesa está aberta. Adicione o primeiro pedido.
                </AppText>
              )}
            </View>
            <View className="mt-8">
              <AppButton
                label={
                  table.checkout
                    ? 'Conta já solicitada'
                    : 'Solicitar conta ao caixa'
                }
                variant="secondary"
                disabled={!control.canCheckout}
                onPress={control.requestCheckout}
              />
              <AppText variant="muted" className="mt-3 text-xs">
                Servir os pedidos não fecha a comanda. O caixa é responsável
                pelo pagamento e encerramento.
              </AppText>
            </View>
          </>
        )}
      </Screen>
      <BaseBottomSheet bottomSheetRef={control.sheetRef}>
        <AppText variant="heading">Abrir {table.name.toLowerCase()}?</AppText>
        <AppText variant="muted" className="mt-3">
          Quantas pessoas vão ocupar esta mesa?
        </AppText>
        <View className="my-7 flex-row items-center justify-center gap-8">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Diminuir pessoas"
            onPress={() => control.setGuests(Math.max(1, control.guests - 1))}
            className="h-12 w-12 items-center justify-center rounded-full border border-line"
          >
            <Minus size={20} color="#0A0A0A" />
          </Pressable>
          <AppText variant="title">{control.guests}</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar pessoa"
            onPress={() => control.setGuests(Math.min(20, control.guests + 1))}
            className="h-12 w-12 items-center justify-center rounded-full bg-brand"
          >
            <Plus size={20} color="#0A0A0A" />
          </Pressable>
        </View>
        <AppButton label="Confirmar abertura" onPress={control.openTable} />
        <AppButton
          label="Cancelar"
          variant="secondary"
          className="mt-3"
          onPress={() => control.sheetRef.current?.dismiss()}
        />
      </BaseBottomSheet>
    </>
  );
}
