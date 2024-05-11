import { useState, useEffect } from 'react';
import { supabase } from '../../service/auth';
import { StyleSheet, View, Alert, Pressable } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAppContext } from '../../provider/AuthProvider';

export default function ({ navigation }) {

    const [loading, setLoading] = useState(true)
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('')
    const { auth: { session } } = useAppContext();

    useEffect(() => {
        if (session) {
            getProfile()
        }
        else {
            navigation.navigate('Login')
        }
    }, [session])

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

            //clear inputs if no data is available
            setFirst(data?.first_name || '');
            setLast(data?.last_name || '');
            setPhone(data?.phone_num || '');
            setCountry(data?.country || '');

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
            if (!session?.user) throw new Error('No user on the session!');

            const {error } = await supabase
                .from('tbl_scrummage')
                .upsert({ organizer_email: session?.user.email, scrum_choices: "1,2,3,4,5" })

            if (error) {
                console.log('error', error.message);
            }

            const updates = {
                email_address: session?.user.email,
                first_name: first,
                last_name: last,
                phone_num: phone,
                country
            }
            console.log('update profile', updates)

            const { error2 } = await supabase.from('tbl_scrum_admin').upsert(updates);

            if (error2) {
                Alert.alert("error upserting record into scrum organizers' collection");
            }
            else{
                Alert.alert("Record updated successfully");
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
                    <Text style={styles.btnText}>{loading ? 'Saving ...' : 'Update'}</Text>
                </Button>
            </View>

            <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => supabase.auth.signOut()}
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
                Sign Out
              </Text>
            </Pressable>
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