import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from "./screens/HomeScreen";
import GuestScreen from "./screens/GuestScreen";
import ScrumScreen from "./screens/ScrumScreen";
import ScannerScreen from "./screens/ScannerScreen";
// import ScannerScreen from "./screens/Scanner2Screen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { expo as expoConfig } from './app.json';
import { AppContextProvider, useAppContext } from './store';
import { supabase } from './service/auth';
import { useEffect } from 'react';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#551a8b',
    accent: '#f1c40f',
  },
};

const Stack = createNativeStackNavigator();

function App() {

  const { setSession } = useAppContext();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession("getSession", session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange", event)
      switch (event) {
        case "INITIAL_SESSION": {
          console.log("starting new session", session);
          break;
        }
        case "SIGNED_IN": {
          console.log("user is signed in", session);
          break;
        }
        default: {
          //do nothing
          break;
        }
      }
      setSession(session)
    })

    return () => {
      // call unsubscribe to remove the callback
      subscription.unsubscribe()
    }
  }, [])

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={HomeScreen} options={{ title: 'JoyInScrum Client' }} />
          <Stack.Screen name="Account" component={AuthScreen} />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen name="Guest" component={GuestScreen} />
          <Stack.Screen name="Scrum" component={ScrumScreen} options={{ title: 'Scrum Options' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function AppContainer() {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  )
}

AppRegistry.registerComponent(expoConfig.name, () => AppContainer);