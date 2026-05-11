import { View, Text, SectionList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";

const TIPO_INFO = {
  booleano: { icon: "CheckSquare", label: "Sí/No" },
  cantidad: { icon: "Hash", label: "Cantidad" },
  duracion: { icon: "Timer", label: "Duración" },
};

const DIAS_LABELS = ["", "L", "M", "X", "J", "V", "S", "D"];

function FrecuenciaText({ frecuencia, color }) {
  const { colors } = useTheme();
  if (frecuencia.tipo === "diaria") {
    return <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Diario</Text>;
  }
  if (frecuencia.tipo === "cada_x_dias") {
    return <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Cada {frecuencia.intervalo} días</Text>;
  }
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {[1, 2, 3, 4, 5, 6, 7].map((d) => {
        const activo = frecuencia.diasSemana?.includes(d);
        return (
          <Text key={d} style={{ fontSize: 11, fontWeight: "700", color: activo ? color : colors.textPlaceHolder }}>
            {DIAS_LABELS[d]}
          </Text>
        );
      })}
    </View>
  );
}

function HabitoCard({ habito, onPress }) {
  const { colors } = useTheme();
  const tipoInfo = TIPO_INFO[habito.tipo];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 8,
      }}
    >
      {/* Ícono */}
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: habito.color + "20",
        alignItems: "center", justifyContent: "center",
        marginRight: 12,
      }}>
        <IconLucide name={habito.icono} color={habito.color} size={20} />
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>{habito.nombre}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IconLucide name={tipoInfo.icon} color={colors.textSecondary} size={12} />
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{tipoInfo.label}</Text>
          </View>
          <Text style={{ color: colors.border, fontSize: 12 }}>·</Text>
          <FrecuenciaText frecuencia={habito.frecuencia} color={habito.color} />
        </View>
      </View>

      <IconLucide name="ChevronRight" color={colors.iconSecondary} size={18} />
    </TouchableOpacity>
  );
}

export default function HabitosScreen({ navigation }) {
  const { colors } = useTheme();
  const habitos = useHabitoStore((s) => s.habitos);
  const categorias = useHabitoStore((s) => s.categorias);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const filtrados = habitos.filter((h) => (mostrarArchivados ? !h.activo : h.activo));

  const secciones = categorias
    .map((cat) => ({
      key: cat.id,
      categoria: cat,
      data: filtrados.filter((h) => h.categoriaId === cat.id),
    }))
    .filter((s) => s.data.length > 0);

  const total = filtrados.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Hábitos</Text>

        {/* Toggle Activos / Archivados */}
        <View style={{ flexDirection: "row", marginTop: 12, backgroundColor: colors.card, borderRadius: 12, padding: 4, alignSelf: "flex-start", borderWidth: 1, borderColor: colors.border }}>
          {[
            { value: false, label: "Activos" },
            { value: true, label: "Archivados" },
          ].map((opt) => (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => setMostrarArchivados(opt.value)}
              style={{
                paddingHorizontal: 16, paddingVertical: 7, borderRadius: 9,
                backgroundColor: mostrarArchivados === opt.value ? colors.primary : "transparent",
              }}
            >
              <Text style={{ color: mostrarArchivados === opt.value ? "#FFF" : colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista */}
      {total === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <IconLucide name="ListChecks" color={colors.border} size={56} />
          <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "600", marginTop: 16, textAlign: "center" }}>
            {mostrarArchivados ? "No hay hábitos archivados" : "Todavía no tenés hábitos"}
          </Text>
          {!mostrarArchivados && (
            <Text style={{ color: colors.textPlaceHolder, fontSize: 14, marginTop: 8, textAlign: "center" }}>
              Tocá el botón + para crear tu primer hábito
            </Text>
          )}
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <HabitoCard
              habito={item}
              onPress={() => navigation.navigate("FormHabito", { habito: item })}
            />
          )}
          renderSectionHeader={({ section: { categoria } }) => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 16, paddingBottom: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: categoria.color + "25", alignItems: "center", justifyContent: "center" }}>
                <IconLucide name={categoria.icono} color={categoria.color} size={13} />
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600", letterSpacing: 0.4 }}>
                {categoria.nombre.toUpperCase()}
              </Text>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate("FormHabito")}
        activeOpacity={0.85}
        style={{
          position: "absolute", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center", justifyContent: "center",
          elevation: 8,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45, shadowRadius: 10,
        }}
      >
        <IconLucide name="Plus" color="#FFFFFF" size={26} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
