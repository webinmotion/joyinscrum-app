import { Text, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Button
        icon="qrcode"
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Text style={styles.btnText}>Scan QR Code</Text>
      </Button>

      <Button
        icon="account"
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Account')}
      >
        <Text style={styles.btnText}>My Profile</Text>
      </Button>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 20
  },
  button: {
    padding: 10
  },
  btnText: {
    fontWeight: 'bold',
    color: '#fff'
  },
});