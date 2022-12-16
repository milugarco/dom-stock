import axios from "axios";
import { AsyncStorage } from "react-native";


const allInfo = async () => {
    const port = await AsyncStorage.getItem('port')
    const ip = await AsyncStorage.getItem('ip')
    console.log({ port, ip })
    return { port, ip }
}

export const authenticVerify = async () => {
    const { port, ip } = await allInfo();

    if (!port | !ip) {
        console.log('Verifique a configuração antes')
        return false
    } else {
        console.log('Ip configurado')
        return true
    }
}

export const api = async () => {
    const { port, ip } = await allInfo();

    return axios.create({
        baseURL: `http://${ip}:${port}/api/`,
        timeout: 12000
    })
} 