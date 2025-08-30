import React from 'react';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true); // ignore tous les warnings jaunes

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Load from './src/Load';
import Home from './src/Home';
import Setting from './src/Setting';
import Header from './src/Header';
import Manuel from './src/Manuel';
import Autonome from './src/Autonome';
import Suiveur from './src/Suiveur';
import About from './src/About';

export type RootStackParamList = {
  Load: undefined;
  Main: undefined;
  About: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Manuel: undefined;
  Autonome: undefined;
  SuiveurMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen
        name="Manuel"
        component={Manuel}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Autonome"
        component={Autonome}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SuiveurMain"
        component={Suiveur}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function getActiveRouteName(route: any) {
  if (!route) return null;
  if (route.state) {
    const nestedRoute = route.state.routes[route.state.index];
    return getActiveRouteName(nestedRoute);
  }
  return route.name;
}

function MainTabs({ navigation, route }: any) {
  const currentScreen = getActiveRouteName(
    route?.state?.routes?.find((r: any) => r.name === 'Home'),
  );
  const hideHeaderScreens = ['Manuel', 'Autonome', 'SuiveurMain'];
  const shouldHideHeader = hideHeaderScreens.includes(currentScreen);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName =
            route.name === 'Home' ? 'home-outline' : 'settings-outline';
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 16, marginTop: 3 },
        tabBarActiveTintColor: '#0F1824',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 65, paddingBottom: 8 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Load"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Load" component={Load} />
            <Stack.Screen name="Main">
              {props => <MainTabs {...props} />}
            </Stack.Screen>
            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
