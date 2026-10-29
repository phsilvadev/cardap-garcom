import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { WaiterDemoProvider } from '@/contexts/WaiterDemoContext';
import { BottomNavigation } from './BottomNavigation';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { AccessHelpScreen } from '@/screens/auth/AccessHelpScreen';
import { AccessIssueScreen } from '@/screens/auth/AccessIssueScreen';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { ProfileScreen } from '@/screens/settings/ProfileScreen';
import { HelpScreen } from '@/screens/settings/HelpScreen';
import { ProgressScreen } from '@/screens/settings/ProgressScreen';
import { WaiterGuideScreen } from '@/screens/settings/WaiterGuideScreen';
import { TableDetailsScreen } from '@/screens/tables/TableDetailsScreen';
import { NewOrderScreen } from '@/screens/orders/NewOrderScreen';
import type { RootStackParamList } from '@/types/navigation';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator() {
  const session = useAuth();
  if (session.loading) return <SplashScreen />;
  if (!session.user && session.hasIdentity) return <AccessIssueScreen />;
  return (
    <NavigationContainer theme={AppTheme}>
      <WaiterDemoProvider
        key={
          session.user ? `${session.user.uid}:${session.user.storeId}` : 'guest'
        }
      >
        <BottomSheetModalProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {session.user ? (
              <Stack.Group navigationKey="waiter">
                <Stack.Screen name="Tabs" component={BottomNavigation} />
                <Stack.Screen
                  name="TableDetails"
                  component={TableDetailsScreen}
                />
                <Stack.Screen name="NewOrder" component={NewOrderScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="Progress" component={ProgressScreen} />
                <Stack.Screen
                  name="WaiterGuide"
                  component={WaiterGuideScreen}
                />
              </Stack.Group>
            ) : (
              <Stack.Group navigationKey="guest">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AccessHelp" component={AccessHelpScreen} />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </WaiterDemoProvider>
    </NavigationContainer>
  );
}
