import type {
  SalonResponse,
  Product,
  WaiterState,
  SalonOrder,
} from '../types/salon';
export const emptyWaiterState = (): WaiterState => ({
  tables: [],
  orders: [],
  products: [],
});
export function fromSalonResponse(
  response: SalonResponse,
  menu: { products: Product[] },
  uid: string,
  storeId: string,
): WaiterState {
  if (
    response.actor?.uid !== uid ||
    response.actor.storeId !== storeId ||
    response.actor.role !== 'waiter'
  )
    throw Object.assign(
      new Error('O acesso ao salão não corresponde à sua loja.'),
      { code: 'functions/permission-denied' },
    );
  if (
    !Array.isArray(response.tables) ||
    !Array.isArray(response.orders) ||
    !Array.isArray(menu.products)
  )
    throw new Error('Resposta inválida do salão. Atualize novamente.');
  const tables = response.tables.map((table) => ({
    id: table.id,
    name: table.name,
    guests: table.guests,
    active: table.status === 'occupied' || table.status === 'bill_requested',
    checkout: table.status === 'bill_requested',
    cleaning: table.status === 'awaiting_cleaning',
    tabId: table.tabId,
    total: table.tab?.totalCents ?? 0,
  }));
  const tabs = new Map(tables.map((table) => [table.id, table.tabId]));
  return {
    tables,
    orders: response.orders.filter(
      (order) => tabs.get(order.tableId) === order.tabId,
    ),
    products: menu.products,
  };
}
export const orderStatuses = {
  new: { label: 'Aguardando cozinha', classes: 'bg-brand-50 text-ink' },
  preparing: { label: 'Em preparo', classes: 'bg-brand-50 text-ink' },
  ready: { label: 'Pronto para servir', classes: 'bg-green-50 text-success' },
  served: { label: 'Servido', classes: 'bg-surface text-muted' },
  cancelled: { label: 'Cancelado', classes: 'bg-surface text-muted' },
};
export const money = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const orderTotal = (order: SalonOrder) =>
  order.items.reduce((sum, line) => sum + line.price * line.quantity, 0);
export function salonError(error: unknown) {
  const e = error as { code?: string; message?: string };
  return e.code?.startsWith('functions/') &&
    ![
      'functions/internal',
      'functions/unavailable',
      'functions/deadline-exceeded',
    ].includes(e.code) &&
    e.message
    ? e.message
    : 'Não foi possível confirmar a operação. Confira a conexão e tente novamente.';
}
export const definitiveError = (error: unknown) =>
  [
    'functions/invalid-argument',
    'functions/failed-precondition',
    'functions/permission-denied',
    'functions/unauthenticated',
    'functions/not-found',
    'functions/already-exists',
    'functions/resource-exhausted',
  ].includes((error as { code?: string })?.code ?? '');
export const accessError = (error: unknown) =>
  ['functions/permission-denied', 'functions/unauthenticated'].includes(
    (error as { code?: string })?.code ?? '',
  );
