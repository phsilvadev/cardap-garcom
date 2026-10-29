import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useState, type RefObject, type ReactNode } from 'react';
import { BackHandler, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  snapPoints?: string[];
  blocking?: boolean;
  stacked?: boolean;
  keyboard?: boolean;
  scrollable?: boolean;
  children?: ReactNode;
  onDismiss?: () => void;
};
export function BaseBottomSheet({
  bottomSheetRef,
  snapPoints,
  blocking = false,
  stacked = false,
  keyboard = false,
  scrollable = false,
  children,
  onDismiss,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (!open) return;
      const listener = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!blocking) bottomSheetRef.current?.dismiss();
        return true;
      });
      return () => listener.remove();
    }, [open, blocking, bottomSheetRef]),
  );
  const padding = {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Math.max(insets.bottom, 20) + 20,
  };
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      maxDynamicContentSize={height - insets.top - 24}
      topInset={insets.top + 12}
      stackBehavior={stacked ? 'push' : 'replace'}
      enablePanDownToClose={!blocking}
      enableContentPanningGesture={!blocking}
      enableHandlePanningGesture={!blocking}
      keyboardBehavior={keyboard ? 'extend' : 'interactive'}
      keyboardBlurBehavior={keyboard ? 'restore' : 'none'}
      android_keyboardInputMode={keyboard ? 'adjustResize' : undefined}
      backgroundStyle={{ backgroundColor: colors.background, borderRadius: 28 }}
      handleIndicatorStyle={{ backgroundColor: colors.border, width: 36 }}
      onChange={(index) => setOpen(index >= 0)}
      onDismiss={() => {
        setOpen(false);
        onDismiss?.();
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
          pressBehavior={blocking ? 'none' : 'close'}
        />
      )}
    >
      {scrollable ? (
        <BottomSheetScrollView
          focusHook={useFocusEffect}
          contentContainerStyle={padding}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={padding}>{children}</BottomSheetView>
      )}
    </BottomSheetModal>
  );
}
