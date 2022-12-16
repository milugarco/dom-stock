import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, AsyncStorage } from 'react-native';

export default function Config() {

    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');

    const navigation = useNavigation();


    useEffect(() => {

        (async () => {
            try {
                const ipAtt = await AsyncStorage.getItem('ip')
                const portAtt = await AsyncStorage.getItem('port')
                setIp(ipAtt)
                setPort(portAtt)
            } catch (error) {
                console.log(error)
            }
        })();

    }, []);

    setData = async () => {
        try {
            await AsyncStorage.setItem('ip', ip)
            await AsyncStorage.setItem('port', port)
        } catch (error) {
            console.log(error)
        }
    };

    const save = () => {
        alert('Informações salvas com sucesso!')
        navigation.navigate('Home')
        setData()
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#0B72F3'} barStyle="light-content" />
            <TextInput
                value={ip}
                placeholder={'IP'}
                style={styles.input}
                onChangeText={(ip) => setIp(ip)}
                placeholderTextColor="#D8D6D6"
            />
            <TextInput
                value={port}
                placeholder={'Porta'}
                style={styles.input}
                onChangeText={(port) => setPort(port)}
                placeholderTextColor="#D8D6D6"
            />
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={save}>
                    <Text style={styles.btnText}>
                        Salvar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'flex-end',
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        paddingLeft: 20,
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 4
    },
    btnContainer: {
        alignItems: 'center',
        width: '100%',
    },
    btn: {
        backgroundColor: '#4B4747',
        width: '100%',
        height: 50,
        padding: 10,
        borderRadius: 50,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    }
});
