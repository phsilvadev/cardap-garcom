import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  UsersRound,
  ClipboardList,
  UserRound,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { TablesScreen } from '@/screens/tables/TablesScreen';
import { OrdersScreen } from '@/screens/orders/OrdersScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import type { BottomTabParamList } from '@/types/navigation';
const Tab = createBottomTabNavigator<BottomTabParamList>();
export function BottomNavigation() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0A0A0A',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: {
          height: 68 + Math.max(insets.bottom, 12),
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E4E4E4',
        },
        tabBarLabelStyle: {
          fontFamily: 'Outfit_500Medium',
          fontSize: 11,
          marginTop: 3,
        },
      }}
    >
      {[
        {
          name: 'Home' as const,
          title: 'Início',
          component: HomeScreen,
          icon: Home,
        },
        {
          name: 'Tables' as const,
          title: 'Mesas',
          component: TablesScreen,
          icon: UsersRound,
        },
        {
          name: 'Orders' as const,
          title: 'Pedidos',
          component: OrdersScreen,
          icon: ClipboardList,
        },
        {
          name: 'Account' as const,
          title: 'Conta',
          component: SettingsScreen,
          icon: UserRound,
        },
      ].map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            title: item.title,
            tabBarIcon: ({ color, size, focused }) => (
              <item.icon
                color={focused ? '#D99D00' : color}
                size={size}
                strokeWidth={1.8}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
