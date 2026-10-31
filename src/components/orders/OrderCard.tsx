import type { SalonOrder } from '@/types/salon';
import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { money, orderTotal, orderStatuses } from '@/utils/salon-state';
export function OrderCard({
  order,
  tableName,
  onDetails,
  onServe,
}: {
  order: SalonOrder;
  tableName: string;
  onDetails: () => void;
  onServe?: () => void;
}) {
  const status = orderStatuses[order.status];
  return (
    <View
      className={`rounded-3xl border bg-white p-5 ${order.status === 'ready' ? 'border-brand' : 'border-line'}`}
    >
      <View className="flex-row items-center justify-between gap-2">
        <AppText variant="label" className="font-semibold">
          Pedido #{order.id}
        </AppText>
        <View className={`rounded-full px-3 py-1.5 ${status.classes}`}>
          <AppText variant="label" className={`text-[11px] ${status.classes}`}>
            {status.label}
          </AppText>
        </View>
      </View>
      <AppText variant="heading" className="mt-4">
        {tableName}
      </AppText>
      <AppText variant="muted" className="mt-2">
        {order.items
          .map((item) => `${item.quantity} × ${item.name}`)
          .join(' · ')}
      </AppText>
      <View className="my-4 flex-row justify-between">
        <AppText variant="muted" className="text-xs">
          Enviado às {order.time}
        </AppText>
        <AppText variant="label">{money(orderTotal(order))}</AppText>
      </View>
      {order.status === 'ready' && onServe && (
        <AppButton label="Marcar como servido" onPress={onServe} />
      )}
      <AppButton
        label="Ver detalhes"
        variant="secondary"
        className="mt-3"
        onPress={onDetails}
      />
    </View>
  );
}
