import { DefaultTheme, type Theme } from '@react-navigation/native';
export const colors = {
  brand: '#FFBF00',
  ink: '#0A0A0A',
  muted: '#666666',
  line: '#E4E4E4',
  background: '#FFFFFF',
};
export const AppTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ink,
    background: colors.background,
    card: colors.background,
    text: colors.ink,
    border: colors.line,
    notification: colors.brand,
  },
  fonts: {
    regular: { fontFamily: 'Outfit_400Regular', fontWeight: '400' },
    medium: { fontFamily: 'Outfit_500Medium', fontWeight: '500' },
    bold: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
    heavy: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
  },
};
