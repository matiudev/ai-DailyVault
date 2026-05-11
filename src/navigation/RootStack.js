import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../theme/useTheme";
import TabNavigator from "./TabNavigator";
import FormHabitoScreen from "../feature/habitos/screens/FormHabitoScreen";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormHabito"
        component={FormHabitoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
