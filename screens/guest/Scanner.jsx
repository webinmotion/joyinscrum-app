import { useState, useEffect } from 'react';
import { Button, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ({ navigation }) {

  const [hasPermission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scrumUrl, setScrumUrl] = useState(null);

  useEffect(() => {
    (async function () {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setPermission(status === 'granted');
    })();
  }, []);

  function handleCodeScanned({ type, data }) {
    setScanned(true);
    console.log(data)
    // alert(`Bar Code with type ${type} and data ${Linking.openURL(`${data}`)} has been scanned`)
    setScrumUrl(data);
  }

  if (hasPermission === null) {
    return <Text>Requesting for Camera permission</Text>
  }

  if (hasPermission === false) {
    return <Text>Access to camera has not been granted</Text>
  }

  if (scrumUrl) {
    const pattern = /.+\/scrum\/(.+)/;
    const scrumId = pattern.exec(scrumUrl);
    if (scrumId) {
      navigation.navigate('Guest', {
        scrumId: scrumId[1],
      })
    }
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleCodeScanned}
        style={StyleSheet.absoluteFillObject} />

      {scanned && <Button title="Tap to scan again" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});