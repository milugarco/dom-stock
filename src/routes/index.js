import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../pages/Login/index";
import Product from "../pages/MainMenu/index";
import Config from "../pages/Config/index"

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Product"
                component={Product}
                options={{headerShown: false}}
                
            />
            <Stack.Screen
                name="Config"
                component={Config}
                options={{
                    title: 'Configurações',
                    headerStyle: {
                      backgroundColor: '#0B72F3',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
            />
        </Stack.Navigator>
    )
}