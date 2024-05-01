import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, AppState } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { supabase } from '../service/auth';
import { useAppContext } from '../store';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function AuthScreen({ navigation }) {

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

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

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
                session,
            })
        }
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>

            <View>
                <TextInput
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>

            <View style={styles.fixToText}>
                <Button icon="lock" mode="contained" style={styles.button} disabled={loading} onPress={() => signUpWithEmail()}>
                    <Text style={styles.btnText}>Sign up</Text>
                </Button>

                <Button icon="login-variant" mode="contained" style={styles.button} disabled={loading} onPress={() => signInWithEmail()}>
                    <Text style={styles.btnText}>Sign in</Text>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        gap: 20
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    button: {
        padding: 10
    },
    btnText: {
        fontWeight: 'bold',
        color: '#fff'
    },
})