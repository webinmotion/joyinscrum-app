import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Pressable,
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { setSession, togglePlaying } = useAppContext();

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
            labelStyle={{
              fontSize: 18
            }}
            disabled={loading}
          >Continue</Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Text variant="labelLarge">Don't have an account?</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  marginLeft: 5,
                }}
              >
                Register here
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("Recover");
              }}
            >
              <Text variant="titleMedium" fontWeight="bold">
                Forget password
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => togglePlaying()}
            >
              <Text
                variant="titleMedium"
                style={{
                  marginLeft: 5,
                  borderStyle: 'solid',
                  borderColor: "#ccc"
                }}
              >
                Exit <MaterialCommunityIcons name="location-exit" size={18} color="black" />
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}