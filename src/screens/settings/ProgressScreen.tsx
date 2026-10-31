import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { SalonSyncStatus } from '@/components/SalonSyncStatus';
import { useWaiter } from '@/contexts/WaiterContext';
export function ProgressScreen() {
  const { state } = useWaiter();
  const served = state.orders.filter(
    (order) => order.status === 'served',
  ).length;
  return (
    <Screen>
      <PageHeader
        title="Atendimento do salão."
        description="Cada mesa faz parte da sua rotina."
      />
      <SalonSyncStatus />
      <View className="mt-6 rounded-3xl bg-brand p-6">
        <AppText variant="label">Pedidos servidos</AppText>
        <AppText variant="title" className="mt-3 text-4xl">
          {served}
        </AppText>
        <AppText variant="muted" className="mt-2 text-ink">
          Nas comandas atuais do restaurante
        </AppText>
      </View>
      {[
        [
          'Mesas em atendimento',
          state.tables.filter((table) => table.active).length,
        ],
        [
          'Pedidos em preparo',
          state.orders.filter((order) =>
            ['new', 'preparing'].includes(order.status),
          ).length,
        ],
        [
          'Prontos para servir',
          state.orders.filter((order) => order.status === 'ready').length,
        ],
        [
          'Contas solicitadas',
          state.tables.filter((table) => table.checkout).length,
        ],
      ].map(([label, count]) => (
        <View
          key={label}
          className="flex-row items-center justify-between border-b border-line py-6"
        >
          <AppText variant="label">{label}</AppText>
          <AppText variant="heading">{count}</AppText>
        </View>
      ))}
    </Screen>
  );
}
