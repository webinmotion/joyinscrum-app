import React, { useState, useEffect } from "react";
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
import { useAppContext } from "../../provider/AuthProvider";

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { setSession } = useAppContext();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)

        if(session?.user.email){
            navigation.navigate('Profile', {
                session,
            })
        }
    })
}, [])

  async function signInWithEmail() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    }
    else {
      const { session } = data;
      setSession(session)
      navigation.navigate('Profile', {
        session
      })
    }
    setLoading(false)
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
            source={require("../../assets/login.png")}
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
            fontWeight="bold"
            style={{
              alignSelf: "center",
              padding: 30,
            }}
            size="h3"
          >
            Login
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

          <Text style={{ marginTop: 15 }}>Password</Text>
          <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Enter your password"
            value={password}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
            loading={loading}
            onPress={() => {
              signInWithEmail();
            }}
            buttonColor={theme.colors.primary}
            textColor={"#fff"}
            style={{
              marginTop: 20,
              padding: 10,
            }}
            disabled={loading}
          >Continue</Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Text size="md">Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{
                  marginLeft: 5,
                }}
              >
                Register here
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Recover");
              }}
            >
              <Text size="md" fontWeight="bold">
                Forget password
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.popToTop()}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{
                  marginLeft: 5,
                  borderStyle: 'solid',
                  borderColor: "#ccc"
                }}
              >
                {"🔙 Exit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}