import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import SuppliersScreen from "./src/screens/SuppliersScreen";
import BakingSheetsScreen from "./src/screens/BakingSheetsScreen";

import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú Principal" }} />
        <Stack.Screen name="Suppliers" component={SuppliersScreen} options={{ title: "Proveedores (NoSQL)" }} />
        <Stack.Screen name="BakingSheets" component={BakingSheetsScreen} options={{ title: "Hojas de Horneado (NoSQL)" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}