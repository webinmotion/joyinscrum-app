import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from "./screens/HomeScreen";
import GuestScreen from "./screens/GuestScreen";
import ScrumScreen from "./screens/ScrumScreen";
import ScannerScreen from "./screens/ScannerScreen";
// import ScannerScreen from "./screens/Scanner2Screen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { name as appName } from './app.json';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={HomeScreen} options={{ title: 'Overview' }} />
            <Stack.Screen name="Account" component={AuthScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="Guest" component={GuestScreen} />
            <Stack.Screen name="Scrum" component={ScrumScreen} options={{ title: 'Scrum Options' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);