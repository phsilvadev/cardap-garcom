import { useEffect, useRef, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  useBottomSheetModal,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useWaiter } from '@/contexts/WaiterContext';
import { useToast } from '@/contexts/ToastContext';
import { useAppNavigation } from '@/hooks/useAppNavigation';
export function useNewOrder(tableId: string) {
  const { state, mutate, disabled, confirmedOperation } = useWaiter();
  const products = state.products;
  const { showToast } = useToast();
  const navigation = useAppNavigation();
  const { dismissAll } = useBottomSheetModal();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const submitted = useRef(false);
  useFocusEffect(useCallback(() => () => dismissAll(), [dismissAll]));
  const table = state.tables.find((table) => table.id === tableId);
  const draftTab = useRef<string | null>(null);
  if (!draftTab.current && table?.tabId) draftTab.current = table.tabId;
  const canOrder =
    !!table?.active &&
    !table.checkout &&
    !table.cleaning &&
    table.tabId === draftTab.current;
  useEffect(() => {
    if (
      confirmedOperation?.action === 'send' &&
      confirmedOperation.fields.tableId === tableId &&
      confirmedOperation.fields.tabId === draftTab.current
    ) {
      setQuantities({});
      setNotes('');
    }
  }, [confirmedOperation, tableId]);
  const items = products
    .filter((product) => (quantities[product.id] ?? 0) > 0)
    .map((product) => ({ ...product, quantity: quantities[product.id] }));
  return {
    disabled,
    canOrder,
    categories: [
      'Todos',
      ...new Set(products.map((product) => product.category)),
    ],
    table,
    notes,
    setNotes,
    category,
    setCategory,
    search,
    setSearch,
    sheetRef,
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    visible: products.filter(
      (product) =>
        (category === 'Todos' || product.category === category) &&
        product.name
          .toLocaleLowerCase('pt-BR')
          .includes(search.trim().toLocaleLowerCase('pt-BR')),
    ),
    quantities,
    change: (id: string, delta: number) => {
      if (
        disabled ||
        products.find((product) => product.id === id)?.requiresCustomization
      )
        return;
      setQuantities((current) => ({
        ...current,
        [id]: Math.min(20, Math.max(0, (current[id] ?? 0) + delta)),
      }));
    },
    review: () => {
      if (!disabled && canOrder && items.length && items.length <= 20)
        sheetRef.current?.present();
    },
    send: async () => {
      if (
        disabled ||
        submitted.current ||
        !items.length ||
        items.length > 20 ||
        items.some((item) => item.requiresCustomization) ||
        !canOrder ||
        !table?.active ||
        table.checkout
      )
        return;
      submitted.current = true;
      const confirmed = await mutate('send', {
        tableId,
        tabId: table.tabId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        notes,
      });
      submitted.current = false;
      if (!confirmed) return;
      setQuantities({});
      setNotes('');
      sheetRef.current?.dismiss();
      showToast('Pedido enviado à cozinha.');
      navigation.goBack();
    },
  };
}
