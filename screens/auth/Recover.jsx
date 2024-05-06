import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { supabase } from '../../service/auth';

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  async function forget() {
    setLoading(true);
    console.log('redirect to reset', process.env.EXPO_PUBLIC_DOMAIN_URL)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.EXPO_PUBLIC_DOMAIN_URL}?action=reset`,
    });

    if (error) {
      Alert.alert(error)
    }
    else {
      alert("If the email is valid, you will find in your inbox an email with additional password recovery steps");
      console.log(data);
      navigation.navigate('Reset');
    }
    setLoading(false);
  }
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              height: 220,
              width: 220,
            }}
            source={require("../../assets/forget.png")}
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
          <Text
            size="h3"
            fontWeight="bold"
            style={{
              alignSelf: "center",
              padding: 30,
            }}
          >
            Forgot Password
          </Text>
          <Text>Email</Text>
          <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Enter your email"
            value={email}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
          <Button
            loading={loading}
            onPress={() => {
              forget();
            }}
            buttonColor={theme.colors.primary}
            textColor={"#fff"}
            style={{
              marginTop: 20,
              padding: 10,
            }}
            disabled={loading}
          >Send email</Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Text size="md">Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{
                  marginLeft: 5,
                }}
              >
                Login here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}