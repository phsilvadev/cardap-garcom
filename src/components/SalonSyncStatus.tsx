import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useWaiter } from '@/contexts/WaiterContext';
export function SalonSyncStatus() {
  const salon = useWaiter();
  if (!salon.loading && !salon.error && !salon.pending) return null;
  return (
    <View
      className="mt-4 rounded-2xl bg-brand-50 p-4"
      accessibilityLiveRegion="polite"
    >
      {salon.loading && (
        <AppText variant="muted">Carregando o salão da sua loja…</AppText>
      )}
      {!!salon.error && <AppText variant="muted">{salon.error}</AppText>}
      {salon.pending ? (
        <>
          <AppText variant="muted" className="mt-2">
            Um envio aguarda confirmação. Repita o mesmo envio para conferir sem
            duplicar pedidos.
          </AppText>
          <AppButton
            label="Confirmar envio pendente"
            className="mt-3"
            loading={salon.busy}
            onPress={() => void salon.retryPending()}
          />
        </>
      ) : (
        !!salon.error && (
          <AppButton
            label="Atualizar salão"
            className="mt-3"
            onPress={() => void salon.refresh()}
          />
        )
      )}
    </View>
  );
}
