import test from 'node:test';
import assert from 'node:assert/strict';
import { createSalonStore } from '../src/services/salon-store.ts';
import { fromSalonResponse } from '../src/utils/salon-state.ts';
const failure = (code) => Object.assign(new Error('Falha de teste'), { code });
const sample = () => ({
  actor: { uid: 'waiter', storeId: 'store', role: 'waiter' },
  tables: [
    {
      id: 'table',
      name: 'Mesa real',
      guests: 2,
      status: 'occupied',
      tabId: 'tab',
      tab: { totalCents: 3450 },
    },
    {
      id: 'dirty',
      name: 'Mesa a limpar',
      guests: 0,
      status: 'awaiting_cleaning',
      tabId: 'closed',
      tab: { totalCents: 5000 },
    },
  ],
  orders: [
    {
      id: 'order',
      tableId: 'table',
      tabId: 'tab',
      status: 'new',
      items: [
        {
          productId: 'product',
          name: 'Produto real',
          quantity: 1,
          price: 3450,
        },
      ],
      notes: '',
      time: '12:00',
    },
    {
      id: 'old',
      tableId: 'table',
      tabId: 'old-tab',
      status: 'served',
      items: [],
      notes: '',
      time: '11:00',
    },
  ],
});
function fixture(options = {}) {
  const records = options.records ?? new Map(),
    calls = [],
    accepted = new Map();
  let failRead = false,
    denied = false,
    timeoutOnce = false,
    failStorage = false;
  const state = sample();
  const deps = {
    uid: 'waiter',
    storeId: 'store',
    requestId: () => `request-${calls.length}`,
    storage: {
      getItem: async (key) => records.get(key) ?? null,
      setItem: async (key, value) => {
        if (failStorage) throw Error('disk');
        records.set(key, value);
      },
      removeItem: async (key) => records.delete(key),
    },
    call: async (action, fields) => {
      calls.push({ action, fields });
      if (denied) throw failure('functions/permission-denied');
      if (['list', 'menu'].includes(action)) {
        if (failRead) throw failure('functions/unavailable');
        return action === 'list'
          ? structuredClone(state)
          : {
              products: [
                {
                  id: 'product',
                  name: 'Produto real',
                  description: '',
                  category: 'Categoria real',
                  price: 3450,
                  requiresCustomization: false,
                },
              ],
            };
      }
      const fingerprint = JSON.stringify({ action, fields });
      const previous = accepted.get(fields.requestId);
      if (previous && previous !== fingerprint)
        throw Error('Changed retry payload');
      accepted.set(fields.requestId, fingerprint);
      if (timeoutOnce) {
        timeoutOnce = false;
        throw failure('functions/deadline-exceeded');
      }
      return { ok: true };
    },
  };
  return {
    store: createSalonStore(deps),
    deps,
    calls,
    records,
    accepted,
    state,
    setFailRead: (value) => (failRead = value),
    setDenied: (value) => (denied = value),
    setTimeout: (value) => (timeoutOnce = value),
    setFailStorage: (value) => (failStorage = value),
  };
}
test('carrega apenas dados remotos da loja e da comanda atual', async () => {
  const f = fixture();
  await f.store.start();
  const s = f.store.getSnapshot();
  assert.equal(s.ready, true);
  assert.equal(s.state.tables[0].total, 3450);
  assert.equal(s.state.tables[1].cleaning, true);
  assert.equal(s.state.tables[1].active, false);
  assert.equal(s.state.orders.length, 1);
  assert.equal(s.state.orders[0].status, 'new');
  assert.equal(s.state.products[0].name, 'Produto real');
});
test('não inventa mesas ou produtos quando o serviço falha', async () => {
  const f = fixture();
  f.setFailRead(true);
  await f.store.start();
  assert.equal(f.store.getSnapshot().ready, false);
  assert.deepEqual(f.store.getSnapshot().state, {
    tables: [],
    orders: [],
    products: [],
  });
  assert.equal(
    await f.store.mutate('open', { tableId: 'table', guests: 2 }),
    false,
  );
  f.setFailRead(false);
  await f.store.refresh();
  assert.equal(f.store.getSnapshot().ready, true);
});
test('envia abertura, pedido, serviço, conta e limpeza com contexto e sem preços do cliente', async () => {
  const f = fixture();
  await f.store.start();
  for (const [action, fields] of [
    ['open', { tableId: 'table', guests: 2 }],
    [
      'send',
      {
        tableId: 'table',
        tabId: 'tab',
        items: [{ productId: 'product', quantity: 2 }],
        notes: 'Sem cebola',
      },
    ],
    ['serve', { tableId: 'table', tabId: 'tab', orderId: 'order' }],
    ['requestBill', { tableId: 'table', tabId: 'tab' }],
    ['clean', { tableId: 'dirty', tabId: 'closed' }],
  ]) {
    assert.equal(await f.store.mutate(action, fields), true);
    const last = f.calls.filter((x) => x.action === action).at(-1);
    assert.deepEqual(last.fields, {
      ...fields,
      requestId: last.fields.requestId,
    });
  }
  assert.equal(f.records.size, 0);
  assert.equal(f.accepted.size, 5);
});
test('timeout preserva envio e reenvio usa exatamente o mesmo ID e itens', async () => {
  const f = fixture();
  await f.store.start();
  f.setTimeout(true);
  const fields = {
    tableId: 'table',
    tabId: 'tab',
    items: [{ productId: 'product', quantity: 2 }],
    notes: 'teste',
  };
  assert.equal(await f.store.mutate('send', fields), false);
  fields.items[0].quantity = 9;
  const pending = f.store.getSnapshot().pending;
  assert.ok(pending);
  assert.equal(await f.store.mutate('send', fields), false);
  assert.equal(await f.store.retryPending(), true);
  const sends = f.calls.filter((x) => x.action === 'send');
  assert.equal(sends.length, 2);
  assert.deepEqual(sends[0].fields, sends[1].fields);
  assert.equal(sends[1].fields.items[0].quantity, 2);
  assert.equal(f.accepted.size, 1);
  assert.equal(
    f.store.getSnapshot().confirmedOperation.requestId,
    pending.requestId,
  );
  assert.equal(f.store.getSnapshot().pending, null);
});
test('retoma o mesmo envio após reiniciar e não compartilha pendências entre contas', async () => {
  const f = fixture();
  await f.store.start();
  f.setTimeout(true);
  await f.store.mutate('send', {
    tableId: 'table',
    tabId: 'tab',
    items: [{ productId: 'product', quantity: 1 }],
  });
  const expected = f.store.getSnapshot().pending;
  f.store.dispose();
  const resumed = createSalonStore(f.deps);
  await resumed.start();
  assert.deepEqual(resumed.getSnapshot().pending, expected);
  await resumed.retryPending();
  assert.equal(f.accepted.size, 1);
  const other = createSalonStore({ ...f.deps, uid: 'other' });
  await other.start();
  assert.equal(other.getSnapshot().pending, null);
  assert.deepEqual(other.getSnapshot().state, {
    tables: [],
    orders: [],
    products: [],
  });
});
test('acesso removido limpa dados anteriores e bloqueia operações', async () => {
  const f = fixture();
  await f.store.start();
  f.setDenied(true);
  await f.store.refresh();
  assert.deepEqual(f.store.getSnapshot().state, {
    tables: [],
    orders: [],
    products: [],
  });
  assert.equal(f.store.getSnapshot().ready, false);
});
test('não envia sem conseguir persistir a operação', async () => {
  const f = fixture();
  await f.store.start();
  f.setFailStorage(true);
  assert.equal(
    await f.store.mutate('open', { tableId: 'table', guests: 2 }),
    false,
  );
  assert.equal(
    f.calls.some((x) => x.action === 'open'),
    false,
  );
});
test('mudança de usuário/loja é rejeitada pelo adaptador', () => {
  for (const actor of [
    { uid: 'other', storeId: 'store', role: 'waiter' },
    { uid: 'waiter', storeId: 'other', role: 'waiter' },
    { uid: 'waiter', storeId: 'store', role: 'courier' },
  ])
    assert.throws(
      () =>
        fromSalonResponse(
          { ...sample(), actor },
          { products: [] },
          'waiter',
          'store',
        ),
      { code: 'functions/permission-denied' },
    );
});
test('resposta de uma sessão descartada não reaparece no aplicativo', async () => {
  const f = fixture();
  let resolve;
  const wait = new Promise((r) => (resolve = r));
  const store = createSalonStore({
    ...f.deps,
    call: async (action) => {
      await wait;
      return action === 'list' ? sample() : { products: [] };
    },
  });
  const starting = store.start();
  await new Promise((r) => setTimeout(r, 0));
  store.dispose();
  resolve();
  await starting;
  assert.equal(store.getSnapshot().ready, false);
  assert.deepEqual(store.getSnapshot().state, {
    tables: [],
    orders: [],
    products: [],
  });
});

test('falha ao limpar pendência depois do aceite continua com o mesmo ID', async () => {
  const f = fixture();
  let cannotRemove = true;
  const store = createSalonStore({
    ...f.deps,
    storage: {
      ...f.deps.storage,
      removeItem: async (key) => {
        if (cannotRemove) throw Error('disk');
        f.records.delete(key);
      },
    },
  });
  await store.start();
  assert.equal(
    await store.mutate('open', { tableId: 'table', guests: 2 }),
    false,
  );
  const pending = store.getSnapshot().pending;
  assert.ok(pending);
  cannotRemove = false;
  assert.equal(await store.retryPending(), true);
  assert.equal(f.accepted.size, 1);
  assert.equal(
    store.getSnapshot().confirmedOperation.requestId,
    pending.requestId,
  );
});

test('toques simultâneos enviam uma única operação', async () => {
  const f = fixture();
  await f.store.start();
  const results = await Promise.all([
    f.store.mutate('open', { tableId: 'table', guests: 2 }),
    f.store.mutate('open', { tableId: 'table', guests: 2 }),
  ]);
  assert.deepEqual(results, [true, false]);
  assert.equal(f.calls.filter((call) => call.action === 'open').length, 1);
});
