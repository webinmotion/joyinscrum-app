import { useState, useEffect } from 'react';
import { Button, Text } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ({ navigation }) {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [scrumUrl, setScrumUrl] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function handleCodeScanned({ type, data }) {
    alert(`Bar Code with type ${type} and data ${Linking.openURL(`${data}`)} has been scanned`);
    setScrumUrl(data);
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
      <Camera
        type={type}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
        }}
        onBarCodeScanned={handleCodeScanned}
        style={StyleSheet.absoluteFillObject}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});