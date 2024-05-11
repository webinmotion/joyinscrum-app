import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./Home";
import GuestScreen from "./Guest";
import ScrumScreen from "./Scrum";
import ScannerScreen from "./ScannerV2";

const Guest = createNativeStackNavigator();

export default function GuestNavigator() {

    return (
        <Guest.Navigator initialRouteName="Home">
            <Guest.Screen name="Home" component={HomeScreen} options={{ title: 'JoyInScrum Client' }} />
            <Guest.Screen name="Scanner" component={ScannerScreen} />
            <Guest.Screen name="Guest" component={GuestScreen} />
            <Guest.Screen name="Scrum" component={ScrumScreen} options={{ title: 'Scrum Options' }} />
        </Guest.Navigator>
    );
}