import {
  products,
  initialOrders,
  initialTables,
  type Table,
  type SalonOrder,
} from './waiter';
export type WaiterState = {
  tables: Table[];
  orders: SalonOrder[];
  nextOrder: number;
};
export const initialState: WaiterState = {
  tables: initialTables,
  orders: initialOrders,
  nextOrder: 2104,
};
export type WaiterAction =
  | { type: 'open'; tableId: string; guests: number }
  | {
      type: 'send';
      tableId: string;
      items: { productId: string; quantity: number }[];
      notes: string;
      time: string;
    }
  | { type: 'serve'; orderId: string }
  | { type: 'checkout'; tableId: string };
export function waiterReducer(
  state: WaiterState,
  action: WaiterAction,
): WaiterState {
  if (action.type === 'open')
    return {
      ...state,
      tables: state.tables.map((table) =>
        table.id === action.tableId && !table.active
          ? {
              ...table,
              active: true,
              guests: Math.max(1, Math.min(20, action.guests)),
            }
          : table,
      ),
    };
  if (action.type === 'serve')
    return {
      ...state,
      orders: state.orders.map((order) =>
        order.id === action.orderId && order.status === 'ready'
          ? { ...order, status: 'served' }
          : order,
      ),
    };
  const table = state.tables.find((table) => table.id === action.tableId);
  if (!table?.active || table.checkout) return state;
  if (action.type === 'checkout') {
    const orders = state.orders.filter((order) => order.tableId === table.id);
    if (!orders.length || orders.some((order) => order.status !== 'served'))
      return state;
    return {
      ...state,
      tables: state.tables.map((item) =>
        item.id === table.id ? { ...item, checkout: true } : item,
      ),
    };
  }
  if (
    !action.items.length ||
    action.items.some(
      (item) =>
        !products.some((product) => product.id === item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20,
    ) ||
    new Set(action.items.map((item) => item.productId)).size !==
      action.items.length
  )
    return state;
  const order: SalonOrder = {
    id: String(state.nextOrder),
    tableId: table.id,
    status: 'preparing',
    notes: action.notes.trim().slice(0, 500),
    time: action.time,
    items: action.items.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId,
      )!;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    }),
  };
  return {
    ...state,
    nextOrder: state.nextOrder + 1,
    orders: [order, ...state.orders],
  };
}
