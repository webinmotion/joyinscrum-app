import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Login';
import RegisterScreen from './Register';
import RecoverScreen from './Recover';
import ProfileScreen from './Profile';
import { useAppContext } from '../../provider/AuthProvider';

const Credentials = createNativeStackNavigator();
const Profile = createNativeStackNavigator();

function CredentialsNavigator() {

    return (
        <Credentials.Navigator initialRouteName="Login">
            <Credentials.Screen name="Login" component={LoginScreen} />
            <Credentials.Screen name="Register" component={RegisterScreen} />
            <Credentials.Screen name="Recover" component={RecoverScreen} />
        </Credentials.Navigator>
    );
}

function ProfileNavigator() {

    return (
        <Profile.Navigator initialRouteName="Profile">
            <Profile.Screen name="Profile" component={ProfileScreen} />
        </Profile.Navigator>
    );
}

export default function AccountNavigator() {

    const { auth: { session } } = useAppContext();

    return session?.user.email ? <ProfileNavigator /> : <CredentialsNavigator />
}