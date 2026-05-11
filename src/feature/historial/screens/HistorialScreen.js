import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";
import Heatmap from "../components/Heatmap";
import {
  calcularRacha,
  calcularTotalCompletados,
  calcularPorcentajeMes,
} from "../utils/estadisticas";

function StatChip({ icon, value, label, color }) {
  const { colors } = useTheme();
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.cardSecondary,
      borderRadius: 12,
      padding: 10,
      alignItems: "center",
    }}>
      <IconLucide name={icon} color={color} size={16} />
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16, marginTop: 4 }}>{value}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 1 }}>{label}</Text>
    </View>
  );
}

function HabitoHistorialCard({ habito, registros }) {
  const { colors } = useTheme();
  const [expandido, setExpandido] = useState(false);

  const racha = calcularRacha(habito, registros);
  const total = calcularTotalCompletados(habito.id, registros);
  const porcentajeMes = calcularPorcentajeMes(habito, registros);

  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: expandido ? habito.color + "50" : colors.border,
      marginBottom: 12,
    }}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpandido((e) => !e)}
        activeOpacity={0.7}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: habito.color + "20",
          alignItems: "center", justifyContent: "center",
          marginRight: 12,
        }}>
          <IconLucide name={habito.icono} color={habito.color} size={20} />
        </View>

        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16, flex: 1 }}>
          {habito.nombre}
        </Text>

        {/* Racha badge */}
        {racha > 0 && (
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 4,
            backgroundColor: colors.warning + "20",
            borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
            marginRight: 8,
          }}>
            <IconLucide name="Flame" color={colors.warning} size={13} />
            <Text style={{ color: colors.warning, fontWeight: "700", fontSize: 13 }}>{racha}</Text>
          </View>
        )}

        <IconLucide
          name={expandido ? "ChevronUp" : "ChevronDown"}
          color={colors.iconSecondary}
          size={18}
        />
      </TouchableOpacity>

      {/* Expandido */}
      {expandido && (
        <View style={{ marginTop: 16 }}>
          {/* Stats */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <StatChip
              icon="Flame"
              value={racha}
              label="Racha"
              color={colors.warning}
            />
            <StatChip
              icon="CheckCircle"
              value={total}
              label="Total"
              color={colors.success}
            />
            <StatChip
              icon="TrendingUp"
              value={`${porcentajeMes}%`}
              label="Este mes"
              color={habito.color}
            />
          </View>

          {/* Leyenda */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {[
              { color: colors.border, label: "Sin completar" },
              { color: habito.color, label: "Completado" },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Heatmap */}
          <Heatmap habito={habito} registros={registros} />
        </View>
      )}
    </View>
  );
}

export default function HistorialScreen() {
  const { colors } = useTheme();
  const habitos = useHabitoStore((s) => s.habitos);
  const registros = useHabitoStore((s) => s.registros);

  const habitosActivos = habitos.filter((h) => h.activo);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Historial</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}>
          Tocá un hábito para ver su mapa de calor
        </Text>
      </View>

      {habitosActivos.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <IconLucide name="BarChart2" color={colors.border} size={56} />
          <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "600", marginTop: 16, textAlign: "center" }}>
            Todavía no hay hábitos
          </Text>
          <Text style={{ color: colors.textPlaceHolder, fontSize: 14, marginTop: 8, textAlign: "center" }}>
            Creá hábitos para ver tu progreso acá
          </Text>
        </View>
      ) : (
        <FlatList
          data={habitosActivos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <HabitoHistorialCard habito={item} registros={registros} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
