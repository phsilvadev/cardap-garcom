import { ToastProvider } from '@/contexts/ToastContext';
import { Spinner } from '@/components/Spinner';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { LibreBaskerville_700Bold_Italic } from '@expo-google-fonts/libre-baskerville';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppNavigator } from '@/navigation/AppNavigator';
export default function App() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    LibreBaskerville_700Bold_Italic,
  });
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1 bg-white">
        <StatusBar style="dark" />
        {!loaded && !error ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size={24} color="#0A0A0A" />
          </View>
        ) : (
          <ToastProvider>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </ToastProvider>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
