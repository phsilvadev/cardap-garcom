import { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  useBottomSheetModal,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useWaiter } from '@/contexts/WaiterContext';
import { useToast } from '@/contexts/ToastContext';
export function useTableDetails(tableId: string) {
  const { state, mutate, disabled } = useWaiter();
  const { showToast } = useToast();
  const { dismissAll } = useBottomSheetModal();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [guests, setGuests] = useState(2);
  const table = state.tables.find((table) => table.id === tableId);
  const orders = state.orders.filter(
    (order) => order.tableId === tableId && order.tabId === table?.tabId,
  );
  useFocusEffect(useCallback(() => () => dismissAll(), [dismissAll]));
  return {
    table,
    orders,
    guests,
    setGuests,
    sheetRef,
    total: table?.total ?? 0,
    disabled,
    canCheckout:
      orders.length > 0 &&
      orders.every((order) => ['served', 'cancelled'].includes(order.status)) &&
      table?.active &&
      !table.checkout &&
      !disabled,
    cleanTable: async () => {
      if (disabled || !table?.cleaning || !table.tabId) return;
      if (await mutate('clean', { tableId, tabId: table.tabId }))
        showToast('Mesa liberada para outro atendimento.');
    },
    openTable: async () => {
      if (disabled || !table || table.active || table.cleaning) return;
      if (!(await mutate('open', { tableId, guests }))) return;
      sheetRef.current?.dismiss();
      showToast('Mesa aberta. Você já pode adicionar o primeiro pedido.');
    },
    requestCheckout: async () => {
      if (disabled || !table?.tabId) return;
      if (
        !orders.length ||
        orders.some((order) => !['served', 'cancelled'].includes(order.status))
      ) {
        showToast(
          'Sirva os pedidos pendentes antes de solicitar a conta.',
          'error',
        );
        return;
      }
      if (!(await mutate('requestBill', { tableId, tabId: table.tabId })))
        return;
      showToast('Solicitação de conta enviada ao caixa.');
    },
  };
}
