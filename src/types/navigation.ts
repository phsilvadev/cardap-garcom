import type { NavigatorScreenParams } from '@react-navigation/native';
export type BottomTabParamList = {
  Home: undefined;
  Tables: undefined;
  Orders: undefined;
  Account: undefined;
};
export type RootStackParamList = {
  Login: undefined;
  AccessHelp: undefined;
  Tabs: NavigatorScreenParams<BottomTabParamList> | undefined;
  TableDetails: { tableId: string };
  NewOrder: { tableId: string };
  Profile: undefined;
  Help: undefined;
  Progress: undefined;
  WaiterGuide: undefined;
};
