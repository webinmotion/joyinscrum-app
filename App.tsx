import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider, } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { expo as expoConfig } from './app.json';
import { AuthProvider, useAppContext } from './provider/AuthProvider';
import { supabase } from './service/auth';
import { useEffect } from 'react';
import "@expo/metro-runtime";
import GuestNavigator from './screens/guest/GuestNavigator';
import AccountNavigator from './screens/account/AccountNavigator';

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

  const { isPlaying, setSession } = useAppContext();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
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
        case "SIGNED_OUT": {
          console.log("user is signed out", session);
          break;
        }
        case "PASSWORD_RECOVERY": {
          console.log("password recovery", session);
          break;
        }
        case "TOKEN_REFRESHED": {
          console.log("token refreshed", session);
          break;
        }
        case "USER_UPDATED": {
          console.log("user updated", session);
          break;
        }
        default: {
          console.log('unhandled event', session);
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
        {isPlaying ? <GuestNavigator /> : <AccountNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function AppContainer() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

AppRegistry.registerComponent(expoConfig.name, () => AppContainer);