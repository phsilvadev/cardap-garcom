export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  requiresCustomization: boolean;
};
export type Table = {
  id: string;
  name: string;
  guests: number;
  active: boolean;
  checkout: boolean;
  cleaning: boolean;
  tabId: string | null;
  total: number;
};
export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};
export type SalonOrder = {
  id: string;
  tableId: string;
  tabId: string;
  status: 'new' | 'preparing' | 'ready' | 'served' | 'cancelled';
  items: OrderLine[];
  notes: string;
  time: string;
};
export type SalonResponse = {
  actor: { uid: string; storeId: string; role: string };
  tables: {
    id: string;
    name: string;
    guests: number;
    status: 'available' | 'occupied' | 'bill_requested' | 'awaiting_cleaning';
    tabId: string | null;
    tab: { totalCents: number } | null;
  }[];
  orders: SalonOrder[];
};
export type WaiterState = {
  tables: Table[];
  orders: SalonOrder[];
  products: Product[];
};
export type SalonAction = 'open' | 'send' | 'serve' | 'requestBill' | 'clean';
export type PendingOperation = {
  action: SalonAction;
  fields: Record<string, unknown>;
  requestId: string;
};
