import { useRoute, type RouteProp } from '@react-navigation/native';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { BaseBottomSheet } from '@/components/BaseBottomSheet';
import { SalonSyncStatus } from '@/components/SalonSyncStatus';
import { useNewOrder } from '@/hooks/use-new-order';
import { money } from '@/utils/salon-state';
import type { RootStackParamList } from '@/types/navigation';
export function NewOrderScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'NewOrder'>>();
  const control = useNewOrder(params.tableId);
  if (!control.canOrder || !control.table)
    return (
      <Screen>
        <SalonSyncStatus />
        <PageHeader
          title="Comanda indisponível."
          description="Abra uma mesa disponível para adicionar pedidos."
        />
      </Screen>
    );
  return (
    <>
      <Screen>
        <PageHeader
          title="Novo pedido."
          description={`${control.table.name} · Selecione os itens e envie para a cozinha.`}
        />
        <SalonSyncStatus />
        <TextInput
          accessibilityLabel="Buscar produto"
          placeholder="Buscar no cardápio"
          placeholderTextColor="#888888"
          value={control.search}
          onChangeText={control.setSearch}
          className="min-h-12 rounded-2xl border border-line px-4 font-sans text-base text-ink"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 py-5"
        >
          {control.categories.map((category) => (
            <Pressable
              accessibilityRole="button"
              key={category}
              onPress={() => control.setCategory(category)}
              className={`min-h-11 justify-center rounded-full border px-4 ${category === control.category ? 'border-ink bg-ink' : 'border-line'}`}
            >
              <AppText
                variant="label"
                className={category === control.category ? 'text-white' : ''}
              >
                {category}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
        {!control.visible.length && (
          <AppText variant="muted">
            Nenhum produto disponível neste filtro. Confira o cardápio no
            painel.
          </AppText>
        )}
        <View className="gap-5">
          {control.visible.map((product) => (
            <View key={product.id} className="border-b border-line pb-5">
              <AppText variant="heading" className="text-lg">
                {product.name}
              </AppText>
              <AppText variant="muted" className="mt-1">
                {product.description}
              </AppText>
              {product.requiresCustomization && (
                <AppText variant="muted" className="mt-2 text-xs">
                  Este produto exige personalização e ainda não pode ser enviado
                  por este app.
                </AppText>
              )}
              <View className="mt-4 flex-row items-center justify-between">
                <AppText variant="label" className="font-semibold">
                  {money(product.price)}
                </AppText>
                <View className="flex-row items-center gap-4">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${product.name}`}
                    disabled={
                      control.disabled || !control.quantities[product.id]
                    }
                    onPress={() => control.change(product.id, -1)}
                    className="h-10 w-10 items-center justify-center rounded-full border border-line"
                  >
                    <Minus size={17} color="#0A0A0A" />
                  </Pressable>
                  <AppText variant="label">
                    {control.quantities[product.id] ?? 0}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Adicionar ${product.name}`}
                    disabled={control.disabled || product.requiresCustomization}
                    onPress={() => control.change(product.id, 1)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-brand"
                  >
                    <Plus size={17} color="#0A0A0A" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
        <AppText variant="label" className="mb-2 mt-7">
          Observações para a cozinha
        </AppText>
        <TextInput
          accessibilityLabel="Observações para a cozinha"
          multiline
          maxLength={500}
          textAlignVertical="top"
          placeholder="Ex.: sem cebola, molho separado..."
          placeholderTextColor="#888888"
          value={control.notes}
          onChangeText={control.setNotes}
          className="min-h-24 rounded-2xl border border-line p-4 font-sans text-base text-ink"
        />
        <View className="mb-5 mt-7 flex-row justify-between">
          <AppText variant="label">{control.count} itens</AppText>
          <AppText variant="heading">{money(control.total)}</AppText>
        </View>
        <AppButton
          label="Revisar e enviar"
          disabled={control.disabled || !control.count}
          onPress={control.review}
        />
      </Screen>
      <BaseBottomSheet bottomSheetRef={control.sheetRef} scrollable>
        <AppText variant="heading">Enviar para a cozinha?</AppText>
        <AppText variant="muted" className="mb-5 mt-2">
          {control.table.name} · Confira os itens antes de enviar.
        </AppText>
        {control.items.map((item) => (
          <View
            key={item.id}
            className="flex-row justify-between gap-4 border-b border-line py-3"
          >
            <AppText variant="label" className="flex-1">
              {item.quantity} × {item.name}
            </AppText>
            <AppText variant="label">
              {money(item.quantity * item.price)}
            </AppText>
          </View>
        ))}
        {control.notes && (
          <AppText variant="muted" className="mt-4">
            Observações: {control.notes}
          </AppText>
        )}
        <AppText variant="heading" className="my-5">
          Total: {money(control.total)}
        </AppText>
        <AppText variant="muted" className="mb-5 text-xs">
          Os itens serão enviados à cozinha da sua loja. Preços e
          disponibilidade são conferidos pelo sistema.
        </AppText>
        <SalonSyncStatus />
        <AppButton
          label="Enviar à cozinha"
          disabled={control.disabled || !control.count}
          onPress={control.send}
        />
        <AppButton
          label="Continuar editando"
          variant="secondary"
          className="mt-3"
          onPress={() => control.sheetRef.current?.dismiss()}
        />
      </BaseBottomSheet>
    </>
  );
}
