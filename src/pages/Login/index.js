import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { api, authenticVerify } from "../../api"

export default function Home() {

    const [id, setId] = useState('1')
    const [password, setPassword] = useState('123')
    const [codeBar, setCodeBar] = useState('')

    const logo = require('../../../resources/logo.png')

    const navigation = useNavigation();

    const login = async () => {
        if (await authenticVerify()) {
            (await api()).post('user/login', { id, password })
                .then(res => {
                    if (res) {
                        const result = res.data; //info padrão do axio
                        console.log(result)
                        //info user
                        if (result.data) {
                            console.log("USER", result.data);
                            navigation.navigate('Product', { codeBar })
                        } else {
                            alert('Usuario não encontrado!')
                        }
                    }
                }).catch(err => {

                    console.log(err)
                })
        } else {
            alert('Verifique as configurações!')
        }
    }

    const config = () => {
        navigation.navigate('Config')
    }

    return (
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <View style={[styles.container, styles.containerLogo]}>
                <ImageBackground source={logo} style={styles.logo} />
            </View>

            <View style={[styles.container, styles.containerContent]}>
                <TextInput
                    value={id}
                    placeholder={'Usuário'}
                    style={styles.input}
                    onChangeText={(id) => setId(id)}
                />
                <TextInput
                    value={password}
                    placeholder={'Senha'}
                    style={styles.input}
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={true}
                />

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={[styles.btn, styles.btnAcessar]} onPress={login}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Acessar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn, styles.btnConfig]} onPress={config}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Configuração
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        padding: 15
    },
    containerLogo: {
        justifyContent: 'center',
    },
    containerContent: {
        justifyContent: 'flex-end',
    },
    logo: {
        width: '85%',
        height: '85%',
        top: 50,
        margin: '15%'
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 4
    },
    btnContainer: {
        height: 200,
        alignItems: 'center',
        width: '100%',
    },
    btn: {
        backgroundColor: '#efefef',
        width: '100%',
        height: 50,
        padding: 10,
        marginTop: 20,
        borderRadius: 50,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAcessar: {
        backgroundColor: '#0B72F3'
    },
    btnConfig: {
        backgroundColor: '#FDCE33'
    }
});