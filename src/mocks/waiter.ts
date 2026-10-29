export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
};
export type Table = {
  id: string;
  name: string;
  guests: number;
  active: boolean;
  checkout: boolean;
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
  status: 'preparing' | 'ready' | 'served';
  items: OrderLine[];
  notes: string;
  time: string;
};
export const products: Product[] = [
  {
    id: 'burger',
    name: 'Hambúrguer da casa',
    description: 'Pão brioche, carne e queijo',
    category: 'Lanches',
    price: 2990,
  },
  {
    id: 'combo',
    name: 'Combo artesanal',
    description: 'Hambúrguer e batata frita',
    category: 'Lanches',
    price: 3990,
  },
  {
    id: 'executivo',
    name: 'Prato executivo',
    description: 'Arroz, feijão, frango e salada',
    category: 'Pratos',
    price: 3290,
  },
  {
    id: 'batata',
    name: 'Batata frita',
    description: 'Porção para compartilhar',
    category: 'Porções',
    price: 1890,
  },
  {
    id: 'refri',
    name: 'Refrigerante',
    description: 'Lata de 350 ml',
    category: 'Bebidas',
    price: 650,
  },
  {
    id: 'suco',
    name: 'Suco natural',
    description: 'Copo de 300 ml',
    category: 'Bebidas',
    price: 900,
  },
];
export const initialTables: Table[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  name: `Mesa ${String(i + 1).padStart(2, '0')}`,
  guests: i === 3 ? 4 : [0, 4].includes(i) ? 2 : 0,
  active: [0, 3, 4].includes(i),
  checkout: false,
}));
const line = (id: string, quantity: number): OrderLine => {
  const product = products.find((item) => item.id === id)!;
  return { productId: id, name: product.name, quantity, price: product.price };
};
export const initialOrders: SalonOrder[] = [
  {
    id: '2103',
    tableId: '1',
    status: 'ready',
    items: [line('burger', 2), line('refri', 2)],
    notes: 'Um hambúrguer sem cebola.',
    time: '14:40',
  },
  {
    id: '2102',
    tableId: '4',
    status: 'preparing',
    items: [line('executivo', 2), line('suco', 2)],
    notes: 'Molho separado.',
    time: '14:35',
  },
  {
    id: '2101',
    tableId: '5',
    status: 'ready',
    items: [line('combo', 1)],
    notes: '',
    time: '14:30',
  },
  {
    id: '2100',
    tableId: '1',
    status: 'served',
    items: [line('batata', 1)],
    notes: '',
    time: '14:10',
  },
];
export const orderStatuses = {
  preparing: { label: 'Em preparo', classes: 'bg-brand-50 text-ink' },
  ready: { label: 'Pronto para servir', classes: 'bg-green-50 text-success' },
  served: { label: 'Servido', classes: 'bg-surface text-muted' },
};
export const money = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const orderTotal = (order: SalonOrder) =>
  order.items.reduce((sum, line) => sum + line.price * line.quantity, 0);
