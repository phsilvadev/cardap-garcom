import { Pressable, TextInput, View } from 'react-native';
import { ChevronRight, Search, UsersRound } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { SalonSyncStatus } from '@/components/SalonSyncStatus';
import { useTables } from '@/hooks/use-tables';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { money } from '@/utils/salon-state';
export function TablesScreen() {
  const control = useTables();
  const navigation = useAppNavigation();
  return (
    <Screen>
      <AppText variant="eyebrow" className="mt-3">
        Cada mesa, de perto
      </AppText>
      <AppText variant="title" className="mt-1">
        Suas mesas.
      </AppText>
      <AppText variant="muted" className="mt-2">
        Abra uma comanda e cuide de cada atendimento.
      </AppText>
      <SalonSyncStatus />
      <View className="mb-4 mt-6 flex-row items-center gap-3 rounded-2xl border border-line px-4">
        <Search size={19} color="#666666" />
        <TextInput
          accessibilityLabel="Buscar mesa"
          placeholder="Buscar mesa"
          placeholderTextColor="#888888"
          className="min-h-12 flex-1 font-sans text-base text-ink"
          value={control.search}
          onChangeText={control.setSearch}
        />
      </View>
      <View className="mb-5 flex-row flex-wrap gap-2">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'occupied', label: 'Em atendimento' },
          { id: 'free', label: 'Livres' },
          { id: 'cleaning', label: 'Limpeza' },
        ].map((filter) => (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            onPress={() => control.setFilter(filter.id)}
            className={`min-h-11 justify-center rounded-full border px-4 ${control.filter === filter.id ? 'border-ink bg-ink' : 'border-line'}`}
          >
            <AppText
              variant="label"
              className={control.filter === filter.id ? 'text-white' : ''}
            >
              {filter.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      <View className="gap-4">
        {!control.loading && !control.visible.length && (
          <AppText variant="muted">
            Nenhuma mesa encontrada. As mesas são cadastradas no painel do
            restaurante.
          </AppText>
        )}
        {control.visible.map((table) => (
          <Pressable
            key={table.id}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${table.name}`}
            onPress={() =>
              navigation.navigate('TableDetails', { tableId: table.id })
            }
            className="rounded-3xl border border-line p-5"
          >
            <View className="flex-row items-center justify-between">
              <AppText variant="heading">{table.name}</AppText>
              <View
                className={`rounded-full px-3 py-1 ${table.active ? 'bg-brand-50' : 'bg-green-50'}`}
              >
                <AppText variant="muted" className="text-xs text-ink">
                  {table.cleaning
                    ? 'Aguardando limpeza'
                    : table.checkout
                      ? 'Conta solicitada'
                      : table.active
                        ? 'Em atendimento'
                        : 'Livre'}
                </AppText>
              </View>
            </View>
            <View className="mt-4 flex-row items-center gap-2">
              <UsersRound size={17} color="#666666" />
              <AppText variant="muted" className="flex-1">
                {table.cleaning
                  ? 'Confirme a limpeza para liberar a mesa'
                  : table.active
                    ? `${table.guests} pessoas · ${money(table.total)}`
                    : 'Pronta para receber clientes'}
              </AppText>
              <ChevronRight size={19} color="#0A0A0A" />
            </View>
            {table.ready > 0 && (
              <AppText variant="label" className="mt-3 text-success">
                {table.ready}{' '}
                {table.ready === 1
                  ? 'pedido pronto para servir'
                  : 'pedidos prontos para servir'}
              </AppText>
            )}
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
