import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Pressable,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
  Text,
  StyleSheet,
} from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { supabase } from "../../service/auth";

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${process.env.EXPO_PUBLIC_DOMAIN_URL}/signin`,
      },
    });

    if (error) Alert.alert(error.message);

    if (!session)
      Alert.alert("Please check your inbox for email verification!");
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
            source={require("../../assets/register.png")}
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
          <Text style={styles.titleText}>Register</Text>
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
              signUpWithEmail();
            }}
            buttonColor={theme.colors.primary}
            textColor={"#fff"}
            style={{
              marginTop: 20,
              padding: 10,
            }}
            labelStyle={{
              fontSize: 18,
            }}
            disabled={loading}
          >
            Create an account
          </Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Text style={{ marginRight: 5 }}>Already have an account?</Text>
            <Pressable
              onPress={() => {
                navigation.popToTop();
              }}
            >
              <Text style={styles.pressableText}>Login here</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    titleText: {
      alignSelf: "center",
      padding: 30,
      fontSize: 18,
      fontWeight: "bold",
    },
    pressableText: {
      color: theme.colors.primary,
      padding: 5,
    },
  });
