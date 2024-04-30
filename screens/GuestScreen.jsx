import { TextInput, Button, Text } from 'react-native-paper';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

const GuestScreen = ({ route, navigation }) => {

  const { scrumId } = route.params;

  const [handle, setHandle] = useState('');

  const handleInputChange = (input) => {
    setHandle(input);
  }

  const handleSubmit = () => {
    navigation.navigate('Scrum', {
      scrumId,
      playerHandle: handle,
    })
  }


  return (
    <View style={styles.container}>
      <TextInput
        label='Guest Handle (unique)'
        value={handle}
        onChangeText={handleInputChange} />

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.btnText}>Go to Live Scrum</Text>
      </Button>
    </View>
  );
}

export default GuestScreen;

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
  }
});