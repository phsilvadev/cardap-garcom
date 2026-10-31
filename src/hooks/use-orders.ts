import { useRef, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  useBottomSheetModal,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useWaiter } from '@/contexts/WaiterContext';
import { useToast } from '@/contexts/ToastContext';
export function useOrders() {
  const { state, mutate, disabled } = useWaiter();
  const { showToast } = useToast();
  const { dismissAll } = useBottomSheetModal();
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [servingId, setServingId] = useState<string | null>(null);
  const filterRef = useRef<BottomSheetModal>(null);
  const detailsRef = useRef<BottomSheetModal>(null);
  const serveRef = useRef<BottomSheetModal>(null);
  useEffect(() => {
    if (selectedId) detailsRef.current?.present();
  }, [selectedId]);
  useEffect(() => {
    if (servingId) serveRef.current?.present();
  }, [servingId]);
  useFocusEffect(useCallback(() => () => dismissAll(), [dismissAll]));
  return {
    disabled,
    filter,
    draft,
    setDraft,
    filterRef,
    detailsRef,
    serveRef,
    selected: state.orders.find((order) => order.id === selectedId),
    serving: state.orders.find((order) => order.id === servingId),
    tables: state.tables,
    items: state.orders.filter(
      (order) => filter === 'all' || order.status === filter,
    ),
    openFilters: () => {
      setDraft(filter);
      filterRef.current?.present();
    },
    applyFilters: () => {
      setFilter(draft);
      filterRef.current?.dismiss();
    },
    showDetails: (id: string) => setSelectedId(id),
    clearDetails: () => setSelectedId(null),
    askServe: (id: string) => setServingId(id),
    clearServe: () => setServingId(null),
    serve: async () => {
      const order = state.orders.find((order) => order.id === servingId);
      if (disabled || order?.status !== 'ready') return;
      if (
        !(await mutate('serve', {
          tableId: order.tableId,
          tabId: order.tabId,
          orderId: order.id,
        }))
      )
        return;
      serveRef.current?.dismiss();
      showToast('Pedido marcado como servido. A comanda continua aberta.');
    },
  };
}
