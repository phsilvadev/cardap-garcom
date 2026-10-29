import { Pressable, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { BaseBottomSheet } from '@/components/BaseBottomSheet';
import { PreviewNote } from '@/components/PreviewNote';
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrders } from '@/hooks/use-orders';
import { money, orderTotal, orderStatuses } from '@/mocks/waiter';
export function OrdersScreen() {
  const control = useOrders();
  return (
    <>
      <Screen>
        <AppText variant="eyebrow" className="mt-3">
          Cozinha e salão em sintonia
        </AppText>
        <AppText variant="title" className="mt-1">
          Seus pedidos.
        </AppText>
        <AppText variant="muted" className="mt-2">
          Acompanhe o preparo e veja o que já pode ser servido.
        </AppText>
        <PreviewNote />
        <View className="my-6 flex-row items-center justify-between">
          <AppText variant="muted">{control.items.length} pedidos</AppText>
          <AppButton
            label="Filtrar"
            variant="secondary"
            onPress={control.openFilters}
          />
        </View>
        <View className="gap-5">
          {control.items.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              tableName={
                control.tables.find((table) => table.id === order.tableId)
                  ?.name ?? 'Mesa'
              }
              onDetails={() => control.showDetails(order.id)}
              onServe={() => control.askServe(order.id)}
            />
          ))}
          {!control.items.length && (
            <AppText variant="muted">Nenhum pedido neste filtro.</AppText>
          )}
        </View>
      </Screen>
      <BaseBottomSheet bottomSheetRef={control.filterRef}>
        <AppText variant="heading" className="mb-4">
          Filtrar pedidos
        </AppText>
        {[
          { id: 'all', label: 'Todos os pedidos' },
          ...Object.entries(orderStatuses).map(([id, value]) => ({
            id,
            label: value.label,
          })),
        ].map((option) => (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: control.draft === option.id }}
            onPress={() => control.setDraft(option.id)}
            className="min-h-12 flex-row items-center justify-between border-b border-line py-3"
          >
            <AppText variant="label">{option.label}</AppText>
            {control.draft === option.id && <Check size={19} color="#0A0A0A" />}
          </Pressable>
        ))}
        <AppButton
          label="Aplicar filtros"
          className="mt-6"
          onPress={control.applyFilters}
        />
        <AppButton
          label="Cancelar"
          variant="secondary"
          className="mt-3"
          onPress={() => control.filterRef.current?.dismiss()}
        />
      </BaseBottomSheet>
      <BaseBottomSheet
        bottomSheetRef={control.detailsRef}
        snapPoints={['65%', '90%']}
        scrollable
        onDismiss={control.clearDetails}
      >
        {control.selected && (
          <>
            <View className="mb-5 flex-row items-center justify-between">
              <AppText variant="heading">Pedido #{control.selected.id}</AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
                onPress={() => control.detailsRef.current?.dismiss()}
                className="h-10 w-10 items-center justify-center rounded-full bg-surface"
              >
                <X size={18} color="#0A0A0A" />
              </Pressable>
            </View>
            <AppText variant="heading">
              {
                control.tables.find(
                  (table) => table.id === control.selected?.tableId,
                )?.name
              }
            </AppText>
            <AppText variant="muted" className="mb-5 mt-2">
              {orderStatuses[control.selected.status].label} ·{' '}
              {control.selected.time}
            </AppText>
            {control.selected.items.map((item) => (
              <View
                key={item.productId}
                className="flex-row justify-between gap-4 border-b border-line py-4"
              >
                <AppText variant="label" className="flex-1">
                  {item.quantity} × {item.name}
                </AppText>
                <AppText variant="label">
                  {money(item.price * item.quantity)}
                </AppText>
              </View>
            ))}
            <AppText variant="heading" className="mt-6">
              Observações
            </AppText>
            <AppText variant="muted" className="mt-2">
              {control.selected.notes || 'Sem observações.'}
            </AppText>
            <AppText variant="heading" className="my-6">
              Total: {money(orderTotal(control.selected))}
            </AppText>
            <AppText variant="muted" className="mb-5">
              Demonstração local. Marcar um pedido como servido não fecha a
              conta da mesa.
            </AppText>
            <AppButton
              label="Fechar"
              variant="secondary"
              onPress={() => control.detailsRef.current?.dismiss()}
            />
          </>
        )}
      </BaseBottomSheet>
      <BaseBottomSheet
        bottomSheetRef={control.serveRef}
        onDismiss={control.clearServe}
      >
        {control.serving && (
          <>
            <AppText variant="heading">O cliente recebeu o pedido?</AppText>
            <AppText variant="muted" className="my-4">
              Pedido #{control.serving.id}. Confirme que todos os itens foram
              servidos. A comanda continuará aberta.
            </AppText>
            <AppButton label="Confirmar servido" onPress={control.serve} />
            <AppButton
              label="Cancelar"
              variant="secondary"
              className="mt-3"
              onPress={() => control.serveRef.current?.dismiss()}
            />
          </>
        )}
      </BaseBottomSheet>
    </>
  );
}
