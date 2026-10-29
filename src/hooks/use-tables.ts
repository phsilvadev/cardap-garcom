import { useState } from 'react';
import { useWaiterDemo } from '@/contexts/WaiterDemoContext';
import { orderTotal } from '@/mocks/waiter';
export function useTables() {
  const { state } = useWaiterDemo();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const tables = state.tables.map((table) => {
    const orders = state.orders.filter((order) => order.tableId === table.id);
    return {
      ...table,
      total: orders.reduce((sum, order) => sum + orderTotal(order), 0),
      ready: orders.filter((order) => order.status === 'ready').length,
      status: table.checkout ? 'checkout' : table.active ? 'occupied' : 'free',
    };
  });
  return {
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
