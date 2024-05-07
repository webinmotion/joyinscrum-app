import { Text, Button, useTheme } from 'react-native-paper';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Image, } from 'react-native';

export default function ({ navigation }) {

  const theme = useTheme();

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.light,
            alignContent: 'bottom',
            justifyContent: 'center'
          }}
        >

          <Button
            icon="account"
            mode="text"
            style={{marginTop: 20,
              padding: 10,
            alignSelf: 'flex-end'}}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={{
              fontWeight: 'bold',
              color: theme.colors.primary
            }}>Manage my profile</Text>
          </Button>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              height: 220,
              width: 420,
            }}
            source={require("../../assets/office-scrum.png")}
          />
        </View>

        <View
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.light,
          }}
        >

          <Button
            icon="qrcode"
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.btnText}>Scan QR Code</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#fff'
  },
});