import { useState } from 'react';
import { useWaiter } from '@/contexts/WaiterContext';
export function useTables() {
  const { state, loading } = useWaiter();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const tables = state.tables.map((table) => {
    const orders = state.orders.filter((order) => order.tableId === table.id);
    return {
      ...table,
      total: table.total,
      ready: orders.filter((order) => order.status === 'ready').length,
      status: table.cleaning
        ? 'cleaning'
        : table.checkout
          ? 'checkout'
          : table.active
            ? 'occupied'
            : 'free',
    };
  });
  return {
    loading,
    tables,
    filter,
    setFilter,
    search,
    setSearch,
    visible: tables.filter(
      (table) =>
        (filter === 'all' || table.status === filter) &&
        table.name
          .toLocaleLowerCase('pt-BR')
          .includes(search.trim().toLocaleLowerCase('pt-BR')),
    ),
    occupied: tables.filter((table) => table.active).length,
    ready: state.orders.filter((order) => order.status === 'ready').length,
  };
}
