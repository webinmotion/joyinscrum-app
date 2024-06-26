import { useState, useEffect } from 'react';
import { supabase } from '../service/auth';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function ProfileScreen({ route, navigation }) {

    const [loading, setLoading] = useState(true)
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('')
    const { session } = route.params;

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("onAuthStateChange", event, 'Session', session);
            if (event === 'SIGNED_OUT') {
                navigation.popToTop('Landing')
            }
        })

        return () => {
            // call unsubscribe to remove the callback
            subscription.unsubscribe()
        }
    }, [])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('tbl_scrum_admin')
                .select(`first_name, last_name, phone_num, country`)
                .eq('email_address', session?.user.email)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFirst(data.first_name)
                setLast(data.last_name)
                setPhone(data.phone_num)
                setCountry(data.country)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        first,
        last,
        phone,
        country,
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const updates = {
                email_address: session?.user.email,
                first_name: first,
                last_name: last,
                phone_num: phone,
                country
            }

            const { error } = await supabase.from('tbl_scrum_admin').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <TextInput label="Email" value={session?.user?.email} disabled />
            </View>
            <View>
                <TextInput label="First Name" value={first || ''} onChangeText={(text) => setFirst(text)} />
            </View>
            <View>
                <TextInput label="Last Name" value={last || ''} onChangeText={(text) => setLast(text)} />
            </View>
            <View>
                <TextInput label="Phone Number" value={phone || ''} onChangeText={(text) => setPhone(text)} />
            </View>
            <View>
                <TextInput label="Country" value={country || ''} onChangeText={(text) => setCountry(text)} />
            </View>

            <View>
                <Button
                    icon="account-check"
                    mode="contained"
                    style={styles.button}
                    onPress={() => updateProfile({ first, last, phone, country })}
                    disabled={loading}>
                    <Text style={styles.btnText}>{loading ? 'Loading ...' : 'Update'}</Text>
                </Button>
            </View>

            <View style={styles.fixToText}>
                <Button
                    icon="lock"
                    mode="contained"
                    style={styles.button}
                    onPress={() => supabase.auth.signOut()}>
                    <Text style={styles.btnText}>Sign Out</Text>
                </Button>
                <Button
                    icon="restart"
                    mode="contained"
                    style={styles.button}
                    onPress={() => navigation.popToTop()}>
                    <Text style={styles.btnText}>Start Over</Text>
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