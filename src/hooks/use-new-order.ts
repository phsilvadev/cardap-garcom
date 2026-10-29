import { useRef, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  useBottomSheetModal,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useWaiterDemo } from '@/contexts/WaiterDemoContext';
import { useToast } from '@/contexts/ToastContext';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { products } from '@/mocks/waiter';
export function useNewOrder(tableId: string) {
  const { state, dispatch } = useWaiterDemo();
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
  const items = products
    .filter((product) => (quantities[product.id] ?? 0) > 0)
    .map((product) => ({ ...product, quantity: quantities[product.id] }));
  return {
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
    change: (id: string, delta: number) =>
      setQuantities((current) => ({
        ...current,
        [id]: Math.min(20, Math.max(0, (current[id] ?? 0) + delta)),
      })),
    review: () => {
      if (items.length && table?.active && !table.checkout)
        sheetRef.current?.present();
    },
    send: () => {
      if (
        submitted.current ||
        !items.length ||
        !table?.active ||
        table.checkout
      )
        return;
      submitted.current = true;
      dispatch({
        type: 'send',
        tableId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        notes,
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      sheetRef.current?.dismiss();
      showToast('Pedido enviado à cozinha nesta demonstração.');
      navigation.goBack();
    },
  };
}
