import { TextInput, Button, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppContext } from '../../provider/AuthProvider';
import { supabase } from '../../service/auth';

export default function ({ route, navigation }) {

  const { scrumId } = route.params;

  const [handle, setHandle] = useState('');
  const { auth: { session } } = useAppContext();

  const handleInputChange = (input) => {
    setHandle(input);
  }

  const handleSubmit = () => {
    navigation.navigate('Scrum', {
      scrumId,
      playerHandle: handle,
    })
  }

  useEffect(() => {
    (async function () {
      if (session?.user?.email) {
        console.log("user session detected. Will generate a user handle for", session?.user.email);
        let { data: rows, error } = await supabase
          .from('tbl_scrum_admin')
          .select('*')
          .eq('email_address', session?.user.email);

        if (error) {
          console.log('error retrieving player info', error.message);
        }
        else {
          const row = rows[0]
          setHandle(row.email_address);
          navigation.navigate('Scrum', {
            scrumId,
            playerHandle: row.email_address,
          })
        }
      }
    })()
  }, [])

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