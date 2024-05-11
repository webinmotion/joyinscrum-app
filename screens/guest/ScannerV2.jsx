import { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function ({ navigation }) {

  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scrumUrl, setScrumUrl] = useState(null);

  useEffect(() => {
    if (scrumUrl) {
      const pattern = /.+\/scrum\/(.+)/;
      const scrumId = pattern.exec(scrumUrl);
      if (scrumId) {
        navigation.navigate('Guest', {
          scrumId: scrumId[1],
        })
      }
    }
  }, [scrumUrl])

  function handleCodeScanned({ type, data }) {
    setScanned(true);
    console.log(`🚀 ~ handleBarCodeScanned ~ ${type} -> ${data}`)
    // alert(`Bar Code with type ${type} and data ${Linking.openURL(`${data}`)} has been scanned`)
    setScrumUrl(data);
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting for Camera permission</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleCodeScanned}
        style={styles.camera}
        facing={CameraType.back}
        barcodeScannerSettings={{
          barCodeTypes: [
            "qr",
            "pdf417",
            "ean13",
            "code128",
            "code39",
            "upc_a",
            "upc_e",
            "ean8",
            "itf14",
            "interleaved2of5",
            "codabar",
          ],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  camera: {
    flex: 1,
    alignItems: "stretch",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    padding: 16,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});