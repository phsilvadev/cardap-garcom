import { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  useBottomSheetModal,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useWaiterDemo } from '@/contexts/WaiterDemoContext';
import { useToast } from '@/contexts/ToastContext';
import { orderTotal } from '@/mocks/waiter';
export function useTableDetails(tableId: string) {
  const { state, dispatch } = useWaiterDemo();
  const { showToast } = useToast();
  const { dismissAll } = useBottomSheetModal();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [guests, setGuests] = useState(2);
  const table = state.tables.find((table) => table.id === tableId);
  const orders = state.orders.filter((order) => order.tableId === tableId);
  useFocusEffect(useCallback(() => () => dismissAll(), [dismissAll]));
  return {
    table,
    orders,
    guests,
    setGuests,
    sheetRef,
    total: orders.reduce((sum, order) => sum + orderTotal(order), 0),
    canCheckout:
      orders.length > 0 &&
      orders.every((order) => order.status === 'served') &&
      !table?.checkout,
    openTable: () => {
      dispatch({ type: 'open', tableId, guests });
      sheetRef.current?.dismiss();
      showToast('Mesa aberta. Você já pode adicionar o primeiro pedido.');
    },
    requestCheckout: () => {
      if (!orders.length || orders.some((order) => order.status !== 'served')) {
        showToast(
          'Sirva os pedidos pendentes antes de solicitar a conta.',
          'error',
        );
        return;
      }
      dispatch({ type: 'checkout', tableId });
      showToast('Solicitação de conta enviada ao caixa nesta demonstração.');
    },
  };
}
