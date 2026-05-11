import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconLucide from "../components/IconLucide";
import { useTheme } from "../theme/useTheme";
import HoyScreen from "../feature/hoy/screens/HoyScreen";
import HistorialScreen from "../feature/historial/screens/HistorialScreen";
import HabitosScreen from "../feature/habitos/screens/HabitosScreen";
import CategoriasScreen from "../feature/categorias/screens/CategoriasScreen";
import AjustesScreen from "../feature/ajustes/screens/AjustesScreen";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Hoy: "CalendarCheck",
  Historial: "BarChart2",
  Habitos: "ListChecks",
  Categorias: "Tag",
  Ajustes: "Settings",
};

export default function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.iconSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size }) => (
          <IconLucide name={TAB_ICONS[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen
        name="Hoy"
        component={HoyScreen}
        options={{ title: "Hoy" }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{ title: "Historial" }}
      />
      <Tab.Screen
        name="Habitos"
        component={HabitosScreen}
        options={{ title: "Hábitos" }}
      />
      <Tab.Screen
        name="Categorias"
        component={CategoriasScreen}
        options={{ title: "Categorías" }}
      />
      <Tab.Screen
        name="Ajustes"
        component={AjustesScreen}
        options={{ title: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}
