import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider, } from 'react-native-paper';
import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import RecoverScreen from './screens/auth/Recover';
// import ResetScreen from './screens/auth/Reset';
import ProfileScreen from './screens/auth/Profile';
import HomeScreen from "./screens/guest/Home";
import GuestScreen from "./screens/guest/Guest";
import ScrumScreen from "./screens/guest/Scrum";
import ScannerScreen from "./screens/guest/Scanner";
// import ScannerScreen from "./screens/guest/Scanner2";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { expo as expoConfig } from './app.json';
import { AuthProvider, useAppContext } from './provider/AuthProvider';
import { supabase } from './service/auth';
import { useEffect } from 'react';
import "@expo/metro-runtime";

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
        <Stack.Navigator initialRouteName="Home">
          {/* guest screens */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'JoyInScrum Client' }} />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen name="Guest" component={GuestScreen} />
          <Stack.Screen name="Scrum" component={ScrumScreen} options={{ title: 'Scrum Options' }} />
          {/* auth screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Recover" component={RecoverScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
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